import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faImage } from "@fortawesome/free-solid-svg-icons";

interface postImageProps {
  url: string;
  name: string;
}

export default function PostImage(props: postImageProps) {
  const [isClicked, setIsClicked] = useState(false);

  const openImage = () => {
    setIsClicked(!isClicked);
  };

  const closeImage = () => {
    setIsClicked(!isClicked);
  };

  useEffect(() => {
    document.body.style.overflow = isClicked ? "hidden" : "scroll";

    return () => {
      document.body.style.overflow = "scroll";
    };
  }, [isClicked]);

  return (
    <>
      <div className="w-full h-[80px]  flex justify-center items-center">
        <div className="border-gray-300 border rounded-lg w-[95%] h-[90%] flex">
          <Image
            className="h-full w-[30%] rounded-l-lg object-cover border-gray-300 border-r hover:cursor-pointer"
            src={props.url}
            alt={"Image file: " + props.name}
            width={100}
            height={100}
            onClick={openImage}
            draggable="false"
          />
          <div className="w-[70] h-full pl-4 pt-4">
            <h1
              onClick={openImage}
              className="text-gray-600 text-sm font-semibold truncate max-w-[200px]
              hover:text-orange-500 hover:cursor-pointer hover:underline"
            >
              {props.name}
            </h1>
            <h1 className="text-gray-500 text-xs font-light">Immagine</h1>
          </div>
        </div>
      </div>
      {isClicked && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-950 bg-opacity-90 z-30"
        >
          <div className="w-[5vw] absolute top-5 left-5 flex items-center gap-4">
            <FontAwesomeIcon
              className="hover:cursor-pointer"
              icon={faArrowLeft}
              onClick={closeImage}
              size="1x"
              color="white"
            />
            <FontAwesomeIcon
              className=""
              icon={faImage}
              size="1x"
              color="white"
            />
            <h1 className="text-white text-1xl min-w-[250px] truncate">
              {props.name}
            </h1>
          </div>

          <div className="w-full h-full flex justify-center items-center">
            <div className="w-[85vw] h-[85vh] relative">
              <Image
                className="object-contain"
                src={props.url}
                alt={"Image file: " + props.name}
                fill
                draggable="false"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );

}
