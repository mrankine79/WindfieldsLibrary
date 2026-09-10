import './globals.css';
import Header from '../components/Header';

export const metadata = {
  title: 'Windfields Library',
  description: 'Room 214 · Open before school, at lunch, and after school',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
