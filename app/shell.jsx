'use client';

import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import FloatingWhatsApp from '../src/components/FloatingWhatsApp';

export default function RootLayoutShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      <main id="main-content" className="flex-1 focus:outline-none">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
