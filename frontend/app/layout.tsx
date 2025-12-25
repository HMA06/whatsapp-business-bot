import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NestJS Multitenant App',
  description: 'Frontend for NestJS Multitenant System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
