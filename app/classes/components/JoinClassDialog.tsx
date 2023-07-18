"use client";

import { useForm } from "react-hook-form";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface JoinClassDialogProps {
  toggleDialog: () => void;
}

interface JoinClassData {
  hash: string;
}

export default function JoinClassDialog(props: JoinClassDialogProps) {
  const { register, handleSubmit, setValue } = useForm<JoinClassData>();
  const router = useRouter();

  //TODO handle responses
  function joinClass(data: JoinClassData) {
    fetch("/api/class/join", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status != 200) {
        res.text().then((error) => toast.error(error));
      } else {
        setValue("hash", "");
        props.toggleDialog();
        router.refresh();
      }
    });
  }

  return (
    <form
      className="flex h-full justify-center flex-col items-center"
      onSubmit={handleSubmit(joinClass)}
    >
      <h1>
        <b>Join a new class</b>
      </h1>
      <input
        {...register("hash")}
        id="code"
        type="text"
        placeholder="Class code..."
        className="w-[300px] h-10 rounded-3xl border-gray-300 border pl-6 text-sm font-medium"
      />
      <div className="absolute bottom-3 right-3">
        <Button color="blue" type="submit">
          JOIN
        </Button>
      </div>
    </form>
  );
}
