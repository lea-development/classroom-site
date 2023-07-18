"use client";

import {Prisma} from "@prisma/client"
import { useState } from "react";
import Button from "@/app/components/Button";
import { useForm } from "react-hook-form";
import { CldUploadButton } from "next-cloudinary";
import { toast } from "react-hot-toast";
import UploadFilePreview from "./UploadFilePreview";

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
    PostAttachment: true,
  };
}>;




interface AddPostData {
  content: string; 
}

interface AddPostProps {
  classId: number;
  addPost: (post: Post) => void
}

export default function AddPost(props: AddPostProps) {
  const [isClicked, setIsClicked] = useState(false);
  const { register, handleSubmit, setValue } = useForm<AddPostData>();
  const [postPhotos, setPostPhotos] = useState<{url : string, publicId: string, name: string}[]>([]);

  const togglePost = () => {
    setIsClicked(!isClicked);
  };

  const sharePost = (data: AddPostData) => {
    fetch("/api/post/add", {
      method: "POST",
      body: JSON.stringify({
        classId: props.classId,
        content: data.content,
        attachments: postPhotos,
      }),
    }).then((res) => {
      setIsClicked(false);
      if (res.status != 200) {
        res.text().then((error) => toast.error(error));
      } else {
        setValue('content', "");
        res.json().then((data) => {
          props.addPost(data);
        })
      }
    })
    setPostPhotos([]);
  };

  function handleUpload(result: any) {
    const extension = result.info.path.split('.').pop();
    setPostPhotos([...postPhotos, {url: result.info.secure_url, publicId: result.info.public_id, name: result.info.original_filename + "."+extension}]);
  }

  function cloudinaryDestroy(publicIds: string[]){
    fetch("/api/cloudinary/destroy", {
      method: "POST",
      body: JSON.stringify({
        publicIds,
      }),
    })
  }

  function deleteImage(publicId : string) {
    const publicIdList = [publicId];
    cloudinaryDestroy(publicIdList);
    setPostPhotos(postPhotos.filter(photo => photo.publicId !== publicId))
  }

  function cancelPost(){
    if(postPhotos.length > 0){
      const publicIds = postPhotos.map((item: { publicId: string }) => item.publicId.toString()); //extract array of secure urls
      cloudinaryDestroy(publicIds);
    }
    setIsClicked(false);
    setPostPhotos([]);
  }

  return (
    <div className=" border-gray-300 border shadow-md p-4 min-w-[1000px] mt-5 min-h-[50px] rounded-lg flex flex-col justify-center">
      {!isClicked ? (
        <p
          onClick={togglePost}
          className="text-sm font-light hover:cursor-pointer select-none hover:text-sky-500 hover:underline"
        >
          Share a new announcement
        </p>
      ) : (
        <div>
          <form onSubmit={handleSubmit(sharePost)}>
            <textarea
              {...register("content")}
              className="w-full h-36 resize-none p-4 border-gray-300 border rounded-lg"
              placeholder="Announcement"
            ></textarea>
            <div className="w-[80%] grid grid-cols-2 gap-2 my-2">
              {postPhotos && postPhotos.map((photo) =>{
                return <UploadFilePreview  url={photo.url} name={photo.name} key={photo.publicId} onRemove={() => deleteImage(photo.publicId)}/>
              })}
            </div>
            <div className="flex justify-start gap-2 w-[140px]">
              <Button type="button" onClick={cancelPost}>
                Cancel
              </Button>
              <Button type="submit">Share</Button>
              <CldUploadButton
                options={{ maxFiles: 5 }}
                onUpload={handleUpload}
                uploadPreset="cukaexr3"
              >
                <Button type="button">Upload file</Button>
              </CldUploadButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
