"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./button";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data } = useSession();

  return (
    <div className="flex h-full bg-zinc-900 mx-auto bg-clip-padding backdrop-filter z-[100] backdrop-blur-sm bg-opacity-30 items-center md:px-16 px-6 justify-between py-6 border-b-2 border-zinc-800 sticky top-0">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-xl font-light text-transparent z-[200] bg-gradient-to-br from-white to-gray-300 bg-clip-text"
        >
          crowdSafe.ai
        </Link>
      </div>

      <div className="flex items-center gap-4 my-auto">
        <>
          <Link href="/sos">
            <Button variant={"destructive"}>SOS</Button>
          </Link>
          <Link href="/complaints">
            <Button variant={""}>Complaints</Button>
          </Link>
          {data?.user?.email ? (
            <div className="flex gap-3 md:items-center md:flex-row flex-col text-start">
              <div className="my-auto mt-2 md:mt-0">
                {/* <CreateProject /> */}
              </div>
              <Button
                className="w-full hidden md:block"
                onClick={() => signOut()}
                variant="destructive"
              >
                Sign out
              </Button>
              <Link href="https://github.com/avayyyyyyy/opinify">
                <Button asChild variant="outline">
                  Star on gihtub 🌟
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button onClick={() => signIn("google")} variant="secondary">
                Sign in
              </Button>
              <Button asChild variant="outline">
                <Link href="https://github.com/avayyyyyyy/opinify">
                  Star on gihtub 🌟
                </Link>
              </Button>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Navbar;
