import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as crypto from "crypto";

interface RequestData {
  name: string;
  color: string;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "TEACHER") {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const body: RequestData = await request.json();
    const { name, color } = body;

    if (!name || !color) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const existingClasses = await prisma.class.count({
      where: {
        name,
        idTeacher: user.id,
      }
    })

    if(existingClasses> 0){
      return new NextResponse("Class '"+name+"' already exists!", { status: 400 });
    }

    const hash = crypto.createHash("md5");
    hash.update(name + user.id);

    await prisma.class.create({
      data: {
        name,
        color,
        idTeacher: user.id,
        hash: hash.digest("hex"),
      },
    });

    return new NextResponse("OK", { status: 200 });
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
