import Login from '../../src/views/Login';
import RootLayoutShell from '../shell';

export const metadata = {
  title: 'Sign In | Aahvaaan',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <RootLayoutShell>
      <Login />
    </RootLayoutShell>
  );
}
