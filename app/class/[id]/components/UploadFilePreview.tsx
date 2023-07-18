"use client";

import PostImage from "./PostImage";
import Image from "next/image";

interface UploadFilePreview{url:string, name:string, onRemove: () => void}

export default function UploadFilePreview(props: UploadFilePreview){
  return (
    <div className="relative">
      <Image
        className="absolute right-3 top-[20px] cursor-pointer"
        src="/assets/x.svg"
        alt="Remove image"
        width={45}
        height={45}
        onClick={props.onRemove}
      />
      <PostImage url={props.url} name={props.name}/>
    </div>
  )
}