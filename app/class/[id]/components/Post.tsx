"use client";

import { Prisma } from "@prisma/client";
import Image from "next/image";
import AddComment from "./AddComment";
import Comment from "./Comment";
import RemovePostButton from "./RemovePostButton";
import PostImage from "./PostImage";
import toast from "react-hot-toast";

type Post = Prisma.PostGetPayload<{
  include: {
    Comment: {
      include: {
        user: {
          select: {
            name: true;
            surname: true;
            image: true;
          };
        };
      };
    };
    PostAttachment: true;
  };
}>;

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

interface PostProps {
  post: Post;
  teacher: string;
  teacherImage: string | null;
  addComment: (comment: Comment) => void;
  removePost: () => void;
  role: string;
}

export default function Post(props: PostProps) {
  const comments = props.post.Comment;

  function deletePost(){
    fetch("/api/post/delete?postId="+props.post.id, {
      method: "DELETE"
    }).then((res) => {
      if (res.status != 200) {
        res.text().then((error) => toast.error(error));
      } else {
        props.removePost();
        toast.success("Post removed successfully.");
      }
    })

  }

  return (
    <div className="min-w-[1000px] max-w-[1000px] mt-5 border-gray-300 border min-h-[100px] rounded-lg">
      <div className="w-full h-16 pl-5 pt-3 flex relative">
        {props.role === "TEACHER" && <div className="absolute right-5 top-5"><RemovePostButton remove={deletePost}/></div>}
        <div className="h-full min-w-[60px] flex justify-center items-center">
          <Image
            src={
              props.teacherImage ? "/users/" + props.teacherImage : "/pfp.png"
            }
            alt=""
            width="47"
            height="47"
            className="rounded-full"
          />
        </div>
        <div className="w-300 h-full pl-4 pt-1">
          <h1 className="text-gray-700 text-base font-semibold">
            {props.teacher}
          </h1>
          <h1 className="text-gray-500 text-xs font-light">
            {new Date(props.post.createdAt).toLocaleDateString()}
          </h1>
        </div>
      </div>
      <div className=" w-full min-h-[50px] border-gray-300 border-b pl-7 pr-7 pb-4">
        <h1 className="text-stone-950 text-sm font-normal break-words pb-2 pt-2">
          {props.post.content}
        </h1>
        <div className="w-[80%] grid grid-cols-2 gap-2">
          {props.post.PostAttachment &&
            props.post.PostAttachment.map((attachment) => {
              return (
                <PostImage
                  url={attachment.url}
                  name={attachment.name}
                  key={attachment.id}
                />
              );
            })}
        </div>
      </div>
      <div className="w-full p-4 min-h-[60px]">
        {comments &&
          comments.map((comment) => {
            return <Comment key={comment.id} {...comment}></Comment>;
          })}

        <AddComment postId={props.post.id} addComment={props.addComment}/>

      </div>
    </div>
  );
}
