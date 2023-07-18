import prisma from "@/lib/prisma";
import Header from "../components/Header";
import Class from "./components/Class";
import getCurrentUser from "../actions/getCurrentUser";
import { redirect } from "next/navigation";
import ActionButton from "./components/ActionButton";

export default async function Home() {
  const user = await getCurrentUser();

  if(!user){
    redirect("/");
  }

  const classes = user.role === "STUDENT" ?  await getStudentClasses(user.id) : await getTeacherClasses(user.id);

  return (
    <>
      <Header></Header>

      <div className="flex w-full justify-between items-center">
        <p className="text-xl ml-10 mt-5">
          Hello <b>{user?.name}</b>
        </p>
        <ActionButton role={user!.role.toString()} />
      </div>

      <div className="flex flex-wrap">
        {classes.map((class_) => {
          //can't use 'class' as a name
          return <Class key={class_.id} {...class_}></Class>;
        })}
      </div>
    </>
  );
}

async function getStudentClasses(userId: string){
  return await prisma.class.findMany({
    include: {
      teacher: {
        select: {
          name: true,
          image: true,
          surname: true,
        },
      },
    },
    where: {
      StudentsInClasses: {
        some: {
          idStudent: userId
        }
      }
    }
  })
}

async function getTeacherClasses(userId: string){
  return await prisma.class.findMany({
    include: {
      teacher: {
        select: {
          name: true,
          image: true,
          surname: true,
        },
      }
    },
    where: {
      idTeacher: userId
    }
  });
}