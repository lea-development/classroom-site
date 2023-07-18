import Image from "next/image";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full border-b-[3px] h-16 flex sticky top-0 bg-white z-10">
      <div className="w-2/4 pl-8 flex">
        <Link href={"/classes"} className="flex justify-start items-center">
          <div className="w-24 h-12 flex justify-center items-center">
            <Image src="/assets/logo.svg" alt="" width="60" height="40" />
          </div>
          <h1 className="text-xl text-neutral-600 font-medium">Classroom</h1>
        </Link>
      </div>

      <div className="w-2/4 pr-4 flex justify-end items-center">
        <LogoutButton />
      </div>
    </div>
  );
}
