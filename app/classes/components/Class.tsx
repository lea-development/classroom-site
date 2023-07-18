import Link from "next/link";
import Image from "next/image";
import Button from "@/app/components/Button";
import { Prisma } from "@prisma/client";

type ClassData = Prisma.ClassGetPayload<{
  include: {
    teacher: {
      select: {
        name: true;
        image: true;
        surname: true;
      };
    };
  };
}>;

export default function Class(classData: ClassData) {
  // TODO: bad fix. classData.color may be null but backgroundColor only accepts string
  let color = classData.color ? classData.color : "red";

  return (
    <div
      className="
        hover:transform hover:translate-x-[1px] hover:-translate-y-[1px] transition duration-200
        text-white
        hover:shadow-lg
        overflow-hidden
        m-5
        relative
        h-[300px]
        w-[275px]
        rounded-md
        border-gray-300 border"
    >
      <div
        /*style={{ backgroundColor: color }}*/ className="h-[90px] p-5 bg-sky-500 bg-cover"
      >
        <Link
          href={"/class/" + classData.id}
          className="hover:underline hover:cursor-pointer"
        >
          <p className="text-xl font-normal truncate max-w-[200px]">
            {classData.name}
          </p>
          <p className="text-sm font-light ">
            {classData.teacher.name + " " + classData.teacher.surname}
          </p>
        </Link>
      </div>

      <Image
        src={
          classData.teacher.image
            ? "/users/" + classData.teacher.image
            : "/pfp.png"
        }
        alt="prof"
        width="75"
        height="75"
        className="rounded-full absolute top-[50px] right-[15px]"
      ></Image>

      <Link
        href={"/class/" + classData.id}
        className="
          hover:cursor-pointer
          rounded-full
          absolute
          bottom-[20px]
          left-[20px]"
      ></Link>
    </div>
  );
}
