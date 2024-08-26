'use client';

import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { UserNav } from "@/components/usernav/user-nav";

export const Navbar: FC = () => {
    const [user, setUser] = useState<any>(null);
    const supabase = createClientComponentClient();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    const isAuthPage = pathname === '/auth/login' || pathname === '/auth/signup';

    return (
        <nav className="flex h-16 py-4 px-6 sm:px-12 items-center justify-between text-gray-800">
            <Link className="font-bold text-2xl hover:text-blue-600 transition duration-300" href="/">
                Huberman GPT
            </Link>
            <div className="flex items-center space-x-6">
                {user ? (
                    <UserNav user={user} onSignOut={handleSignOut} />
                ) : !isAuthPage && (
                    <>
                        <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 transition duration-300">
                            Login
                        </Link>
                        <Link href="/auth/signup" className="text-gray-600 hover:text-blue-600 transition duration-300">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};