import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ArrowLeft, ArrowRight, Send, MessageCircle,
  Sparkles, CheckCircle2, ShieldCheck, Heart, Eye, CreditCard
} from 'lucide-react';
import templates from '../data/templates';
import packages from '../data/pricing';
import config from '../data/config';
import SectionHeading from '../components/SectionHeading';
import { FloralDivider } from '../components/Ornaments';
import { initiatePayment } from '../utils/razorpay';

export default function BuyTemplate() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Find template by id or default to the first one
  const selectedTemplate = templates.find((t) => t.id === id) || templates[0];

  // Preselected package from query param or default to 'signature'
  const packageParam = searchParams.get('package');
  const initialPackage = packages.find((p) => p.id === packageParam) || packages[1]; // default to Signature

  const [selectedPkg, setSelectedPkg] = useState(initialPackage);
  const [form, setForm] = useState({
    customerName: '',
    whatsapp: '',
    email: '',
    brideName: selectedTemplate?.sampleData?.bride || '',
    groomName: selectedTemplate?.sampleData?.groom || '',
    weddingDate: '',
    additionalRequirements: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [payingOnline, setPayingOnline] = useState(false);

  const handleOnlinePayment = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setPayingOnline(true);
    try {
      await initiatePayment({
        packageId: selectedPkg.id,
        userEmail: form.email,
        userName: form.customerName,
        userPhone: form.whatsapp,
        onSuccess: () => {
          navigate('/dashboard?payment=success');
        },
        onError: (err) => {
          alert(err.message || 'Payment could not be completed.');
          setPayingOnline(false);
        },
      });
    } catch (err) {
      console.error(err);
      setPayingOnline(false);
    }
  };

  // Scroll to form when package changes
  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTemplateSwitch = (newId) => {
    navigate(`/buy/${newId}${selectedPkg ? `?package=${selectedPkg.id}` : ''}`);
  };

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = 'Please enter your full name';
    if (!form.whatsapp.trim()) {
      errs.whatsapp = 'Please enter your WhatsApp number';
    } else if (!/^[0-9+ ]{10,16}$/.test(form.whatsapp.trim())) {
      errs.whatsapp = 'Please enter a valid phone/WhatsApp number';
    }
    if (!form.email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!form.brideName.trim()) errs.brideName = 'Please enter the bride’s name';
    if (!form.groomName.trim()) errs.groomName = 'Please enter the groom’s name';
    if (!form.weddingDate) errs.weddingDate = 'Please select your wedding date';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      `✨ *NEW INVITATION ORDER ENQUIRY* ✨`,
      `*Brand:* ${config.brandName} (${config.websiteName})`,
      ``,
      `🎨 *Selected Template:* ${selectedTemplate.name} – ${selectedTemplate.collection}`,
      `📦 *Selected Package:* ${selectedPkg.name} (${selectedPkg.priceDisplay})`,
      ``,
      `👤 *Customer Name:* ${form.customerName}`,
      `📱 *WhatsApp:* ${form.whatsapp}`,
      `📧 *Email:* ${form.email}`,
      ``,
      `💍 *Couple:* ${form.brideName} & ${form.groomName}`,
      `📅 *Wedding Date:* ${form.weddingDate}`,
      form.additionalRequirements
        ? `\n📝 *Custom Requirements:*\n${form.additionalRequirements}`
        : '',
      ``,
      `— Please confirm availability and share next steps for design customisation.`,
    ];
    return lines.filter(Boolean).join('\n');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const messageText = encodeURIComponent(buildWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${messageText}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    setIsSubmitted(true);
  };

  const inputClasses = (name) =>
    `w-full px-4 py-3 bg-white border ${
      errors[name] ? 'border-red-400' : 'border-champagne'
    } rounded-lg font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all`;

  return (
    <div className="pt-20 bg-ivory min-h-screen">
      {/* Top Banner: Selected Template Header */}
      <section className="bg-wine text-white py-10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L60 0H0L30 30z' fill='%23B69A70'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              to={`/invitations/${selectedTemplate.id}`}
              className="inline-flex items-center gap-2 text-gold-light hover:text-white font-body text-xs tracking-wider uppercase transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Invitation Preview
            </Link>

            {/* Template Selector dropdown */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              <span className="font-body text-xs text-white/70">Change Design:</span>
              <select
                value={selectedTemplate.id}
                onChange={(e) => handleTemplateSwitch(e.target.value)}
                className="bg-transparent text-gold font-body text-xs font-semibold focus:outline-none cursor-pointer"
                aria-label="Change Selected Template"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id} className="bg-wine text-white">
                    {t.name} – {t.collection}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Template Thumbnail Mockup */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="relative aspect-[3/4] max-w-[220px] rounded-lg overflow-hidden border-2 border-gold/40 shadow-2xl">
                <img
                  src={selectedTemplate.image}
                  alt={selectedTemplate.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wine/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-body font-medium">
                    {selectedTemplate.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Template Summary Details */}
            <div className="md:col-span-8 lg:col-span-9">
              <div className="inline-block bg-gold/20 text-gold-light px-3 py-1 rounded-full text-xs font-heading tracking-widest uppercase mb-3">
                Selected Signature Design
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {selectedTemplate.name}
              </h1>
              <p className="font-heading text-lg sm:text-xl text-gold italic mb-4">
                {selectedTemplate.collection}
              </p>
              <p className="font-body text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed mb-6">
                {selectedTemplate.shortDescription}
              </p>

              {/* Color Palette Preview */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-body text-xs uppercase tracking-wider text-white/60">
                  Palette:
                </span>
                <div className="flex items-center gap-2">
                  {selectedTemplate.colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-md">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[11px] text-white/90 font-body">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container: Package Selection + Enquiry Form */}
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Step Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <SectionHeading
            subtitle="Step 1 of 2: Select Package"
            title={`Choose Your Package for ${selectedTemplate.name}`}
            description="Select the experience that fits your wedding celebration. Package prices are starting prices and any custom additions can be discussed separately."
          />
        </div>

        {/* 3 Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-20">
          {packages.map((pkg) => {
            const isSelected = selectedPkg?.id === pkg.id;
            return (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  isSelected
                    ? 'ring-3 ring-gold shadow-2xl bg-white scale-[1.02]'
                    : 'bg-white card-shadow border border-champagne/60 hover:border-gold/50'
                }`}
              >
                {/* Header Badge */}
                {pkg.popular ? (
                  <div className="bg-gold text-white text-center py-2 text-xs font-semibold uppercase tracking-wider font-body">
                    ★ Most Popular Choice
                  </div>
                ) : (
                  <div className="bg-champagne/40 text-charcoal/70 text-center py-2 text-xs font-semibold uppercase tracking-wider font-body">
                    {pkg.badge}
                  </div>
                )}

                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  {/* Package Name & Price */}
                  <div className="mb-4">
                    <h3 className="font-heading text-2xl font-bold text-wine mb-1">
                      {pkg.name}
                    </h3>
                    <p className="font-body text-xs text-charcoal/60 leading-relaxed min-h-[36px]">
                      {pkg.tagline}
                    </p>
                  </div>

                  <div className="my-4 pb-4 border-b border-champagne/40">
                    <span className="font-heading text-4xl sm:text-5xl font-bold text-wine">
                      {pkg.priceDisplay}
                    </span>
                    <span className="font-body text-xs text-charcoal/50 block mt-1">
                      Starting price • Inclusive of personalised styling
                    </span>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 font-body text-xs text-charcoal/80 leading-relaxed">
                        <Check size={16} className="text-gold flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Choose Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectPackage(pkg)}
                    className={`w-full py-3.5 px-4 rounded-lg font-body text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-gold text-white shadow-md'
                        : 'bg-wine text-white hover:bg-wine-light'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 size={16} /> Selected: {pkg.name}
                      </>
                    ) : (
                      <>
                        {pkg.ctaText}
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Note on starting prices */}
        <div className="max-w-3xl mx-auto mb-16 p-4 rounded-lg bg-champagne/30 border border-champagne text-center">
          <p className="font-body text-xs text-charcoal/70 leading-relaxed">
            💡 <strong>Note:</strong> Package prices are starting prices for standard configurations. Any custom ceremonies, bespoke music compositions, or extensive revisions can be discussed directly with our design team.
          </p>
        </div>

        {/* Step 2: Order Enquiry Form */}
        <div ref={formRef} className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-10 card-shadow border border-champagne/60">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-heading text-3xl font-bold text-wine mb-3">
                  Order Enquiry Prepared!
                </h3>
                <p className="font-body text-sm text-charcoal/80 max-w-md mx-auto mb-6 leading-relaxed">
                  Your enquiry for <strong>{selectedTemplate.name}</strong> ({selectedPkg.name} Package) has been formatted and opened in WhatsApp.
                </p>
                <div className="bg-ivory rounded-lg p-5 max-w-md mx-auto text-left mb-8 border border-champagne/60 space-y-2 text-xs font-body">
                  <p><strong className="text-wine">Design:</strong> {selectedTemplate.name} ({selectedTemplate.collection})</p>
                  <p><strong className="text-wine">Package:</strong> {selectedPkg.name} ({selectedPkg.priceDisplay})</p>
                  <p><strong className="text-wine">Couple:</strong> {form.brideName} & {form.groomName}</p>
                  <p><strong className="text-wine">Date:</strong> {form.weddingDate}</p>
                  <p><strong className="text-wine">Contact:</strong> {form.customerName} ({form.whatsapp})</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary py-3 px-6 text-xs flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} /> Re-open WhatsApp
                  </a>
                  <Link
                    to="/invitations"
                    className="btn-secondary py-3 px-6 text-xs flex items-center justify-center gap-2"
                  >
                    Explore More Designs
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="border-b border-champagne/50 pb-6 mb-8">
                  <span className="font-body text-xs uppercase tracking-[0.2em] text-gold font-medium block mb-2">
                    Step 2 of 2: Order Enquiry
                  </span>
                  <h2 className="font-heading text-3xl font-bold text-wine">
                    Customise & Request Your Invitation
                  </h2>
                  <p className="font-body text-xs text-charcoal/60 mt-1">
                    Fill in your details to initiate your digital wedding invitation order via WhatsApp. No upfront online payment required.
                  </p>
                </div>

                {/* Prepopulated Selection Summary Bar */}
                <div className="bg-ivory rounded-xl p-4 sm:p-5 mb-8 border border-champagne flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedTemplate.image}
                      alt={selectedTemplate.name}
                      className="w-12 h-14 object-cover rounded-md border border-champagne"
                    />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-charcoal/50 block font-body">
                        Chosen Template
                      </span>
                      <h4 className="font-heading text-lg font-bold text-wine leading-tight">
                        {selectedTemplate.name}
                      </h4>
                      <span className="text-xs text-gold font-body">
                        {selectedTemplate.collection}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-charcoal/50 block font-body">
                      Chosen Package
                    </span>
                    <span className="font-heading text-xl font-bold text-wine">
                      {selectedPkg.name}
                    </span>
                    <span className="text-xs text-gold font-semibold block font-body">
                      {selectedPkg.priceDisplay}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  {/* Customer Name */}
                  <div>
                    <label htmlFor="customerName" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Your Full Name <span className="text-rose">*</span>
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      placeholder="e.g. Priya Deshmukh"
                      className={inputClasses('customerName')}
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-xs mt-1 font-body">{errors.customerName}</p>
                    )}
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label htmlFor="whatsapp" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      WhatsApp Number <span className="text-rose">*</span>
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      name="whatsapp"
                      value={form.whatsapp}
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      className={inputClasses('whatsapp')}
                    />
                    {errors.whatsapp && (
                      <p className="text-red-500 text-xs mt-1 font-body">{errors.whatsapp}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Email Address <span className="text-rose">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={inputClasses('email')}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 font-body">{errors.email}</p>
                    )}
                  </div>

                  {/* Bride's Name */}
                  <div>
                    <label htmlFor="brideName" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Bride's Name <span className="text-rose">*</span>
                    </label>
                    <input
                      id="brideName"
                      type="text"
                      name="brideName"
                      value={form.brideName}
                      onChange={handleChange}
                      placeholder="Bride's Name"
                      className={inputClasses('brideName')}
                    />
                    {errors.brideName && (
                      <p className="text-red-500 text-xs mt-1 font-body">{errors.brideName}</p>
                    )}
                  </div>

                  {/* Groom's Name */}
                  <div>
                    <label htmlFor="groomName" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Groom's Name <span className="text-rose">*</span>
                    </label>
                    <input
                      id="groomName"
                      type="text"
                      name="groomName"
                      value={form.groomName}
                      onChange={handleChange}
                      placeholder="Groom's Name"
                      className={inputClasses('groomName')}
                    />
                    {errors.groomName && (
                      <p className="text-red-500 text-xs mt-1 font-body">{errors.groomName}</p>
                    )}
                  </div>

                  {/* Wedding Date */}
                  <div className="sm:col-span-2">
                    <label htmlFor="weddingDate" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Wedding Date <span className="text-rose">*</span>
                    </label>
                    <input
                      id="weddingDate"
                      type="date"
                      name="weddingDate"
                      value={form.weddingDate}
                      onChange={handleChange}
                      className={inputClasses('weddingDate')}
                    />
                    {errors.weddingDate && (
                      <p className="text-red-500 text-xs mt-1 font-body">{errors.weddingDate}</p>
                    )}
                  </div>

                  {/* Additional Requirements */}
                  <div className="sm:col-span-2">
                    <label htmlFor="additionalRequirements" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Additional Requirements / Custom Notes (Optional)
                    </label>
                    <textarea
                      id="additionalRequirements"
                      name="additionalRequirements"
                      rows={4}
                      value={form.additionalRequirements}
                      onChange={handleChange}
                      placeholder="Tell us about your events, special themes, music preferences, or any specific design changes you have in mind..."
                      className={inputClasses('additionalRequirements')}
                    />
                  </div>
                </div>

                {/* Submit Actions: Razorpay & WhatsApp */}
                <div className="pt-4 border-t border-champagne/40 space-y-3">
                  <button
                    type="button"
                    onClick={handleOnlinePayment}
                    disabled={payingOnline}
                    className="w-full py-4 text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 rounded-xl bg-wine hover:bg-gold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    <CreditCard size={18} />
                    <span>
                      {payingOnline
                        ? 'Opening Razorpay Checkout...'
                        : `Pay Online via Razorpay (${selectedPkg.priceDisplay})`}
                    </span>
                  </button>

                  <button
                    type="submit"
                    className="w-full py-3.5 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 rounded-xl border border-emerald-600/40 text-emerald-800 hover:bg-emerald-50 transition-colors"
                  >
                    <MessageCircle size={17} className="text-emerald-600" />
                    <span>Order / Enquire via WhatsApp</span>
                  </button>

                  <p className="font-body text-[11px] text-charcoal/50 text-center mt-2 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={14} className="text-gold" />
                    Secure INR payment powered by Razorpay. 100% money-back guarantee.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
