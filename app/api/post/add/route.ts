import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RequestData {
  classId: number;
  content: string;
  attachments?: {url: string, publicId: string, name: string}[];
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "TEACHER") {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  
  try {
    const body: RequestData = await request.json();

    const { classId, content, attachments } = body;


    if (!classId || !content) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const classData = await prisma.class.findUnique({
      select: {
        idTeacher: true,
      },
      where: {
        id: classId
      }
    });

    if(!classData){
      return new NextResponse("Class not found", { status: 400 });
    }

    if(classData.idTeacher !== user.id){
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const post = await prisma.post.create({
      data: {
        createdAt: new Date(),
        content,
        idClass: classId,
        PostAttachment: {
          create: attachments
        }
      },
      include: {
        Comment: {
          include: {
            user: {
              select: {
                name: true,
                surname: true,
                image: true,
              },
            },
          },
        },
        PostAttachment: true,
      },
    });

    return NextResponse.json(post);

  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
