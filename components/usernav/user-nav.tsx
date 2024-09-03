import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { userService, UserProfile } from '@/services/userService';
import { useRouter } from 'next/navigation'; // Add this import
import { Skeleton } from "@/components/ui/skeleton"; // Add this import

interface UserNavProps {
  user: UserProfile;
  onSignOut: () => void;
}


export function UserNav({ user, onSignOut }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleProfileClick = () => {
    router.push('/forms');
  };

  const handleLogout = () => {
    onSignOut();
    router.push('/');
  };
  if (!user) return null;

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="relative h-8 w-8 rounded-full p-0 overflow-hidden hover:bg-gray-700 focus:ring-2 focus:ring-gray-400"
        >
          <motion.div
            initial={false}
            animate={{ backgroundColor: isOpen ? "white" : "#1F2937" }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-full w-full">
              <circle cx="24" cy="16" r="8" fill="#E5E7EB"/>
              <path d="M24 28c-11 0-20 9-20 20h40c0-11-9-20-20-20z" fill="#9CA3AF"/>
            </svg>
          </motion.div>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={handleProfileClick}>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/billing">
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/forms/settings">
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}