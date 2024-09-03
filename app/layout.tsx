'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/layout/Navbar"
import { AuthProvider } from "@/contexts/authContext"
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Footer } from "@/components/layout/Footer"
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("No user found, redirecting to login");
        router.push('/auth/login');
      } else {
        console.log("User found, staying on current page");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AuthProvider>
    <div className={cn(
      "bg-background flex flex-col h-screen font-sans antialiased",
      fontSans.variable
    )}>
      <Navbar />
      <div className="flex-1 flex-grow overflow-y-auto  bg-gray-100">
        {children}
      </div>
      <Footer />
    </div>
    </AuthProvider>
  );
}