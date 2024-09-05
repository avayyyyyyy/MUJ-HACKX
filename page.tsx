import Hero from "@/components/Hero";
import Navbar from "@/components/ui/Navbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const Hero1 = async () => {
  const user = await auth();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <>
      <Navbar />
      <Hero />;
    </>
  );
};

export default Hero1;
