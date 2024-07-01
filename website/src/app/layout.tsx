import './index.css';

import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'joyboy community',
  description: 'joyboy community',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
