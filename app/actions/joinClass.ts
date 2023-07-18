import prisma from "@/lib/prisma";

export default async function joinClass(hash: string, userId: string){
  await prisma.studentsInClasses.create({
    data: {
      class: {
        connect: {
          hash,
        },
      },
      student: {
        connect: {
          id: userId,
        },
      },
    },
  });
}