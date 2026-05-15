import React from 'react';
import { AuthNav } from '../../components/auth-nav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthNav />
      {children}
    </>
  );
}
