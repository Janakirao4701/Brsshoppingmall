import { redirect } from 'next/navigation';

// This page is a fallback to ensure the root path always redirects to the default locale
// even if middleware is bypassed or there's an edge routing issue.
export default function RootPage() {
  redirect('/en');
}
