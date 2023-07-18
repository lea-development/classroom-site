"use client";

import Button from "@/app/components/Button";
import { useState, useRef, useEffect } from "react";
import JoinClassDialog from "./JoinClassDialog";
import CreateClassDialog from "./CreateClassDialog";

interface ActionButtonProps {
  role: string;
}

export default function ActionButton(props: ActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dialog = useRef<HTMLDialogElement>(null);

  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    isOpen ? dialog.current?.showModal() : dialog.current?.close();
  }, [isOpen])

  return (
    <>
      <div className="mr-5 mt-5 hover:cursor-pointer">
        <Button color="blue" onClick={toggleDialog}>
          {props.role === "STUDENT" ? "JOIN CLASS" : "CREATE CLASS"}
        </Button>
      </div>

      <dialog
        ref={dialog}
        className="w-[400px] h-[250px] rounded-lg backdrop:backdrop-blur-sm"
      >
        {props.role === "STUDENT" ? (
          <JoinClassDialog toggleDialog={() => toggleDialog()} />
        ) : (
          <CreateClassDialog toggleDialog={() => toggleDialog()} />
        )}

        <button onClick={toggleDialog} className="absolute top-3 right-3">
          <b className="select-none">X</b>
        </button>
      </dialog>
    </>
  );
}
