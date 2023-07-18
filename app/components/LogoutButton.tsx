"use client";

import { signOut } from "next-auth/react";
import Button from "./Button";

export default function LogoutButton(){
  return <><Button onClick={() => signOut()}>Logout</Button> </>
}