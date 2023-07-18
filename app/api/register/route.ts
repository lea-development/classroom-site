import bcrypt from "bcrypt";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RequestData {
  email: string;
  name: string;
  surname: string;
  password: string;
  role: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestData = await request.json();
    const { email, name, password, surname, role } = body;

    if (!email || !password || !name || !surname || !role) {
      return new NextResponse("Missing info", { status: 400 });
    }

    if(role !== "STUDENT" && role !== "TEACHER"){
      return new NextResponse("Wrong role info", { status: 400 });
    }

    const existingUsers = await prisma.user.count({
      where: {
        email: email,
      },
    });

    if (existingUsers > 0) {
      return new NextResponse("Email address already in use", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        surname,
        hashedPassword,
        role: role === "STUDENT" ? "STUDENT" : "TEACHER",
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
