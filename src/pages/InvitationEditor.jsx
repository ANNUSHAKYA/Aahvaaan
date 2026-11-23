import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Save, Check, AlertCircle, RefreshCw, Eye,
  ExternalLink, Image as ImageIcon, Trash2, Plus, Upload,
  Music, Calendar, MapPin, Users, Heart, Sparkles,
  Smartphone, Monitor, ChevronRight, Lock, CheckCircle2,
  Share2, ShieldAlert
} from 'lucide-react';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import templates from '../data/templates';
import TemplateRenderer from '../components/invitation/TemplateRenderer';
import { compressImageToWebP } from '../utils/imageCompressor';

// ─── Shloka Presets ───
const SHLOKA_PRESETS = [
  {
    label: 'Ganesha Vakratunda (Traditional)',
    text: '|| वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ||',
  },
  {
    label: 'Om Shri Ganeshaya Namah (Auspicious)',
    text: '|| ॐ श्री गणेशाय नमः || मांगलिकं कुर्युः सर्वकार्यार्थसिद्धये ||',
  },
  {
    label: 'Mangalam Bhagwan Vishnu (Sacred)',
    text: '|| मंगलम् भगवान विष्णुः मंगलम् गरुडध्वजः । मंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः ||',
  },
  {
    label: 'Ekadantaya Vighnaharta (Royal)',
    text: '|| ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि तन्नो दन्तिः प्रचोदयात् ||',
  },
];

// ─── Ceremonies Icon Presets ───
const EVENT_ICONS = ['🌿', '🎶', '✨', '💍', '👑', '🥂', '🕊️', '🥁', '🌸', '🪔'];

