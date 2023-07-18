import getCurrentUser from "@/app/actions/getCurrentUser";
import Header from "@/app/components/Header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Student from "./components/Student";

export default async function ManageClass({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const id: number = +params.id;
  if (Number.isNaN(id)) {
    redirect("/classes");
  }

  const classData = await prisma.class.findUnique({
    select: {
      idTeacher: true,
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

  const students = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      surname: true,
      image: true,
    },
    where: {
      StudentsInClasses: {
        some: {
          class: {
            id,
          },
        },
      },
    },
  });

  return (
    <>
      <Header></Header>
      <div className="flex items-center w-full justify-center text-center">
        <h1
          className="
        text-green-700
        text-4xl
        mb-8
        mt-6
        py-4
        border-b-2
        border-b-green-700
        w-2/3
      "
        >
          Students
        </h1>
      </div>
      <div
        className="
        flex
        flex-col
        items-center
      "
      >
        {students.map((student) => {
          return <Student key={student.id} student={student} classId={id} />;
        })}
      </div>
    </>
  );
}
