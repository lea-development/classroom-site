import getCurrentUser from "@/app/actions/getCurrentUser";
import Header from "@/app/components/Header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import CopyLink from "./components/CopyLink";
import Link from "next/link";
import PostList from "./components/PostList";
import Image from "next/image";

interface ClassProps {
  params: {
    id: string;
  };
}

export default async function Class(props: ClassProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const id: number = +props.params.id;
  if (Number.isNaN(id)) {
    redirect("/classes");
  }

  const classData = await prisma.class.findUnique({
    include: {
      teacher: {
        select: {
          name: true,
          image: true,
          email: true,
          surname: true,
        },
      },
    },
    where: {
      id,
    },
  });

  if (!classData) {
    redirect("/classes");
  }

  if (user.role === "STUDENT") {
    const student = await prisma.studentsInClasses.findUnique({
      select: {
        id: true,
      },
      where: {
        idStudent_idClass: {
          idClass: id,
          idStudent: user.id,
        },
      },
    });
    if (!student) {
      redirect("/classes");
    }
  } else {
    if (classData.idTeacher !== user.id) {
      redirect("/classes");
    }
  }

  //TODO add post only on teacher, modify middleware

  return (
    <>
      <Header></Header>
      <div className="flex flex-col items-center justify-center w-full mb-10">
        <div
          className="relative h-60 min-w-[1000px] bg-sky-500 p-7 rounded-lg mt-10 
       "
        >
          {user.role === "TEACHER" && (
            <CopyLink
              link={process.env.URL + "/class/join/" + classData.hash}
            />
          )}
          <p className="text-4xl font-semibold text-white pt-32">
            {classData.name}
          </p>
          <p className="text-2xl font-medium text-white absolute bottom-4 left-7">
            {classData.teacher.name}
          </p>
          {user.role === "TEACHER" && (
            <Link
              href={"/class/" + classData.id + "/manage"}
              className="cursor-pointer float-right"
            >
              <button
                type="button"
                className="bg-white 
                  rounded-lg 
                  w-28 
                  p-2 
                  cursor-pointer 
                  flex 
                  flex-row 
                  justify-center 
                  items-center
                  absolute
                  right-5
                  top-5
                  hover:opacity-90 
                  active:opacity-80
                  select-none"
              >
                Manage
              </button>
            </Link>
          )}
        </div>

        

        <PostList
          role={user!.role}
          classId={classData.id}
          teacher={classData.teacher.name + " " + classData.teacher.surname}
          teacherImage={classData.teacher.image}
        ></PostList>
      </div>
    </>
  );
}
