import './globals.css';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Restaurant Management System',
  description: 'Browse and manage restaurants',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-background text-foreground">
      <body className="min-h-screen">
        {/* 🔥 تم حذف Google Maps Script لأنه لم يعد مستخدم */}
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#f9f9f9',
              color: '#333',
            },
          }}
        />
      </body>
    </html>
  );
}
