import Image from "next/image";
import AuthForm from "./components/AuthForm";
import Link from "next/link";

const Auth = () => {
  return (
    <div
      className="
        flex 
        h-[100vh]
        flex-col 
        justify-center 
        bg-gray-100"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href={"/"}>
          <Image
            height="1000"
            width="1000"
            className="mx-auto w-auto"
            src="/assets/logo.svg"
            alt="Logo"
          />
        </Link>
        <h2
          className="
            mt-6 
            text-center 
            text-3xl 
            font-bold 
            tracking-tight 
            text-gray-900
          "
        >
          Sign in to your account
        </h2>
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;
