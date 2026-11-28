import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, Instagram, MessageCircle, CheckCircle } from 'lucide-react';
import config from '../data/config';
import packages from '../data/pricing';
import templates from '../data/templates';
import SectionHeading from '../components/SectionHeading';
import SEO from '../components/SEO';

const initialForm = {
  name: '',
  whatsapp: '',
  email: '',
  brideName: '',
  groomName: '',
  weddingDate: '',
  package: '',
  template: '',
  requirements: '',
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Please enter your name';
    if (!form.whatsapp.trim()) errs.whatsapp = 'Please enter your WhatsApp number';
    else if (!/^[0-9+ ]{10,16}$/.test(form.whatsapp.trim()))
      errs.whatsapp = 'Please enter a valid phone number';
    if (!form.email.trim()) errs.email = 'Please enter your email';
    else if (!/\S+@\S+\.\S+/.test(form.email.trim()))
      errs.email = 'Please enter a valid email address';
    if (!form.brideName.trim()) errs.brideName = 'Please enter the bride\'s name';
    if (!form.groomName.trim()) errs.groomName = 'Please enter the groom\'s name';
    if (!form.weddingDate) errs.weddingDate = 'Please select the wedding date';
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
      `✨ *Wedding Invitation Enquiry* ✨`,
      `*Brand:* ${config.brandName}`,
      ``,
      `👤 *Name:* ${form.name}`,
      `📱 *WhatsApp:* ${form.whatsapp}`,
      `📧 *Email:* ${form.email}`,
      ``,
      `💍 *Couple:* ${form.brideName} & ${form.groomName}`,
      `📅 *Wedding Date:* ${form.weddingDate}`,
      form.template ? `🎨 *Selected Design:* ${form.template}` : '',
      form.package ? `📦 *Selected Package:* ${form.package}` : '',
      form.requirements ? `\n📝 *Additional Requirements:*\n${form.requirements}` : '',
      ``,
      `— Sent from ${config.websiteName}`,
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

    const message = encodeURIComponent(buildWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  const inputClasses = (fieldName) =>
    `w-full px-4 py-3 bg-white border ${
      errors[fieldName] ? 'border-red-400' : 'border-champagne'
    } rounded-lg font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all`;

  if (submitted) {
    return (
      <div className="pt-20">
        <section className="section-padding">
          <div className="container-custom mx-auto text-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle size={64} className="text-gold mx-auto mb-6" />
              <h1 className="heading-lg mb-4">Enquiry Sent!</h1>
              <p className="text-body mb-4">
                Your enquiry has been prepared and opened in WhatsApp. Please send the message to initiate your order.
              </p>
              <p className="font-body text-sm text-charcoal/60 mb-8">
                If the WhatsApp window didn't open automatically, please reach us directly at{' '}
                <a href={`mailto:${config.email}`} className="text-wine underline font-medium">{config.email}</a>.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm(initialForm); }}
                className="btn-secondary"
              >
                Send Another Enquiry
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <SEO
        title="Contact Us & Book Your Invitation | Aahvaaan"
        description="Get in touch with Aahvaaan by Vow & Vision. Book your bespoke digital wedding invitation, discuss custom requirements, or chat on WhatsApp."
        url="https://aahvaaan.vercel.app/contact"
      />
      {/* Header */}
      <section className="section-padding bg-champagne/30 pb-8">
        <div className="container-custom mx-auto">
          <SectionHeading
            subtitle="Let's Connect"
            title="Create Your Dream Invitation"
            description="Have questions or bespoke wedding invitation requirements? Reach out directly and our design team will guide you every step of the way."
          />
        </div>
      </section>

      <section className="section-padding pt-8">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 md:p-8 card-shadow border border-champagne/40">
                <h3 className="font-heading text-2xl font-bold text-wine mb-6">Wedding Invitation Enquiry</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Your Name <span className="text-rose">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={inputClasses('name')}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label htmlFor="whatsapp" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      WhatsApp Number <span className="text-rose">*</span>
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={form.whatsapp}
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      className={inputClasses('whatsapp')}
                    />
                    {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Email Address <span className="text-rose">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className={inputClasses('email')}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Bride Name */}
                  <div>
                    <label htmlFor="brideName" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Bride's Name <span className="text-rose">*</span>
                    </label>
                    <input
                      type="text"
                      id="brideName"
                      name="brideName"
                      value={form.brideName}
                      onChange={handleChange}
                      placeholder="Bride's full name"
                      className={inputClasses('brideName')}
                    />
                    {errors.brideName && <p className="text-red-500 text-xs mt-1">{errors.brideName}</p>}
                  </div>

                  {/* Groom Name */}
                  <div>
                    <label htmlFor="groomName" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Groom's Name <span className="text-rose">*</span>
                    </label>
                    <input
                      type="text"
                      id="groomName"
                      name="groomName"
                      value={form.groomName}
                      onChange={handleChange}
                      placeholder="Groom's full name"
                      className={inputClasses('groomName')}
                    />
                    {errors.groomName && <p className="text-red-500 text-xs mt-1">{errors.groomName}</p>}
                  </div>

                  {/* Wedding Date */}
                  <div>
                    <label htmlFor="weddingDate" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Wedding Date <span className="text-rose">*</span>
                    </label>
                    <input
                      type="date"
                      id="weddingDate"
                      name="weddingDate"
                      value={form.weddingDate}
                      onChange={handleChange}
                      className={inputClasses('weddingDate')}
                    />
                    {errors.weddingDate && <p className="text-red-500 text-xs mt-1">{errors.weddingDate}</p>}
                  </div>

                  {/* Package */}
                  <div>
                    <label htmlFor="package" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Preferred Package
                    </label>
                    <select
                      id="package"
                      name="package"
                      value={form.package}
                      onChange={handleChange}
                      className={inputClasses('package')}
                    >
                      <option value="">Select a package</option>
                      {packages.map((p) => (
                        <option key={p.id} value={`${p.name} (${p.priceDisplay})`}>
                          {p.name} – {p.priceDisplay}
                        </option>
                      ))}
                      <option value="Custom Bespoke Package">Custom Bespoke Requirements</option>
                    </select>
                  </div>

                  {/* Signature Template */}
                  <div className="md:col-span-2">
                    <label htmlFor="template" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Preferred Signature Invitation Design
                    </label>
                    <select
                      id="template"
                      name="template"
                      value={form.template}
                      onChange={handleChange}
                      className={inputClasses('template')}
                    >
                      <option value="">Select an invitation design</option>
                      {templates.map((t) => (
                        <option key={t.id} value={`${t.name} (${t.collection})`}>
                          {t.name} – {t.collection}
                        </option>
                      ))}
                      <option value="Custom / Completely New Theme">Completely custom / unique theme</option>
                    </select>
                  </div>

                  {/* Additional Requirements */}
                  <div className="md:col-span-2">
                    <label htmlFor="requirements" className="block font-body text-xs font-semibold text-charcoal mb-1.5 uppercase tracking-wider">
                      Additional Requirements / Ceremony Notes
                    </label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      value={form.requirements}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your wedding ceremonies (Haldi, Mehendi, Sangeet, Wedding, Reception), venue, or any specific design elements..."
                      className={inputClasses('requirements')}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full mt-6 py-4 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send Enquiry via WhatsApp
                </button>

                <p className="font-body text-xs text-charcoal/50 text-center mt-3">
                  This opens WhatsApp with a pre-formatted message. You can review all details before sending.
                </p>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 card-shadow border border-champagne/40">
                <h3 className="font-heading text-lg font-bold text-wine mb-4">Contact Directly</h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href={`https://wa.me/${config.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-body text-sm text-charcoal hover:text-wine transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <MessageCircle size={18} />
                      </div>
                      <div>
                        <span className="block font-semibold">WhatsApp Chat</span>
                        <span className="text-xs text-charcoal/50">Instant response</span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${config.email}`}
                      className="flex items-center gap-3 font-body text-sm text-charcoal hover:text-wine transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-champagne/50 flex items-center justify-center text-wine">
                        <Mail size={18} />
                      </div>
                      <div>
                        <span className="block font-semibold">Email Us</span>
                        <span className="text-xs text-charcoal/50">{config.email}</span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href={config.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-body text-sm text-charcoal hover:text-wine transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                        <Instagram size={18} />
                      </div>
                      <div>
                        <span className="block font-semibold">Instagram</span>
                        <span className="text-xs text-charcoal/50">{config.instagramHandle}</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-champagne/30 rounded-xl p-6 border border-champagne/50">
                <h3 className="font-heading text-lg font-bold text-wine mb-2">Dedicated Turnaround</h3>
                <p className="font-body text-xs text-charcoal/70 leading-relaxed">
                  We typically deliver the first personalised preview link within <strong className="text-wine">24 to 48 hours</strong> after receiving your wedding details.
                </p>
              </div>

              <div className="bg-champagne/30 rounded-xl p-6 border border-champagne/50">
                <h3 className="font-heading text-lg font-bold text-wine mb-3">Order Flow</h3>
                <ol className="space-y-2.5 font-body text-xs text-charcoal/70">
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">1.</span>
                    Select your template & package
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">2.</span>
                    Send details over WhatsApp
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">3.</span>
                    Review your live private preview link
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gold font-bold">4.</span>
                    Finalise and share with guests worldwide
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
