"use client";

import Button from "@/app/components/Button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface CreateClassDialogProps {
  toggleDialog: () => void;
}

interface CreateClassData {
  name: string;
  color: string;
}

export default function CreateClassDialog(props: CreateClassDialogProps) {
  const { register, handleSubmit, setValue } = useForm<CreateClassData>();
  const router = useRouter();

  function addClass(data: CreateClassData) {
    fetch("/api/class/add", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        color: data.color,
      }),
    }).then((res) => {
      if (res.status != 200) {
        res.text().then((error) => toast.error(error));
      } else {
        setValue("color", "null");
        setValue("name", "");
        props.toggleDialog();
        router.refresh();
      }
    });
  }

  return (
    <form
      className="flex h-full justify-center flex-col items-center"
      onSubmit={handleSubmit(addClass)}
    >
      <h1>
        <b>Create a new class</b>
      </h1>
      <input
        {...register("name")}
        type="text"
        placeholder="Class name..."
        className="mt-3 mb-3 w-[300px] h-10 rounded-3xl border-gray-300 border pl-6 text-sm font-medium"
      />

      {/* <input
          type="color"
          id="color"
          placeholder="Class color..."
          className=""
        /> */}
      <select
        className="w-[300px] h-10 rounded-3xl border-gray-300 pl-5 text-sm font-medium border-[2px]"
        {...register("color")}
      >
        <option value="null" defaultChecked>
          Pick a color...
        </option>
        <option value="red">red</option>
        <option value="yellow">yellow</option>
        <option value="blue">blue</option>
        <option value="green">green</option>
      </select>

      <div className="absolute bottom-3 right-3">
        <Button color="blue" type="submit">
          CREATE
        </Button>
      </div>
    </form>
  );
}
