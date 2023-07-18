import cloudinaryDestroy from "@/app/actions/cloudinaryDestroy";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
  const postIdParams = searchParams.get("postId");

  if (!postIdParams) {
    return new NextResponse("Missing info", { status: 400 });
  }

  const postId: number = +postIdParams;
  if (Number.isNaN(postId)) {
    return new NextResponse("Bad request", { status: 400 });
  }

    const post = await prisma.post.findUnique({
      include: {
        class: {
          select: {
            idTeacher: true,
          },
        },
        PostAttachment: {
          select: {
            publicId: true,
          },
        },
      },
      where: {
        id: postId,
      },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 400 });
    }

    const user = await getCurrentUser();

    if (!user || user.id !== post.class.idTeacher) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const publicIds = post.PostAttachment.map(
      (attachment) => attachment.publicId
    );
    cloudinaryDestroy(publicIds);

    await prisma.post.delete({
      where: {
        id: post.id,
      },
    });

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.log(error, "POST_DELETE_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