export default function InvitationEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [template, setTemplate] = useState(templates[0]);
  const [content, setContent] = useState(null);
  const [activeTab, setActiveTab] = useState('couple'); // 'couple' | 'date_venue' | 'lineage' | 'events' | 'story' | 'gallery' | 'audio'
  const [mobileMode, setMobileMode] = useState('edit'); // 'edit' or 'preview'
  const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile' or 'desktop'

  // Autosave State: 'saved' | 'saving' | 'unsaved' | 'error'
  const [saveStatus, setSaveStatus] = useState('saved');
  const [saveError, setSaveError] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  // Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Publishing Gate Modal
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // References for debounce
  const debouncedTimeoutRef = useRef(null);
  const initialLoadDone = useRef(false);

  // 1. Fetch Invitation from Supabase
  useEffect(() => {
    let isMounted = true;

    async function loadInvitation() {
      if (!user) return;
      setLoading(true);
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('invitations')
            .select('*')
            .eq('id', id)
            .eq('owner_id', user.id)
            .single();

          if (error) throw error;

          if (isMounted && data) {
            setInvitation(data);
            const tmpl = templates.find((t) => t.id === data.template_id) || templates[0];
            setTemplate(tmpl);

            // Merge draft_content with template defaults
            const baseDefaults = tmpl.sampleData || {};
            const initialContent = {
              ...baseDefaults,
              ...(data.draft_content || {}),
            };

            setContent(initialContent);
            setLoading(false);
            initialLoadDone.current = true;
          }
        } else {
          // Mock mode
          const mockTmpl = templates[0];
          setTemplate(mockTmpl);
          setContent(mockTmpl.sampleData);
          setInvitation({
            id: id || 'demo-id',
            slug: 'ananya-kabir-2027',
            status: 'draft',
            package: 'signature',
            template_id: mockTmpl.id,
          });
          setLoading(false);
          initialLoadDone.current = true;
        }
      } catch (err) {
        console.error('Error loading invitation:', err);
        setSaveError('Unable to load invitation. Please refresh or contact support.');
        setLoading(false);
      }
    }

    loadInvitation();

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  // 2. Autosave Functionality with Debounce
  const saveDraft = useCallback(
    async (contentToSave) => {
      if (!contentToSave || !invitation || !isSupabaseConfigured) return;

      setSaveStatus('saving');
      setSaveError(null);

      try {
        const { error } = await supabase
          .from('invitations')
          .update({
            draft_content: contentToSave,
          })
          .eq('id', invitation.id)
          .eq('owner_id', user.id);

        if (error) throw error;

        setSaveStatus('saved');
        setLastSavedAt(new Date());
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('error');
        setSaveError(err.message || 'Failed to save changes.');
      }
    },
    [invitation, user]
  );

  // Trigger debounced autosave on content change
  const handleContentChange = (updater) => {
    setContent((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };

      if (initialLoadDone.current) {
        setSaveStatus('unsaved');
        if (debouncedTimeoutRef.current) {
          clearTimeout(debouncedTimeoutRef.current);
        }
        debouncedTimeoutRef.current = setTimeout(() => {
          saveDraft(next);
        }, 1200);
      }

      return next;
    });
  };

  // Immediate Save Button
  const handleManualSave = () => {
    if (debouncedTimeoutRef.current) {
      clearTimeout(debouncedTimeoutRef.current);
    }
    saveDraft(content);
  };

  // 3. Image Upload with WebP Compression & Supabase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user || !invitation) return;

    setUploadingImage(true);
    setUploadError(null);

    try {
      // 1. Compress image to WebP client-side
      const compressedWebP = await compressImageToWebP(file, 1600, 1600, 0.82);

      // 2. Upload to Supabase Storage: invitation-assets/<userId>/<invitationId>/<filename>
      const filePath = `${user.id}/${invitation.id}/${compressedWebP.name}`;

      if (isSupabaseConfigured) {
        const { error: uploadErr } = await supabase.storage
          .from('invitation-assets')
          .upload(filePath, compressedWebP, {
            upsert: true,
            contentType: 'image/webp',
          });

        if (uploadErr) throw uploadErr;

        // 3. Get Public URL
        const { data: urlData } = supabase.storage
          .from('invitation-assets')
          .getPublicUrl(filePath);

        const publicUrl = urlData?.publicUrl;

        if (publicUrl) {
          handleContentChange((prev) => ({
            ...prev,
            gallery: [...(prev.gallery || []), publicUrl],
          }));
        }
      } else {
        // Fallback for mock environment
        const mockUrl = URL.createObjectURL(compressedWebP);
        handleContentChange((prev) => ({
          ...prev,
          gallery: [...(prev.gallery || []), mockUrl],
        }));
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setUploadError(err.message || 'Failed to upload photo. Please check your network or try another file.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Remove photo from gallery
  const handleRemovePhoto = (indexToRemove) => {
    handleContentChange((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Event handlers
  const handleAddEvent = () => {
    const newEvent = {
      name: 'New Auspicious Ceremony',
      date: content?.weddingDate || '2027-02-22',
      time: '6:00 PM',
      venue: content?.venue || 'The Oberoi Rajvilas',
      icon: '✨',
      description: 'Sacred blessings and festivities with family and loved ones.',
      dressCode: 'Traditional Elegance',
    };
    handleContentChange((prev) => ({
      ...prev,
      events: [...(prev.events || []), newEvent],
    }));
  };

  const handleUpdateEvent = (idx, field, value) => {
    handleContentChange((prev) => {
      const updated = [...(prev.events || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, events: updated };
    });
  };

  const handleRemoveEvent = (idx) => {
    handleContentChange((prev) => ({
      ...prev,
      events: (prev.events || []).filter((_, i) => i !== idx),
    }));
  };

  // Compliments handlers
  const handleAddCompliment = () => {
    handleContentChange((prev) => ({
      ...prev,
      compliments: [...(prev.compliments || []), { relation: 'Family Elder', names: 'Name of Relatives' }],
    }));
  };

  const handleUpdateCompliment = (idx, field, value) => {
    handleContentChange((prev) => {
      const updated = [...(prev.compliments || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, compliments: updated };
    });
  };

  const handleRemoveCompliment = (idx) => {
    handleContentChange((prev) => ({
      ...prev,
      compliments: (prev.compliments || []).filter((_, i) => i !== idx),
    }));
  };

  // 4. Publishing Gate
  const handlePublishClick = () => {
    setShowPublishModal(true);
  };

  const handleConfirmPublish = async () => {
    setPublishing(true);
    try {
      if (isSupabaseConfigured && invitation) {
        // Save current draft_content as published_content and update status
        const { error } = await supabase
          .from('invitations')
          .update({
            published_content: content,
            status: 'published',
            published_at: new Date().toISOString(),
          })
          .eq('id', invitation.id)
          .eq('owner_id', user.id);

        if (error) throw error;

        setInvitation((prev) => ({
          ...prev,
          status: 'published',
          published_content: content,
        }));
      }
      setShowPublishModal(false);
    } catch (err) {
      console.error('Publishing error:', err);
      setSaveError(err.message || 'Failed to publish invitation.');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-3 border-wine border-t-transparent animate-spin mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-wine">Opening Invitation Studio...</h2>
          <p className="font-body text-xs text-charcoal/60 mt-1">Loading template schema and live preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col font-body">
      {/* ════════════════ TOP STUDIO HEADER ════════════════ */}
      <header className="bg-white border-b border-champagne sticky top-0 z-40 px-4 py-3 shadow-2xs">
        <div className="flex items-center justify-between gap-3 max-w-[1700px] mx-auto">
          {/* Left: Back & Title */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-1.5 rounded-lg border border-champagne text-charcoal/70 hover:text-wine hover:border-wine transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft size={16} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-base sm:text-lg font-bold text-wine leading-tight truncate max-w-[180px] sm:max-w-xs">
                  {content?.brideName && content?.groomName
                    ? `${content.brideName} & ${content.groomName}`
                    : 'Wedding Invitation'}
                </h1>
                <span
                  className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: template.themeStyles.badgeBg,
                    color: template.themeStyles.badgeText,
                    borderColor: `${template.themeStyles.accentPrimary}40`,
                  }}
                >
                  {template.name}
                </span>
              </div>
              <p className="text-[11px] text-charcoal/50 flex items-center gap-1.5">
                <span>/{invitation?.slug}</span>
                <span>•</span>
                <span className="capitalize font-medium text-gold">{invitation?.package} Package</span>
              </p>
            </div>
          </div>

          {/* Center: Autosave Status Indicator */}
          <div className="hidden md:flex items-center gap-2 bg-ivory/80 px-3 py-1 rounded-full border border-champagne/80 text-xs">
            {saveStatus === 'saved' && (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="text-charcoal/70 font-medium">All changes saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <RefreshCw size={14} className="text-wine animate-spin" />
                <span className="text-wine font-medium">Saving draft...</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-charcoal/70">Unsaved changes</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle size={14} className="text-red-500" />
                <span className="text-red-600 font-medium truncate max-w-[200px]">Save failed</span>
              </>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Tab Toggle (Edit Form vs Live Preview) */}
            <div className="flex lg:hidden bg-champagne/40 rounded-lg p-0.5 border border-champagne">
              <button
                type="button"
                onClick={() => setMobileMode('edit')}
                className={`py-1 px-2.5 rounded-md text-xs font-semibold transition-all ${
                  mobileMode === 'edit' ? 'bg-white text-wine shadow-2xs' : 'text-charcoal/70'
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setMobileMode('preview')}
                className={`py-1 px-2.5 rounded-md text-xs font-semibold transition-all ${
                  mobileMode === 'preview' ? 'bg-white text-wine shadow-2xs' : 'text-charcoal/70'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Manual Save Button */}
            <button
              type="button"
              onClick={handleManualSave}
              disabled={saveStatus === 'saving'}
              className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-champagne hover:border-wine text-charcoal hover:text-wine text-xs font-semibold transition-colors"
            >
              <Save size={13} />
              <span>Save</span>
            </button>

            {/* Live Link Button */}
            <a
              href={`/invite/${invitation?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-champagne hover:border-wine text-charcoal hover:text-wine text-xs font-semibold transition-colors"
              title="Open full invitation in new tab"
            >
              <ExternalLink size={13} />
              <span>Preview Link</span>
            </a>

            {/* Publish Button */}
            <button
              type="button"
              onClick={handlePublishClick}
              className={`inline-flex items-center gap-1.5 py-1.5 px-3.5 sm:px-4 rounded-lg font-body text-xs uppercase tracking-wider font-semibold shadow-xs transition-all ${
                invitation?.status === 'published'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-wine hover:bg-gold text-white'
              }`}
            >
              <Sparkles size={13} />
              <span>{invitation?.status === 'published' ? 'Update Live' : 'Publish'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════ MAIN STUDIO WORKSPACE ════════════════ */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto overflow-hidden">
        {/* ──────────────── LEFT PANE: SCHEMA-DRIVEN FORM (52% on desktop) ──────────────── */}
        <div
          className={`w-full lg:w-[50%] xl:w-[48%] flex flex-col border-r border-champagne bg-ivory/50 overflow-y-auto max-h-[calc(100vh-60px)] ${
            mobileMode === 'edit' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Navigation Category Tabs */}
          <div className="bg-white border-b border-champagne px-4 py-2 sticky top-0 z-20 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 sm:gap-2 min-w-max">
              {[
                { id: 'couple', label: 'Couple Details', icon: Heart },
                { id: 'date_venue', label: 'Date & Venue', icon: Calendar },
                { id: 'lineage', label: 'Family Lineage', icon: Users },
                { id: 'events', label: 'Ceremonies', icon: Sparkles },
                { id: 'story', label: 'Love Story', icon: Heart },
                { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
                { id: 'audio', label: 'Shehnai Audio', icon: Music },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-wine text-white shadow-2xs'
                        : 'text-charcoal/70 hover:text-wine hover:bg-champagne/30'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content Body */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* ════ TAB 1: COUPLE DETAILS ════ */}
            {activeTab === 'couple' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white p-5 rounded-2xl border border-champagne shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-wine mb-4 flex items-center gap-2">
                    <Heart size={18} className="text-gold" />
                    <span>The Happy Couple</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Bride's Name *
                      </label>
                      <input
                        type="text"
                        value={content?.brideName || ''}
                        onChange={(e) => handleContentChange({ brideName: e.target.value })}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Groom's Name *
                      </label>
                      <input
                        type="text"
                        value={content?.groomName || ''}
                        onChange={(e) => handleContentChange({ groomName: e.target.value })}
                        placeholder="e.g. Kabir Singhania"
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Bride's Formal Salutation
                      </label>
                      <input
                        type="text"
                        value={content?.brideFormal || ''}
                        onChange={(e) => handleContentChange({ brideFormal: e.target.value })}
                        placeholder="e.g. Kum. Ananya Sharma or Baisa Radhika"
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Groom's Formal Salutation
                      </label>
                      <input
                        type="text"
                        value={content?.groomFormal || ''}
                        onChange={(e) => handleContentChange({ groomFormal: e.target.value })}
                        placeholder="e.g. Chi. Kabir Singhania or Banna Vikramaditya"
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Auspicious Sanskrit Shloka */}
                <div className="bg-white p-5 rounded-2xl border border-champagne shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-wine mb-2 flex items-center gap-2">
                    <Sparkles size={18} className="text-gold" />
                    <span>Auspicious Sanskrit Shloka</span>
                  </h3>
                  <p className="text-xs text-charcoal/60 mb-3">
                    Choose from traditional Vedic presets or write your family deity’s shloka.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {SHLOKA_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleContentChange({ shloka: preset.text })}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          content?.shloka === preset.text
                            ? 'border-wine bg-wine/5 font-semibold text-wine shadow-2xs'
                            : 'border-champagne bg-ivory/30 text-charcoal/70 hover:border-gold'
                        }`}
                      >
                        <span className="block font-semibold mb-0.5">{preset.label}</span>
                        <span className="block text-[11px] truncate opacity-70">{preset.text}</span>
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={content?.shloka || ''}
                    onChange={(e) => handleContentChange({ shloka: e.target.value })}
                    placeholder="Enter Sanskrit shloka..."
                    className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* ════ TAB 2: DATE & VENUE ════ */}
            {activeTab === 'date_venue' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white p-5 rounded-2xl border border-champagne shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-wine mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-gold" />
                    <span>Wedding Date & Destination</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Main Wedding Date *
                      </label>
                      <input
                        type="date"
                        value={content?.weddingDate || ''}
                        onChange={(e) => handleContentChange({ weddingDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        City / Destination *
                      </label>
                      <input
                        type="text"
                        value={content?.location || ''}
                        onChange={(e) => handleContentChange({ location: e.target.value })}
                        placeholder="e.g. Udaipur, Rajasthan"
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Detailed Venue Address *
                    </label>
                    <textarea
                      rows={2}
                      value={content?.venue || ''}
                      onChange={(e) => handleContentChange({ venue: e.target.value })}
                      placeholder="e.g. The Oberoi Udaivilas, Haridas Ji Ki Magri, Lake Pichola, Udaipur 313001"
                      className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center justify-between">
                      <span>Google Maps Location Link</span>
                      <button
                        type="button"
                        onClick={() => {
                          const query = encodeURIComponent(content?.venue || content?.location || 'Jaipur');
                          handleContentChange({ mapUrl: `https://maps.google.com/?q=${query}` });
                        }}
                        className="text-[10px] text-wine hover:underline font-semibold"
                      >
                        Auto-generate from Venue
                      </button>
                    </label>
                    <input
                      type="url"
                      value={content?.mapUrl || ''}
                      onChange={(e) => handleContentChange({ mapUrl: e.target.value })}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════ TAB 3: FAMILY LINEAGE & ELDERS ════ */}
            {activeTab === 'lineage' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {/* Groom's Lineage */}
                <div className="bg-white p-5 rounded-2xl border border-champagne shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-wine mb-4 flex items-center gap-2">
                    <Users size={18} className="text-gold" />
                    <span>Groom's Family Lineage</span>
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Son of (Parents)
                      </label>
                      <input
                        type="text"
                        value={content?.lineage?.groomParents || content?.groomLineage?.parents || ''}
                        onChange={(e) =>
                          handleContentChange((prev) => ({
                            ...prev,
                            lineage: { ...(prev.lineage || {}), groomParents: e.target.value },
                          }))
                        }
                        placeholder="e.g. Shri Vikram Singhania & Smt. Gayatri Singhania"
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Grandson of (Grandparents)
                      </label>
                      <input
                        type="text"
                        value={content?.lineage?.groomGrandparents || content?.groomLineage?.grandparents || ''}
                        onChange={(e) =>
                          handleContentChange((prev) => ({
                            ...prev,
                            lineage: { ...(prev.lineage || {}), groomGrandparents: e.target.value },
                          }))
                        }
                        placeholder="e.g. Late Shri Devendra Singhania & Late Smt. Kamala Devi Singhania"
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Bride's Lineage */}
                <div className="bg-white p-5 rounded-2xl border border-champagne shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-wine mb-4 flex items-center gap-2">
                    <Users size={18} className="text-gold" />
                    <span>Bride's Family Lineage</span>
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Daughter of (Parents)
                      </label>
                      <input
                        type="text"
                        value={content?.lineage?.brideParents || content?.brideLineage?.parents || ''}
                        onChange={(e) =>
                          handleContentChange((prev) => ({
                            ...prev,
                            lineage: { ...(prev.lineage || {}), brideParents: e.target.value },
                          }))
                        }
                        placeholder="e.g. Shri Rajesh Sharma & Smt. Sunita Sharma"
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Granddaughter of (Grandparents)
                      </label>
                      <input
                        type="text"
                        value={content?.lineage?.brideGrandparents || content?.brideLineage?.grandparents || ''}
                        onChange={(e) =>
                          handleContentChange((prev) => ({
                            ...prev,
                            lineage: { ...(prev.lineage || {}), brideGrandparents: e.target.value },
                          }))
                        }
                        placeholder="e.g. Late Shri Pandit Brij Mohan Sharma & Late Smt. Shanti Devi Sharma"
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* With Best Compliments From (स्नेही स्वजन) */}
                <div className="bg-white p-5 rounded-2xl border border-champagne shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-wine">
                        With Best Compliments From (स्नेही स्वजन)
                      </h3>
                      <p className="text-xs text-charcoal/60">
                        Honor aunts, uncles, and family elders.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCompliment}
                      className="py-1 px-2.5 rounded-lg bg-wine text-white text-xs font-semibold flex items-center gap-1 hover:bg-gold transition-colors"
                    >
                      <Plus size={13} />
                      <span>Add Elder</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(content?.compliments || []).map((comp, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-champagne/80 bg-ivory/30 flex items-center gap-2"
                      >
                        <div className="w-1/3">
                          <input
                            type="text"
                            value={comp.relation}
                            onChange={(e) => handleUpdateCompliment(idx, 'relation', e.target.value)}
                            placeholder="e.g. Chacha - Chachi"
                            className="w-full px-2.5 py-1.5 bg-white border border-champagne rounded-lg text-xs font-body focus:outline-none focus:border-wine"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={comp.names}
                            onChange={(e) => handleUpdateCompliment(idx, 'names', e.target.value)}
                            placeholder="Names & Family"
                            className="w-full px-2.5 py-1.5 bg-white border border-champagne rounded-lg text-xs font-body focus:outline-none focus:border-wine"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCompliment(idx)}
                          className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                          title="Remove compliment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════ TAB 4: CEREMONIES & ITINERARY ════ */}
            {activeTab === 'events' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-wine">
                      Ceremonies & Functions
                    </h3>
                    <p className="text-xs text-charcoal/60">
                      Add, reorder or customize all your wedding events.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEvent}
                    className="py-2 px-3.5 rounded-xl bg-wine text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-gold transition-colors shadow-2xs"
                  >
                    <Plus size={14} />
                    <span>Add Ceremony</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(content?.events || []).map((evt, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-2xl border border-champagne shadow-2xs transition-all hover:border-gold"
                    >
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-champagne/60 text-wine text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-heading text-base font-bold text-wine">
                            {evt.name || `Ceremony ${idx + 1}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveEvent(idx)}
                          className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-charcoal mb-1">
                            Ceremony Name *
                          </label>
                          <input
                            type="text"
                            value={evt.name || ''}
                            onChange={(e) => handleUpdateEvent(idx, 'name', e.target.value)}
                            placeholder="e.g. Sangeet Under The Stars"
                            className="w-full px-3 py-2 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-charcoal mb-1">
                            Icon / Symbol
                          </label>
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={evt.icon || '🌿'}
                              onChange={(e) => handleUpdateEvent(idx, 'icon', e.target.value)}
                              className="w-12 px-2 py-2 text-center bg-ivory/50 border border-champagne rounded-xl text-base font-body focus:outline-none"
                            />
                            <div className="flex items-center gap-1 overflow-x-auto">
                              {EVENT_ICONS.map((ic) => (
                                <button
                                  key={ic}
                                  type="button"
                                  onClick={() => handleUpdateEvent(idx, 'icon', ic)}
                                  className="p-1 rounded hover:bg-champagne/40 text-sm"
                                >
                                  {ic}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-charcoal mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={evt.date || ''}
                            onChange={(e) => handleUpdateEvent(idx, 'date', e.target.value)}
                            className="w-full px-3 py-2 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-charcoal mb-1">
                            Time
                          </label>
                          <input
                            type="text"
                            value={evt.time || ''}
                            onChange={(e) => handleUpdateEvent(idx, 'time', e.target.value)}
                            placeholder="e.g. 7:30 PM onwards"
                            className="w-full px-3 py-2 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-charcoal mb-1">
                            Specific Venue / Lawn
                          </label>
                          <input
                            type="text"
                            value={evt.venue || ''}
                            onChange={(e) => handleUpdateEvent(idx, 'venue', e.target.value)}
                            placeholder="e.g. The Crescent Waterfront Mandap"
                            className="w-full px-3 py-2 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-charcoal mb-1">
                            Dress Code
                          </label>
                          <input
                            type="text"
                            value={evt.dressCode || ''}
                            onChange={(e) => handleUpdateEvent(idx, 'dressCode', e.target.value)}
                            placeholder="e.g. Pastel Lehengas & Kurtas"
                            className="w-full px-3 py-2 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-charcoal mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={evt.description || ''}
                          onChange={(e) => handleUpdateEvent(idx, 'description', e.target.value)}
                          placeholder="A delicate afternoon of henna, folk melodies, pastel florals..."
                          className="w-full px-3 py-2 bg-ivory/50 border border-champagne rounded-xl text-xs font-body focus:outline-none focus:border-wine"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ════ TAB 5: LOVE STORY ════ */}
            {activeTab === 'story' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white p-5 rounded-2xl border border-champagne shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-wine mb-2 flex items-center gap-2">
                    <Heart size={18} className="text-gold" />
                    <span>A Note From Us (Our Story)</span>
                  </h3>
                  <p className="text-xs text-charcoal/60 mb-4">
                    Share a personal message, your meeting story, or gratitude with your wedding guests.
                  </p>

                  <textarea
                    rows={6}
                    value={content?.coupleStory || ''}
                    onChange={(e) => handleContentChange({ coupleStory: e.target.value })}
                    placeholder="Write how you met, your bond, and your welcoming words..."
                    className="w-full px-3.5 py-3 bg-ivory/50 border border-champagne rounded-xl text-xs sm:text-sm font-body leading-relaxed focus:outline-none focus:border-wine transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* ════ TAB 6: PHOTO GALLERY & WEBP UPLOADER ════ */}
            {activeTab === 'gallery' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white p-5 rounded-2xl border border-champagne shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading text-lg font-bold text-wine flex items-center gap-2">
                      <ImageIcon size={18} className="text-gold" />
                      <span>Pre-Wedding Photo Gallery</span>
                    </h3>
                    <span className="text-xs text-charcoal/50">
                      {(content?.gallery || []).length} photos uploaded
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/60 mb-4">
                    High-resolution couple portraits are automatically compressed to WebP format for fast mobile loading.
                  </p>

                  {/* Upload Drop Area */}
                  <div className="border-2 border-dashed border-champagne hover:border-wine rounded-2xl p-6 text-center bg-ivory/40 transition-colors mb-6">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="gallery-file-input"
                    />

                    {uploadingImage ? (
                      <div className="py-4">
                        <RefreshCw size={28} className="text-wine animate-spin mx-auto mb-2" />
                        <p className="font-heading text-sm font-bold text-wine">
                          Compressing to WebP & Uploading...
                        </p>
                        <p className="text-[11px] text-charcoal/60 mt-1">
                          Optimizing image for fast mobile delivery
                        </p>
                      </div>
                    ) : (
                      <label
                        htmlFor="gallery-file-input"
                        className="cursor-pointer block py-2"
                      >
                        <div className="w-12 h-12 rounded-full bg-champagne/60 text-wine flex items-center justify-center mx-auto mb-3">
                          <Upload size={20} />
                        </div>
                        <p className="font-heading text-sm font-bold text-wine">
                          Click to select a photo to upload
                        </p>
                        <p className="text-[11px] text-charcoal/50 mt-1">
                          PNG, JPG or WebP up to 10MB • Auto-compressed
                        </p>
                      </label>
                    )}
                  </div>

                  {uploadError && (
                    <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="flex-shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Uploaded Gallery Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(content?.gallery || []).map((imgUrl, i) => (
                      <div
                        key={i}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-champagne shadow-2xs bg-champagne/20"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery photo ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(i)}
                            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition-transform hover:scale-110"
                            title="Delete photo"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════ TAB 7: AUDIO & AMBIENCE ════ */}
            {activeTab === 'audio' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white p-5 rounded-2xl border border-champagne shadow-2xs">
                  <h3 className="font-heading text-lg font-bold text-wine mb-2 flex items-center gap-2">
                    <Music size={18} className="text-gold" />
                    <span>Traditional Shehnai & Tanpura Ambience</span>
                  </h3>
                  <p className="text-xs text-charcoal/60 mb-4">
                    Traditional instrumental music plays gently when the guest opens the royal envelope.
                  </p>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-ivory/50 border border-champagne mb-4">
                    <div>
                      <span className="font-heading text-sm font-bold text-wine block">
                        Enable Shehnai Music
                      </span>
                      <span className="text-xs text-charcoal/60">
                        Plays soft royal shehnai audio on mobile tap
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={content?.audio?.enabled !== false}
                        onChange={(e) =>
                          handleContentChange((prev) => ({
                            ...prev,
                            audio: { ...(prev.audio || {}), enabled: e.target.checked },
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-champagne peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wine" />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ──────────────── RIGHT PANE: REAL-TIME LIVE PREVIEW (48-50% on desktop) ──────────────── */}
        <div
          className={`w-full lg:w-[50%] xl:w-[52%] bg-neutral-900/5 flex flex-col items-center justify-start p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-60px)] ${
            mobileMode === 'preview' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Preview Toolbar */}
          <div className="w-full max-w-md flex items-center justify-between mb-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-champagne shadow-2xs">
            <span className="text-xs font-semibold text-wine flex items-center gap-1.5">
              <Eye size={14} className="text-gold" />
              <span>Live Real-Time Preview</span>
            </span>

            <div className="flex items-center gap-1 bg-champagne/40 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1 rounded text-xs transition-all ${
                  previewDevice === 'mobile' ? 'bg-white text-wine shadow-2xs' : 'text-charcoal/60'
                }`}
                title="Mobile Simulator View"
              >
                <Smartphone size={14} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1 rounded text-xs transition-all ${
                  previewDevice === 'desktop' ? 'bg-white text-wine shadow-2xs' : 'text-charcoal/60'
                }`}
                title="Full Responsive View"
              >
                <Monitor size={14} />
              </button>
            </div>
          </div>

          {/* Interactive Mobile Frame Simulator */}
          <div
            className={`w-full transition-all duration-300 ${
              previewDevice === 'mobile'
                ? 'max-w-md rounded-[38px] border-[8px] border-charcoal/90 shadow-2xl overflow-hidden relative'
                : 'max-w-2xl rounded-2xl border border-champagne shadow-md overflow-hidden'
            }`}
            style={{ backgroundColor: template.themeStyles.bgPrimary }}
          >
            {/* Phone notch */}
            {previewDevice === 'mobile' && (
              <div className="w-24 h-3.5 bg-charcoal/90 rounded-b-xl mx-auto mb-2" />
            )}

            {/* Render Template Purely from Dynamic Content */}
            <TemplateRenderer
              template={template}
              content={content}
              guestName="The Patidar Family"
            />
          </div>
        </div>
      </div>

      {/* ════════════════ PUBLISHING GATE MODAL ════════════════ */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-champagne text-center"
            >
              <div className="w-14 h-14 rounded-full bg-gold/20 text-wine flex items-center justify-center mx-auto mb-4">
                <Sparkles size={26} className="text-gold" />
              </div>

              <h3 className="font-heading text-2xl font-bold text-wine mb-2">
                {invitation?.status === 'published' ? 'Update Live Invitation?' : 'Publish Your Invitation'}
              </h3>

              <p className="font-body text-xs sm:text-sm text-charcoal/70 mb-6 leading-relaxed">
                {invitation?.status === 'published'
                  ? 'Your draft changes will immediately update the live link shared with guests.'
                  : 'Drafts and previews are free! Once published, your invitation goes live with guest tracking, RSVP collection, and personalized links.'}
              </p>

              <div className="p-4 rounded-2xl bg-ivory border border-champagne mb-6 text-left space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-charcoal/60">Template:</span>
                  <span className="text-wine">{template.name}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-charcoal/60">Package:</span>
                  <span className="capitalize text-gold font-bold">{invitation?.package} (₹{template.startingPrice})</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-charcoal/60">Live URL:</span>
                  <span className="text-wine">/invite/{invitation?.slug}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-3 rounded-xl border border-champagne text-charcoal text-xs font-semibold hover:bg-champagne/20 transition-colors"
                >
                  Keep as Draft
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPublish}
                  disabled={publishing}
                  className="flex-1 py-3 rounded-xl bg-wine hover:bg-gold text-white text-xs uppercase tracking-wider font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  {publishing ? 'Publishing...' : 'Confirm & Publish'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
