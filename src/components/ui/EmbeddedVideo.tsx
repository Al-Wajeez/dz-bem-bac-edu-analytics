import React from "react";
import { motion } from "framer-motion";

export const EmbeddedVideo: React.FC = () => (
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    className="flex justify-center items-center w-full"
  >
    <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white p-2 md:p-4">
      <div className="relative pb-[56.25%] h-0">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          src="https://www.youtube.com/embed/g-thDdnlem4?si=6T-MDURHJ_JyeqUN"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  </motion.section>
); 