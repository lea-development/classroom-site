import { Prisma } from "@prisma/client";
import Image from "next/image";
import Button from "@/app/components/Button";
import RemoveButton from "./RemoveButton";

type StudentType = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    surname: true;
    image: true;
  };
}>;

interface StrudentProps {
  student: StudentType;
  classId: number;
}

export default function Student(props: StrudentProps) {
  return (
    <div
      className="
    my-2
    w-1/2
    h-24
    border-solid
    border-gray-100
    border-[1px]
    p-3
    rounded-lg
    relative
    flex
    flex-row
    justify-center
    items-center
  "
    >
      <Image
        src={props.student.image ? "/users/" + props.student.image : "/pfp.png"}
        alt={
          props.student.name + " " + props.student.surname + "s profile picture"
        }
        width="60"
        height="60"
        className="rounded-2xl absolute left-4"
      />
      <div
        className="
        flex
        flex-col
        justify-center
        items-center
      "
      >
        <h1
          className="
      text-xl
    "
        >
          {props.student.name + " " + props.student.surname}
        </h1>
        <h4 className="opacity-60">{props.student.email}</h4>
      </div>

      <div
        className="
        absolute
        right-4
      "
      >
        <RemoveButton studentId={props.student.id} classId={props.classId} />
      </div>
    </div>
  );
}
