import ResetPassword from '../../src/views/ResetPassword';
import RootLayoutShell from '../shell';

export const metadata = {
  title: 'Reset Password | Aahvaaan',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <RootLayoutShell>
      <ResetPassword />
    </RootLayoutShell>
  );
}
