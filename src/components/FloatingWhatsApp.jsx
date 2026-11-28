'use client';

import { MessageCircle } from 'lucide-react';
import siteConfig, { getWhatsAppUrl } from '../../lib/siteConfig';

export default function FloatingWhatsApp() {
  const whatsappUrl = getWhatsAppUrl("Hi, I'd like to know more about Aahvaaan");

  return (
    <aside
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 group"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 min-h-[48px] rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_10px_30px_rgba(37,211,102,0.6)] active:scale-95 transition-all duration-300 border border-white/30 backdrop-blur-xs"
      >
        <MessageCircle size={22} className="fill-white stroke-none shrink-0" />
        <span className="font-body text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap hidden sm:inline-block">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
}
