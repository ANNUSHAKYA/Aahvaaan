'use client';

import React, { Suspense } from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import ErrorBoundary from '../src/components/ErrorBoundary';

function LoadingFallback() {
  return null;
}

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
      </ErrorBoundary>
    </AuthProvider>
  );
}
