import { Prisma } from "@prisma/client";
import Image from "next/image";

type Comment = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: {
        name : true,
        surname: true,
        image: true,
      },
    },
  }
}>

export default function Comment(comment: Comment){
  return (
    <div className="w-full min-h-[50px] pb-3 flex">
      <div className="h-full min-w-[60px] flex justify-center items-center">
        <Image
          src={
            comment.user.image
              ? "/users/" + comment.user.image
              : "/pfp.png"
          }
          alt=""
          width="40"
          height="40"
          className="rounded-full"
        ></Image>
      </div>
      <div className="min-h-[40px] pl-3">
        <h1>{new Date(comment.createdAt).toLocaleDateString()}</h1>
        <h1 className="text-gray-700 text-sm font-semibold">{comment.user.name + " " + comment.user.surname}</h1>
        <h1 className="max-w-[700px] break-words text-sm font-light">{comment.content}</h1>
      </div>
      
    </div>
  )
}