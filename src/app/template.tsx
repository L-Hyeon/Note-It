"use client";

import * as React from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.body
      initial={{ opacity: 0, filter: "blur(6px)", y: 8 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.18 }}>
      <NavBar />
      {children}
      <Footer />
    </motion.body>
  );
}
