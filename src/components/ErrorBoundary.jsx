import React from 'react';
import { Link } from '../lib/router-compat';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F5]">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
            Something went wrong loading this preview
          </h2>
          <p className="font-body text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
            We encountered a temporary issue rendering this invitation. You can reload or browse other templates.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-full bg-wine hover:bg-wine-light text-white text-xs font-semibold shadow-md transition-all"
            >
              Reload Page
            </button>
            <Link
              to="/templates"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-xs font-semibold shadow-2xs transition-all"
            >
              Browse All Templates
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
