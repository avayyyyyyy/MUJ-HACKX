"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="md:py-28 py-10 relative">
      <Image
        src={""}
        alt="bg"
        className="absolute top-0 -z-10 opacity-30 left-0 w-full h-full object-contain"
      />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center mx-auto max-w-5xl"
      >
        <p className="relative">
          <span className="relative z-10 mb-4 inline-block rounded-full border border-gray-300 px-3 py-1.5 text-xs text-gray-500 md:mb-0">
            crowdSafe.ai is now live 🎉
            <span className="absolute bottom-0 left-3 right-3 h-[1px] bg-gradient-to-r from-gray-500/0 via-gray-400 to-gray-500/0"></span>
            <span className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-gray-500/0 via-gray-400 to-gray-500/0"></span>
          </span>
        </p>
        <h1 className="sm:text-5xl text-3xl font-semibold text-gray-100 mt-3">
          Crowdsourced Disaster Reporting Tool
          <span className="block text-gray-300 mt-2">10x faster with beUi</span>
        </h1>
        <p className="text-gray-100 text-sm mt-4">
          Empowering Communities to Report and Respond to Disasters
          <span className="md:block">
            Harnessing Crowdsourced Data for Timely and Effective Responses
          </span>
        </p>
        <div className="flex flex-wrap justify-center gap-5 mt-8">
          <button className="bg-gray-800 text-white px-6 py-2 rounded-xl hover:ring-1 ring-gray-800 hover:ring-offset-1 duration-300">
            Get Started
          </button>
          <button className="border border-gray-200 text-gray-100 px-6 py-2 rounded-xl hover:bg-gray-800 duration-300 hover:ring-1 ring-gray-300 hover:ring-offset-1">
            Learn More
          </button>
        </div>
        <div className="relative flex max-w-6xl justify-center overflow-hidden">
          <Image
            src=""
            width={700}
            height={700}
            alt="hero-section"
            className="h-full w-full rounded-lg object-cover md:w-[1300px]"
            style={{
              maskImage: `linear-gradient(to top, transparent, black 20%)`,
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
