"use client";

import { useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
}) => {
  const [passwordShown, setPasswordShown] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="block font-extrabold text-sm leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={passwordShown && type === "password" ? "text" : type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })}
          className="h-10 w-full rounded-3xl border-gray-300 border pl-4 text-sm font-medium"
        />
        {type === "password" && (
          <div className="my-3">
            <input
              type="checkbox"
              className="mr-2"
              onClick={() => setPasswordShown(!passwordShown)}
            />
            <span>Show password</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
