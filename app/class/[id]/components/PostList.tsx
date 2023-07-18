"use client";

import { Prisma } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import Post from "./Post";
import { toast } from "react-hot-toast";
import AddPost from "./AddPost";
import { useIntersection } from "@mantine/hooks";
import Spinner from "@/app/components/Spinner";
import useSWRInfinite from "swr/infinite";

interface PostListProps {
  classId: number;
  teacher: string;
  teacherImage: string | null;
  role: string;
}

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

interface PostListRes {
  posts: Post[];
  nextCursor: number;
}

export default function PostList(props: PostListProps) {
  // const [posts, setPosts] = useState<Post[]>();
  // const [isLoading, setIsLoading] = useState(false);

  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && previousPageData.posts.length === 0) return null;

    if (pageIndex === 0)
      return "/api/postList?classId=" + props.classId + "&cursorId=" + -1;

    return (
      "/api/postList?classId=" +
      props.classId +
      "&cursorId=" +
      previousPageData.nextCursor
    );
  };

  const { data, isLoading, mutate, size, setSize, isValidating } =
    useSWRInfinite<PostListRes>(getKey, fetcher);


  useEffect(() => {
    if (entry?.isIntersecting) loadMorePosts();
  }, [entry]);

  async function addPost(post: Post) {
    if (data && data[0] && data[0].posts.length > 0) {
      data[0].posts.unshift(post);
      await mutate(data);
    }else {
      const newPostList = [{ posts: [post], nextCursor: post.id }];
      await mutate(newPostList);
    }
  }

  function addComment(postId: number, comment: Comment) {
    if (!data) {
      return;
    }
    for (const page of data) {
      for (const post of page.posts) {
        if (post.id === postId) {
          post.Comment.push(comment);
          mutate(data);
          return;
        }
      }
    }
  }

  function removePost(postId: number){
    if (!data) {
      return;
    }
    for (const page of data) {
      for (const post of page.posts) {
        if (post.id === postId) {
          const index = page.posts.indexOf(post);
          if(index > -1){
            page.posts.splice(index, 1);
            mutate(data);
          }
          return;
        }
      }
    }
  }

  function loadMorePosts() {
    setSize(size + 1);
  }

  return (
    <>
      {props.role === "TEACHER" && (
        <AddPost classId={props.classId} addPost={addPost} />
      )}
      {data && data.length > 0 && data[0].posts && data[0].posts.length > 0
        ? data.map((page, i) => {
            const posts = page.posts;
            if (posts.length > 0) {
              return posts.map((post, j) => {
                if (i === data.length - 1 && j === posts.length - 1) {
                  return (
                    <div key={post.id} ref={ref}>
                      <Post
                        post={post}
                        role={props.role}
                        teacher={props.teacher}
                        teacherImage={props.teacherImage}
                        addComment={(comment) => {
                          addComment(post.id, comment);
                        }}
                        removePost={() => removePost(post.id)}
                      ></Post>
                    </div>
                  );
                } else {
                  return (
                    <Post
                      key={post.id}
                      role={props.role}
                      post={post}
                      teacher={props.teacher}
                      teacherImage={props.teacherImage}
                      addComment={(comment) => {
                        addComment(post.id, comment);
                      }}
                      removePost={() => removePost(post.id)}
                    ></Post>
                  );
                }
              });
            }
          })
        : !isLoading && <span>No posts yet!</span>}

      {(isLoading || isValidating) && (

        <div className="m-5">
          <Spinner />
        </div>
      )}
    </>
  );
}
