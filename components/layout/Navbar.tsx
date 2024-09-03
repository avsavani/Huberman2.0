'use client';

import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { UserNav } from "@/components/usernav/user-nav";
import { userService, UserProfile } from '@/services/userService';

export const Navbar: FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            console.log("Checking session...");
            try {
                const { user } = await userService.getCurrentUser();
                console.log("User data received:", user);
                setUser(user);
            } catch (error) {
                console.error("Error checking session:", error);
                setError("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        const unsubscribe = userService.onAuthStateChange((event, session) => {
            console.log("Auth state changed:", event, session);
            if (event === 'SIGNED_OUT') {
                setUser(null);
            } else if (session?.user) {
                setUser(session.user as UserProfile);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        setLoading(true);
        await userService.signOut();
        setUser(null);
        setLoading(false);
        router.push('/');
    };

    const isAuthPage = pathname === '/auth/login' || pathname === '/auth/signup';

    console.log("Rendering Navbar. User:", user, "Loading:", loading);

    return (
        <nav className="flex h-16 py-4 px-6 sm:px-12 items-center justify-between text-gray-800">
            <Link className="font-bold text-2xl hover:text-blue-600 transition duration-300" href="/">
                Huberman GPT
            </Link>
            <div className="flex items-center space-x-6">
                {loading ? (
                    <span>Loading...</span>
                ) : error ? (
                    <span className="text-red-500">{error}</span>
                ) : user ? (
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