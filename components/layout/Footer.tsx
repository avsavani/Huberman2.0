'use client';

import { IconBrandGithub, IconBrandTwitter } from "@tabler/icons-react";
import Image from "next/image";
import { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer className="flex h-[50px] border-t border-gray-300 py-2 px-4 sm:px-8 items-center justify-between text-xs bg-white">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <a
          className="flex items-center hover:opacity-50"
          href="https://twitter.com/ashishsavani1"
          target="_blank"
          rel="noreferrer"
        >
          <Image src="/logo-black.png" width={20} height={20} alt="Logo" />
        </a>
        <a
          className="flex items-center hover:opacity-50"
          href="https://github.com/avsavani/HubermanGPT"
          target="_blank"
          rel="noreferrer"
        >
          <Image src="/github-mark.svg" width={20} height={20} alt="GitHub Logo" />
        </a>
      </div>

      <div className="hidden sm:block text-center italic">
        Created by
        <a
          className="hover:opacity-50 mx-1 font-semibold"
          href="https://twitter.com/ashishsavani1"
          target="_blank"
          rel="noreferrer"
        >
          Ashish Savani
        </a>
      </div>

      <div className="flex items-center">
        <a
          className="flex items-center hover:opacity-50"
          href="https://www.buymeacoffee.com/avsavani"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/bmc-button.svg"
            alt="Buy Me a Coffee"
            width={100}
            height={100}
            style={{ height: 'auto' }}
          />
        </a>
      </div>
    </footer>
  );
};