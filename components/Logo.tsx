"use client";

import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <Image
        src="/logo.png"
        alt="Farm2Table"
        width={120}
        height={24}
        className="object-contain dark:hidden hidden md:block"
        priority
      />
      <Image
        src="/logo_dark.png"
        alt="Farm2Table"
        width={120}
        height={24}
        className="object-contain hidden dark:md:block"
        priority
      />
    </div>
  );
};

export default Logo;
