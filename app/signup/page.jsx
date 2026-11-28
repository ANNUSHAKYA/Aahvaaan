import Signup from '../../src/views/Signup';
import RootLayoutShell from '../shell';

export const metadata = {
  title: 'Create an Account | Aahvaaan',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupPage() {
  return (
    <RootLayoutShell>
      <Signup />
    </RootLayoutShell>
  );
}
