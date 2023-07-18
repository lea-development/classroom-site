"use client";

import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useState } from "react";


interface RemoveButtonProps {
  studentId: string;
  classId: number;
}

export default function RemoveButton(props: RemoveButtonProps) {
  const [askConfirmation, setAskConfirmation] = useState(false);
  const router = useRouter();

  function removeStudent() {
    fetch("/api/studentsInClasses/delete", {
      method: "POST",
      body: JSON.stringify({
        studentId: props.studentId,
        classId: props.classId,
      }),
    }).then((res) => {
      if (res.status != 200) {
        res.text().then((error) => toast.error(error));
      } else {
        toast.success("Removed student");
        router.refresh();
      }
    });
  }

  return (
    <>
      {!askConfirmation ? (
        <Button danger onClick={() => setAskConfirmation(true)} type="button">
          Remove
        </Button>
      ) : (
        <div className="flex gap-1">
          <Button color="#d5e0db" onClick={() => setAskConfirmation(false)} type="button">
            Cancel
          </Button>
          <Button danger onClick={() => removeStudent()} type="button">
            Confirm
          </Button>
        </div>
      )}
    </>
  );
}
