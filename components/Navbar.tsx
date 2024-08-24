'use client';

import Link from "next/link";
import { FC } from "react";

export const Navbar: FC = () => {
    return (
        <div className="flex h-[60px] border-b border-gray-100 py-2 px-4 sm:px-8 items-center justify-between bg-gray-900 text-gray-300">
            <Link className="font-bold text-2xl hover:opacity-70 transition duration-150" href="/">
                Huberman GPT
            </Link>
            <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-700 transition duration-150">
                    Login
                </Link>
                <Link href="/auth/signup" className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 transition duration-150">
                    Sign Up
                </Link>
            </div>
        </div>
    );
};