import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Invitations from './pages/Invitations';
import InvitationPreview from './pages/InvitationPreview';
import BuyTemplate from './pages/BuyTemplate';
import Pricing from './pages/Pricing';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';
import PublicInvitation from './pages/PublicInvitation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import InvitationEditor from './pages/InvitationEditor';

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

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
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
    </AuthProvider>
  );
}

export default App;
