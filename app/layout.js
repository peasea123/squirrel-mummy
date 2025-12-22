import './globals.css';

export const metadata = {
  title: 'Squirrel Mummy',
  description: 'A digital artifact',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
