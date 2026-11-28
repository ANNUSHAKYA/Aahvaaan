import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://nvoynqxwkbtzdlgbjvfl.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b3lucXh3a2J0emRsZ2JqdmZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0MzAzMzIsImV4cCI6MjExMTAwNjMzMn0.Y0zB8XKG8fC2_Pb1pdTNXi9-sbOxfcjVuZrmbw6T6VM';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be ignored if called from route handler
          }
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Ensure target destination is internal and safe
      const destination = next.startsWith('/') ? next : '/dashboard';
      return NextResponse.redirect(`${origin}${destination}`);
    }

    console.error('Auth code exchange error:', error.message);
  }

  // Return to login with error parameter if exchange fails
  return NextResponse.redirect(`${origin}/login?error=Could+not+authenticate+user`);
}
