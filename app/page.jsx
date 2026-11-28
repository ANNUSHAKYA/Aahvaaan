'use client';

import Home from '../src/views/Home';
import RootLayoutShell from './shell';

export default function HomePage() {
  return (
    <RootLayoutShell>
      <Home />
    </RootLayoutShell>
  );
}
