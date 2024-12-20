import { cookies } from 'next/headers';
import type { Metadata } from 'next';

import localFont from 'next/font/local';

import './globals.css';

import { CognitoProvider } from '@/app/cognito.provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Log Booky',
  description:
    'Save your jumps and make notes for you and your fellow skydivers easier.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await cookies();

  return (
    <CognitoProvider cookies={store.toString()}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </html>
    </CognitoProvider>
  );
}
