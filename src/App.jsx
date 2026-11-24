import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Lazy-loaded pages for fast initial bundle & 4G performance
const Home = lazy(() => import('./pages/Home'));
const Invitations = lazy(() => import('./pages/Invitations'));
const InvitationPreview = lazy(() => import('./pages/InvitationPreview'));
const BuyTemplate = lazy(() => import('./pages/BuyTemplate'));
const Pricing = lazy(() => import('./pages/Pricing'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PublicInvitation = lazy(() => import('./pages/PublicInvitation'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const InvitationEditor = lazy(() => import('./pages/InvitationEditor'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
      <div className="w-10 h-10 rounded-full border-3 border-wine border-t-transparent animate-spin mb-3" />
      <span className="font-heading text-sm text-wine tracking-wider font-semibold">
        Aahvaaan by Vow & Vision
      </span>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="invitations" element={<Invitations />} />
            <Route path="gallery" element={<Invitations />} />
            <Route path="invitations/:id" element={<InvitationPreview />} />
            <Route path="try/:id" element={<InvitationPreview />} />
            <Route path="buy" element={<BuyTemplate />} />
            <Route path="buy/:id" element={<BuyTemplate />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            {/* Protected Host Dashboard Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* Platform Admin Dashboard */}
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Protected Live Studio Editor (Split-screen Workspace) */}
          <Route
            path="dashboard/invitations/:id/edit"
            element={
              <ProtectedRoute>
                <InvitationEditor />
              </ProtectedRoute>
            }
          />

          {/* Dedicated Guest Invitation Routes (Standalone Mobile-First Experience) */}
          <Route path="invite/r/:personalSlug" element={<PublicInvitation isPersonalized={true} />} />
          <Route path="invite/:code" element={<PublicInvitation />} />
          <Route path="invite/:slug" element={<PublicInvitation />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
