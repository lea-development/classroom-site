"use client";

import Button from "@/app/components/Button";
import Spinner from "@/app/components/Spinner";
import { useState } from "react";

interface RemovePostButtonProps {
  remove: () => void;
}

export default function RemovePostButton(props: RemovePostButtonProps) {
  const [askConfirmation, setAskConfirmation] = useState(false);
  const [removed, setRemoved] = useState(false);

  return (
    <>
      {!askConfirmation ? (
        <Button danger onClick={() => setAskConfirmation(true)} type="button">
          Remove
        </Button>
      ) : !removed ? (
        <div className="flex gap-1">
          <Button
            color="#d5e0db"
            onClick={() => setAskConfirmation(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            danger
            onClick={() => {
              setRemoved(true);
              props.remove();
            }}
            type="button"
          >
            Confirm
          </Button>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}
