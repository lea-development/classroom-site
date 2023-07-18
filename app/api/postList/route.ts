import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const postsPerPage = 6;
export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const classIdParam = searchParams.get("classId");
  const cursorIdParam = searchParams.get("cursorId");

  if (!classIdParam || !cursorIdParam) {
    return new NextResponse("Missing info", { status: 400 });
  }

  const classId: number = +classIdParam;
  const cursorId: number = +cursorIdParam;
  if (Number.isNaN(classIdParam) || Number.isNaN(cursorId)) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const user = await getCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const classData = await prisma.class.findUnique({
      select: {
        idTeacher: true,
      },
      where: {
        id: classId,
      },
    });

    if (!classData) {
      return new NextResponse("Class does not exist", { status: 400 });
    }

    if (user.role === "STUDENT") {
      const student = await prisma.studentsInClasses.findUnique({
        select: {
          id: true,
        },
        where: {
          idStudent_idClass: {
            idClass: classId,
            idStudent: user.id,
          },
        },
      });
      if (!student) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
    } else {
      if (classData.idTeacher !== user.id) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
    }

    let posts = [];

    if (cursorId === -1) {
      posts = await prisma.post.findMany({
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
        take: postsPerPage,
        where: {
          idClass: classId,
        },
        orderBy: {
          id: "desc",
        },
      });
    } else {
      posts = await prisma.post.findMany({
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
        take: postsPerPage,
        cursor: {
          id: cursorId,
        },
        skip: 1,
        where: {
          idClass: classId,
        },
        orderBy: {
          id: "desc",
        },
      });
    }

    const nextCursor = posts.length > 0 ? posts[posts.length-1].id : null;

    const resp = {
      posts,
      nextCursor
    }

    const res = NextResponse.json(resp);
    
    return res;
  } catch (error: any) {
    console.log(error, "POST_LIST_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
