import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart, Calendar, MapPin, Clock, Share2, Sparkles,
  Utensils, Volume2, VolumeX, Check, AlertCircle, ArrowLeft
} from 'lucide-react';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import templates from '../data/templates';
import useWeddingAudio from '../hooks/useWeddingAudio';
import TemplateRenderer from '../components/invitation/TemplateRenderer';
import { getCachedInvitation, setCachedInvitation } from '../utils/cache';
import { checkRateLimit, recordRateLimitAction } from '../utils/rateLimiter';

// ─── Live RPC RSVP Form ───
function LiveRSVPForm({
  invitationId,
  guest = null,
  themeStyles = {},
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: guest?.name || '',
    phone: guest?.phone || '',
    status: 'attending',
    guestCount: 1,
    dietary: 'Pure Vegetarian',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync if guest changes
  useEffect(() => {
    if (guest) {
      setFormData((prev) => ({
        ...prev,
        name: guest.name || prev.name,
        phone: guest.phone || prev.phone,
      }));
    }
  }, [guest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name or family name.');
      return;
    }
    const cleanPhone = (formData.phone || '').replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for RSVP confirmation.');
      return;
    }

    // Client-side rate limiting (max 5 per 10 mins)
    const rlKey = `rsvp_${invitationId}_${cleanPhone}`;
    const rlCheck = checkRateLimit(rlKey, 5, 10);
    if (!rlCheck.allowed) {
      setErrorMessage(rlCheck.error);
      return;
    }

    setSubmitting(true);
    try {
      const isInvUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(invitationId);
      const isGuestUuid = guest?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guest.id);

      if (isSupabaseConfigured && invitationId && isInvUuid && invitationId !== '00000000-0000-0000-0000-000000000000') {
        const { data, error } = await supabase.rpc('submit_guest_rsvp', {
          p_invitation_id: invitationId,
          p_name: formData.name.trim(),
          p_phone: cleanPhone,
          p_status: formData.status,
          p_guest_count: parseInt(formData.guestCount, 10) || 1,
          p_dietary: formData.dietary,
          p_message: formData.message.trim() || null,
          p_guest_id: isGuestUuid ? guest.id : null,
        });

        if (error) throw error;
        if (data && data.success === false) {
          throw new Error(data.error || 'Failed to submit RSVP');
        }
      } else {
        // Fallback for sample demo / non-UUID testing
        try {
          const stored = JSON.parse(localStorage.getItem('aahvaaan_demo_rsvps') || '[]');
          stored.push({ ...formData, phone: cleanPhone, submittedAt: new Date().toISOString() });
          localStorage.setItem('aahvaaan_demo_rsvps', JSON.stringify(stored));
        } catch {
          // ignore
        }
      }

      recordRateLimitAction(rlKey);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('RSVP submission error:', err);
      setErrorMessage(err.message || 'Unable to submit RSVP. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6 px-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: `${themeStyles.accentPrimary || '#B69A70'}30` }}
        >
          <Heart size={22} style={{ color: themeStyles.textPrimary || '#704B50' }} />
        </div>
        <h4
          className="font-heading text-2xl font-bold mb-2"
          style={{ color: themeStyles.textPrimary || '#704B50' }}
        >
          Response Received!
        </h4>
        <p className="font-body text-xs max-w-xs mx-auto mb-4" style={{ color: themeStyles.textSecondary || '#65575A' }}>
          {formData.status === 'attending'
            ? 'We are delighted and eagerly look forward to celebrating with you and your family!'
            : formData.status === 'maybe'
            ? 'Thank you for updating us. We hope you will be able to join us!'
            : 'Thank you for letting us know. Your warm blessings remain cherished!'}
        </p>

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs font-semibold underline"
          style={{ color: themeStyles.buttonBg || '#704B50' }}
        >
          Update My Response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto text-left font-body">
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Guest Name */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: themeStyles.textPrimary || '#704B50' }}>
          Your Name / Family Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Rajesh & Sunita Sharma"
          disabled={Boolean(guest?.name)}
          className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-body focus:outline-none disabled:bg-ivory disabled:opacity-80"
          style={{ borderColor: `${themeStyles.accentPrimary || '#B69A70'}60` }}
        />
      </div>

      {/* Guest Phone */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: themeStyles.textPrimary || '#704B50' }}>
          WhatsApp / Mobile Number *
        </label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="e.g. +91 98765 43210"
          className="w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs font-body focus:outline-none"
          style={{ borderColor: `${themeStyles.accentPrimary || '#B69A70'}60` }}
        />
        <span className="text-[10px] text-charcoal/50 mt-0.5 block">
          Used to sync repeat responses and send wedding reminders.
        </span>
      </div>

      {/* Attending Options */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: themeStyles.textPrimary || '#704B50' }}>
          Will you grace the celebration? *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'attending', label: 'Joyfully Attend' },
            { value: 'maybe', label: 'Tentative / Maybe' },
            { value: 'not_attending', label: 'Regretfully Decline' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFormData({ ...formData, status: opt.value })}
              className={`py-2 px-2 rounded-xl text-[11px] font-semibold text-center transition-all ${
                formData.status === opt.value
                  ? 'text-white shadow-2xs font-bold'
                  : 'bg-white border text-charcoal/80 hover:bg-champagne/20'
              }`}
              style={{
                backgroundColor: formData.status === opt.value ? (themeStyles.buttonBg || '#704B50') : undefined,
                borderColor: `${themeStyles.accentPrimary || '#B69A70'}60`,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guest count & dietary if attending/maybe */}
      {formData.status !== 'not_attending' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: themeStyles.textPrimary || '#704B50' }}>
              Number of Guests
            </label>
            <select
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
              className="w-full px-3 py-2 bg-white border rounded-xl text-xs font-body focus:outline-none"
              style={{ borderColor: `${themeStyles.accentPrimary || '#B69A70'}60` }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: themeStyles.textPrimary || '#704B50' }}>
              <Utensils size={12} /> Food Preference
            </label>
            <select
              value={formData.dietary}
              onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
              className="w-full px-3 py-2 bg-white border rounded-xl text-xs font-body focus:outline-none"
              style={{ borderColor: `${themeStyles.accentPrimary || '#B69A70'}60` }}
            >
              <option value="Pure Vegetarian">Pure Vegetarian</option>
              <option value="Jain (No Onion/Garlic)">Jain (No Onion/Garlic)</option>
              <option value="Multi-Cuisine">Multi-Cuisine</option>
            </select>
          </div>
        </div>
      )}

      {/* Warm Blessings / Message */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: themeStyles.textPrimary || '#704B50' }}>
          Warm Blessings & Wishes for the Couple (Optional)
        </label>
        <textarea
          rows={2}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Write your heartfelt wishes..."
          className="w-full px-3.5 py-2 bg-white border rounded-xl text-xs font-body focus:outline-none"
          style={{ borderColor: `${themeStyles.accentPrimary || '#B69A70'}60` }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl text-xs uppercase tracking-wider font-semibold shadow-sm transition-all text-white disabled:opacity-50"
        style={{ backgroundColor: themeStyles.buttonBg || '#704B50' }}
      >
        {submitting ? 'Recording RSVP...' : 'Submit RSVP Response'}
      </button>

      <p className="text-[10px] text-charcoal/50 text-center">
        Responses update instantly for the host family.
      </p>
    </form>
  );
}

