import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RequestData {
  studentId : string;
  classId: number;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if(!user){
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const body: RequestData = await request.json();
    const { studentId, classId } = body;

    if (!studentId || !classId) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const classData = await prisma.class.findUnique({
      select: {
        teacher: {
          select: {
            id: true,
          }
        }
      },
      where: {
        id : classId
      }
    })

    if(!classData){
      return new NextResponse("Class does not exist", { status: 400 });
    }

    const classTeacherId = classData.teacher.id;

    if(classTeacherId !== user.id){
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prisma.studentsInClasses.delete({
      where: {
        idStudent_idClass: {
          idClass: classId,
          idStudent: studentId,
        }
      }
    })

    return new NextResponse("OK", { status: 200});
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
