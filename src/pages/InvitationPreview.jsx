import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ShoppingBag, Smartphone, Monitor, RotateCcw,
  UserCheck, Volume2, VolumeX, Edit3
} from 'lucide-react';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import templates from '../data/templates';
import useWeddingAudio from '../hooks/useWeddingAudio';
import TemplateRenderer from '../components/invitation/TemplateRenderer';

export default function InvitationPreview() {
  const { id } = useParams();

  // Find template by id or default to first
  const template = templates.find((t) => t.id === id) || templates[0];
  const { themeStyles } = template;

  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [viewMode, setViewMode] = useState('full'); // 'full' or 'mobile'
  const [guestName, setGuestName] = useState('The Patidar Family');
  const [customGuestActive, setCustomGuestActive] = useState(false);
  const [dynamicContent, setDynamicContent] = useState(template.sampleData);
  const { isPlaying, toggle: toggleAudio, start: startAudio } = useWeddingAudio();

  // Fetch Supabase default_content for this template if configured
  useEffect(() => {
    let isMounted = true;
    async function loadTemplateContent() {
      if (!isSupabaseConfigured) return;
      try {
        const { data } = await supabase
          .from('templates')
          .select('default_content')
          .eq('slug', template.id)
          .maybeSingle();

        if (isMounted && data?.default_content) {
          setDynamicContent((prev) => ({
            ...prev,
            ...data.default_content,
          }));
        }
      } catch (err) {
        // Fallback silently to template.sampleData
      }
    }

    loadTemplateContent();
    return () => {
      isMounted = false;
    };
  }, [template.id]);

  return (
    <div className="pt-20 min-h-screen bg-ivory">
      {/* Top Floating Action Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-champagne sticky top-16 md:top-20 z-40 shadow-xs">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Back & Info */}
          <div className="flex items-center gap-3">
            <Link
              to="/invitations"
              className="inline-flex items-center gap-1.5 text-charcoal/70 hover:text-wine font-body text-xs font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Designs</span>
            </Link>

            <span className="hidden sm:inline-block text-charcoal/30">|</span>

            <div className="hidden sm:flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border border-champagne"
                style={{ backgroundColor: themeStyles.buttonBg }}
              />
              <span className="font-heading text-sm font-bold text-wine">
                {template.name}
              </span>
              <span className="text-xs text-gold font-body">
                ({template.collection})
              </span>
            </div>
          </div>

          {/* Interactive Guest Name Personalization Tester */}
          <div className="hidden lg:flex items-center gap-2 bg-ivory px-3 py-1 rounded-full border border-champagne">
            <UserCheck size={13} className="text-gold" />
            <span className="text-[11px] font-body text-charcoal/70">Test Guest Greeting:</span>
            {!customGuestActive ? (
              <div className="flex items-center gap-1.5">
                <select
                  value={guestName}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setCustomGuestActive(true);
                      setGuestName('');
                    } else {
                      setGuestName(e.target.value);
                    }
                  }}
                  className="bg-transparent text-xs font-semibold text-wine focus:outline-none cursor-pointer"
                >
                  <option value="The Patidar Family">The Patidar Family</option>
                  <option value="Mr. & Mrs. Sharma">Mr. & Mrs. Sharma</option>
                  <option value="Kapoor Family (Chacha-Chachi)">Kapoor Family (Chacha-Chachi)</option>
                  <option value="Arjun & Dearest Friends">Arjun & Dearest Friends</option>
                  <option value="__custom__">Type Custom Name...</option>
                </select>
                <button
                  type="button"
                  onClick={() => setCustomGuestActive(true)}
                  className="text-gold hover:text-wine p-0.5"
                  title="Type custom name"
                >
                  <Edit3 size={11} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Gupta Family"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-32 px-2 py-0.5 text-xs bg-white border border-champagne rounded text-wine font-semibold focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setCustomGuestActive(false)}
                  className="text-[10px] text-charcoal/60 hover:text-wine underline"
                >
                  Presets
                </button>
              </div>
            )}
          </div>

          {/* Controls: Shehnai, Replay Envelope, Device Toggle, Buy Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ambient Wedding Shehnai */}
            <button
              onClick={toggleAudio}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-wine text-white shadow-xs'
                  : 'bg-ivory text-charcoal/70 border border-champagne hover:border-wine hover:text-wine'
              }`}
              title={isPlaying ? 'Pause Traditional Shehnai' : 'Play Traditional Shehnai'}
            >
              {isPlaying ? (
                <>
                  <Volume2 size={14} className="text-gold" />
                  <span className="hidden sm:inline">Shehnai Music</span>
                  <span className="flex items-end gap-0.5 h-3 ml-0.5">
                    <span className="w-0.5 h-3 bg-gold rounded-full animate-pulse" />
                    <span className="w-0.5 h-2 bg-gold rounded-full animate-bounce" />
                    <span className="w-0.5 h-2.5 bg-gold rounded-full animate-pulse delay-75" />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX size={14} />
                  <span className="hidden sm:inline">Play Shehnai</span>
                </>
              )}
            </button>

            {/* Replay Envelope */}
            <button
              onClick={() => setEnvelopeOpen(false)}
              className="p-2 rounded-lg text-charcoal/60 hover:text-wine hover:bg-champagne/30 text-xs font-body flex items-center gap-1 transition-all"
              title="Replay Envelope Opening Animation"
            >
              <RotateCcw size={14} />
              <span className="hidden md:inline">Replay</span>
            </button>

            {/* View Mode Simulator */}
            <div className="bg-champagne/40 rounded-lg p-0.5 flex items-center">
              <button
                onClick={() => setViewMode('full')}
                className={`p-1.5 rounded-md text-xs transition-all ${
                  viewMode === 'full' ? 'bg-white text-wine shadow-xs' : 'text-charcoal/60'
                }`}
                title="Full Screen View"
              >
                <Monitor size={15} />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-md text-xs transition-all ${
                  viewMode === 'mobile' ? 'bg-white text-wine shadow-xs' : 'text-charcoal/60'
                }`}
                title="Mobile Device Frame Preview"
              >
                <Smartphone size={15} />
              </button>
            </div>

            {/* Buy This Template CTA */}
            <Link
              to={`/buy/${template.id}`}
              className="inline-flex items-center gap-1.5 py-2 px-3.5 sm:px-4 rounded-lg bg-wine hover:bg-gold text-white font-body text-xs uppercase tracking-wider font-semibold shadow-md transition-all duration-300"
            >
              <ShoppingBag size={14} />
              <span>Buy This Template</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className={`mx-auto ${viewMode === 'mobile' ? 'max-w-md py-10 px-4' : 'w-full'}`}>
        <div
          className={`overflow-hidden transition-all duration-500 ${
            viewMode === 'mobile'
              ? 'rounded-[40px] border-[10px] border-charcoal shadow-2xl relative'
              : 'shadow-none'
          }`}
          style={{ backgroundColor: themeStyles.bgPrimary }}
        >
          {viewMode === 'mobile' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-charcoal rounded-full z-30" />
          )}

          {/* Pure Data-Driven Template Renderer */}
          <TemplateRenderer
            template={template}
            content={dynamicContent}
            guestName={guestName}
            showEnvelope={!envelopeOpen}
            onOpenEnvelope={() => {
              setEnvelopeOpen(true);
              startAudio();
            }}
          />

          {/* Bottom Call to Action Section */}
          <section
            className="py-16 px-6 text-center border-t"
            style={{
              backgroundColor: themeStyles.bgPrimary,
              borderColor: `${themeStyles.accentPrimary}40`,
            }}
          >
            <div className="max-w-xl mx-auto">
              <p
                className="font-body text-xs uppercase tracking-[0.25em] font-semibold mb-2"
                style={{ color: themeStyles.accentSecondary }}
              >
                Love This Invitation Style?
              </p>
              <h3
                className="font-heading text-3xl sm:text-4xl font-bold mb-4"
                style={{ color: themeStyles.textPrimary }}
              >
                Customise {template.name} for Your Wedding
              </h3>
              <p
                className="font-body text-sm leading-relaxed mb-8"
                style={{ color: themeStyles.textSecondary }}
              >
                Choose Starter (₹999), Signature (₹1,499), or Luxury (₹1,999). Receive your live link with RSVP tracking, Google Maps, and WhatsApp delivery in 24–48 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={`/buy/${template.id}`}
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-lg font-body text-xs uppercase tracking-widest font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    backgroundColor: themeStyles.buttonBg,
                    color: themeStyles.buttonText,
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>Buy This Template Now</span>
                </Link>

                <Link
                  to="/invitations"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg font-body text-xs uppercase tracking-widest font-semibold border transition-all duration-300"
                  style={{
                    borderColor: themeStyles.buttonBg,
                    color: themeStyles.buttonBg,
                  }}
                >
                  <span>Explore All 4 Signature Designs</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating Bottom Sticky Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl bg-white/95 backdrop-blur-md border border-champagne/80 shadow-2xl rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-body text-charcoal/60 uppercase tracking-wider block">
            {template.name} • {template.collection}
          </span>
          <span className="font-heading text-base sm:text-lg font-bold text-wine">
            {template.priceDisplay || 'Starts at ₹999'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/buy/${template.id}`}
            className="inline-flex items-center gap-1.5 py-2.5 px-4 sm:px-6 rounded-xl bg-wine hover:bg-gold text-white font-body text-xs uppercase tracking-wider font-semibold shadow-md transition-all duration-300"
          >
            <ShoppingBag size={14} />
            <span>Buy This Template</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
