import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RequestData {
  postId: number;
  content: string;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const body: RequestData = await request.json();
    const { postId, content } = body;

    if (!postId || !content) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const post = await prisma.post.findUnique({
      select: {
        class: {
          select: {
            id: true,
            idTeacher: true,
          }
        }
      },
      where: {
        id: postId
      }
    })
  
    if (!post) {
      return new NextResponse("Post not found", { status: 400 });
    }
  
    if (user.role === "STUDENT") {
      const student = await prisma.studentsInClasses.findUnique({
        select: {
          id: true,
        },
        where: {
          idStudent_idClass: {
            idClass: post.class.id,
            idStudent: user.id,
          },
        },
      });
      if (!student) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
    } else {
      if (post.class.idTeacher !== user.id) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        idPost: postId,
        createdAt: new Date(),
        idUser: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            surname: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error: any) {
    console.log(error, "COMMENT_ADD_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
