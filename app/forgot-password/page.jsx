import ForgotPassword from '../../src/views/ForgotPassword';
import RootLayoutShell from '../shell';

export const metadata = {
  title: 'Forgot Password | Aahvaaan',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <RootLayoutShell>
      <ForgotPassword />
    </RootLayoutShell>
  );
}
