"use client";

import Image from "next/image";

export default function CopyLink({ link }: { link: string }) {
  return (
    <div
      className="
      bg-white 
      rounded-lg 
      w-40 
      p-2 
      cursor-pointer 
      flex 
      flex-row 
      justify-center 
      items-center
      absolute
      left-5
      top-5
      hover:opacity-90 
      active:opacity-80
      select-none
    "
      onClick={() => navigator.clipboard.writeText(link)}
    >
      <Image src={"/assets/copy.svg"} alt="copy icon" width={22} height={22} />
      Copy invite link
    </div>
  );
}
