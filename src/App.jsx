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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
        </Route>
        {/* Dedicated Guest Invitation Route (Standalone Mobile-First Experience) */}
        <Route path="invite/:slug" element={<PublicInvitation />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
