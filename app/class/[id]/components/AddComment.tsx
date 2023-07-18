"use client";
import {Prisma} from "@prisma/client";
import React from "react";
import Button from "@/app/components/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type Comment = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        surname: true;
        image: true;
      };
    };
  };
}>;

interface AddCommentProps {
  postId: number;
  addComment: (comment: Comment) => void
}

interface AddCommentData {
  content: string;
}

export default function AddComment(props: AddCommentProps) {
  const { register, handleSubmit, setValue } = useForm<AddCommentData>();

  const addComment = (data: AddCommentData) => {
    fetch("/api/comment/add", {
      method: "POST",
      body: JSON.stringify({
        postId: props.postId,
        content: data.content,
      }),
    }).then((res) => {
      if (res.status != 200) {
        res.text().then((error) => toast.error(error));
      } else {
        setValue("content", ""); //empty text field
        res.json().then((data) => {
          props.addComment(data);
        })
      }
    })
  };

  return (
    <form className="flex pt-2 gap-14 items-center" onSubmit={handleSubmit(addComment)}>
      <input
        {...register("content")}
        type="text"
        className="w-[800px] h-10 rounded-3xl border-gray-300 border pl-6 text-sm font-medium"
        placeholder="Add a comment..."
      />
      <Button type="submit">Share</Button>
    </form>
  );
}
