'use client';

import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import FloatingWhatsApp from '../src/components/FloatingWhatsApp';

export default function RootLayoutShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
