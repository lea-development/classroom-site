import { NextResponse } from "next/server";
import cloudinaryDestroy from "@/app/actions/cloudinaryDestroy";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prisma";

interface RequestData {
  publicIds: string[]
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "TEACHER") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const body: RequestData = await request.json();
    const { publicIds } = body;

    if (!publicIds) {
      return new NextResponse("Missing info", { status: 400 });
    }

    for(const publicId of publicIds) {
      const attachment = await prisma.postAttachment.findUnique({
        select: {
          post: {
            select: {
              class: {
                select: {
                  idTeacher: true,
                }
              }
            }
          }
        },
        where: {
          publicId: publicId
        }
      });
      if(attachment){
        if(attachment.post.class.idTeacher !== user.id){
          return new NextResponse("Unauthorized", { status: 403 });
        }
      }
    }

    cloudinaryDestroy(publicIds);

    return new NextResponse("OK", { status: 200});
  } catch (error: any) {
    console.log(error, "CLOUDINARY_DESTROY_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
