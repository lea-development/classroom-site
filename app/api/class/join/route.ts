import getCurrentUser from "@/app/actions/getCurrentUser";
import joinClass from "@/app/actions/joinClass";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RequestData {
  hash: string;
}


export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "STUDENT") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const body: RequestData = await request.json();
    const { hash, } = body;

    if (!hash) {
      return new NextResponse("Missing info", { status: 400 });
    }

    if(await prisma.class.count({
      where: {
        hash,
      }
    }) === 0){
      return new NextResponse("Class not found", { status: 400 });
    }

    joinClass(hash, user.id);

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