// ─── Main Public / Guest Invitation Page ───
export default function PublicInvitation({ isPersonalized = false }) {
  const params = useParams();
  const personalSlug = params.personalSlug;
  const commonCode = params.code || params.slug;

  const [loading, setLoading] = useState(true);
  const [invitationData, setInvitationData] = useState(null);
  const [template, setTemplate] = useState(templates[0]);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const { isPlaying, toggle: toggleAudio, start: startAudio } = useWeddingAudio();

  // Load invitation via Security Definer RPC with fast caching
  useEffect(() => {
    let isMounted = true;
    const cacheKey = personalSlug ? `p_${personalSlug}` : `c_${commonCode}`;

    // 1. Check client-side cache for instant render on 4G
    const cachedData = getCachedInvitation(cacheKey);
    if (cachedData) {
      setInvitationData(cachedData);
      const tmpl = templates.find((t) => t.id === cachedData.template?.id) || templates[0];
      setTemplate(tmpl);
      setLoading(false);
      const b = cachedData.content?.brideName || 'Bride';
      const g = cachedData.content?.groomName || 'Groom';
      document.title = `${b} & ${g}'s Wedding Invitation | Aahvaaan`;
    }

    async function loadData() {
      if (!cachedData) setLoading(true);
      try {
        let fetchedData = null;

        if (isSupabaseConfigured) {
          if (personalSlug) {
            // Personalized route: /invite/r/:personalSlug
            const { data, error } = await supabase.rpc('get_invitation_by_personal_slug', {
              p_personal_slug: personalSlug,
            });
            if (!error && data) fetchedData = data;
          } else if (commonCode) {
            // Common code route: /invite/:code
            const { data, error } = await supabase.rpc('get_invitation_by_common_code', {
              p_code: commonCode,
            });
            if (!error && data) fetchedData = data;
          }
        }

        if (isMounted) {
          if (fetchedData) {
            setInvitationData(fetchedData);
            setCachedInvitation(cacheKey, fetchedData);
            const tmpl = templates.find((t) => t.id === fetchedData.template?.id) || templates[0];
            setTemplate(tmpl);

            // Dynamically set document title for browser & WhatsApp preview
            const b = fetchedData.content?.brideName || 'Bride';
            const g = fetchedData.content?.groomName || 'Groom';
            document.title = `${b} & ${g}'s Wedding Invitation | Aahvaaan`;

            // Record guest view asynchronously if valid UUID
            const isInvUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fetchedData.id);
            const isGuestUuid = fetchedData.guest?.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(fetchedData.guest.id);

            if (isInvUuid) {
              const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
              supabase.rpc('record_guest_view', {
                p_invitation_id: fetchedData.id,
                p_guest_id: isGuestUuid ? fetchedData.guest.id : null,
                p_device_type: deviceType,
              }).catch(() => {});
            }
          } else if (!cachedData) {
            // Fallback sample invitation
            const fallbackTmpl = templates[0];
            setTemplate(fallbackTmpl);
            setInvitationData({
              id: '00000000-0000-0000-0000-000000000000',
              slug: commonCode || 'ananya-kabir-2027',
              content: fallbackTmpl.sampleData,
              is_personalized: Boolean(personalSlug),
              guest: personalSlug ? { name: 'Respected Guest & Family' } : null,
              template: { id: fallbackTmpl.id, name: fallbackTmpl.name },
            });
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading invitation:', err);
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [personalSlug, commonCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-3 border-wine border-t-transparent animate-spin mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-wine">Opening Auspicious Invitation...</h2>
          <p className="font-body text-xs text-charcoal/60 mt-1">Aahvaaan by Vow & Vision</p>
        </div>
      </div>
    );
  }

  if (!invitationData) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-champagne shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-wine mb-2">Invitation Not Found</h2>
          <p className="font-body text-xs text-charcoal/70 mb-6 leading-relaxed">
            The link you followed may be incorrect, expired, or the ceremony link is waiting to be published by the host.
          </p>
          <Link to="/" className="inline-block py-3 px-6 rounded-xl bg-wine text-white text-xs uppercase tracking-widest font-semibold">
            Visit Aahvaaan Home
          </Link>
        </div>
      </div>
    );
  }

  const themeStyles = template.themeStyles || {};
  const activeGuestName = invitationData.guest?.name || 'Respected Guest & Family';
  const content = invitationData.content || template.sampleData;
  const brideName = content?.brideName || content?.bride || 'Bride';
  const groomName = content?.groomName || content?.groom || 'Groom';

  return (
    <div className="min-h-screen bg-ivory font-body antialiased">
      {/* Floating Sticky Top Bar for Guest (Music & WhatsApp Share) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-champagne/80 px-4 py-2.5 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Couple Monogram */}
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-white font-heading font-bold text-xs"
              style={{ backgroundColor: themeStyles.buttonBg || '#704B50' }}
            >
              आ
            </span>
            <span
              className="font-heading text-sm font-bold truncate max-w-[160px]"
              style={{ color: themeStyles.textPrimary || '#704B50' }}
            >
              {brideName.split(' ')[0]} & {groomName.split(' ')[0]}
            </span>
          </div>

          {/* Audio Player & WhatsApp Share */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-wine text-white shadow-2xs'
                  : 'bg-ivory text-charcoal/70 border border-champagne'
              }`}
              title={isPlaying ? 'Pause Shehnai Music' : 'Play Shehnai Music'}
            >
              {isPlaying ? (
                <>
                  <Volume2 size={13} className="text-gold" />
                  <span>Shehnai</span>
                  <span className="flex items-end gap-0.5 h-2.5 ml-0.5">
                    <span className="w-0.5 h-2.5 bg-gold rounded-full animate-pulse" />
                    <span className="w-0.5 h-1.5 bg-gold rounded-full animate-bounce" />
                    <span className="w-0.5 h-2 bg-gold rounded-full animate-pulse delay-75" />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX size={13} />
                  <span>Mute</span>
                </>
              )}
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Auspicious Wedding Invitation: ${brideName} & ${groomName} cordially invite you! Open your invitation here: ${window.location.href}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              title="Share on WhatsApp"
            >
              <Share2 size={15} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Invitation Body */}
      <main className="w-full max-w-2xl px-0 mx-auto pb-20">
        <TemplateRenderer
          template={template}
          content={content}
          guestName={activeGuestName}
          showEnvelope={!envelopeOpen}
          onOpenEnvelope={() => {
            setEnvelopeOpen(true);
            startAudio();
          }}
          rsvpComponent={
            <LiveRSVPForm
              invitationId={invitationData.id}
              guest={invitationData.guest}
              themeStyles={themeStyles}
            />
          }
        />

        {/* Footer Credit & Create Link */}
        <footer className="text-center pt-8 pb-4">
          <Link to="/" className="inline-block group">
            <span className="font-heading text-base font-bold text-wine group-hover:text-gold transition-colors block">
              Aahvaaan
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold block">
              by Vow & Vision
            </span>
          </Link>
          <p className="text-[10px] text-charcoal/40 mt-1">
            Create your digital wedding invitation in minutes
          </p>
        </footer>
      </main>
    </div>
  );
}
