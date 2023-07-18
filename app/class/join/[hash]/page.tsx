import getCurrentUser from "@/app/actions/getCurrentUser";
import joinClass from "@/app/actions/joinClass";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface JoinClassProps {
  params: {
    hash: string;
  };
}

export default async function JoinClass(props: JoinClassProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/classes");
  }

  if (user.role !== "STUDENT") {
    redirect("/classes");
  }

  try {
    const hash = props.params.hash;

    if (!hash) {
      redirect("/classes");
    }

    if (
      (await prisma.class.count({
        where: {
          hash,
        },
      })) === 0
    ) {
      redirect("/classes");
    }

    joinClass(hash, user.id);
    redirect("/classes");
  } catch (e: any) {
    redirect("/classes");
  }
}
