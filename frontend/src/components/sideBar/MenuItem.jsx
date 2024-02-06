import React from "react";
import { motion } from "framer-motion";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export const MenuItem = ({ i }) => {
  // const style = { border: `2px solid ${colors[i]}` };
  const style = {
    background: "#fffbfb",
  };

  const borderStyle = [
    {
      background: "#ECBA22",
    },
    {
      background: "linear-gradient( #E7AF04, rgb(144,153,184))",
    },
    {
      background: "linear-gradient( rgb(144,153,184), rgb(71, 111, 248))",
    },
    {
      background: "linear-gradient( rgb(71, 111, 248), rgb(76, 99, 178))",
    },
  ];

  return (
      <motion.li
        variants={variants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div class="icon-border-wrap" style={borderStyle[i]}>
          <div className="icon-placeholder" style={style}></div>
        </div>
        <div class="text-border-wrap" style={borderStyle[i]}>
          <div className="text-placeholder" style={style}></div>
        </div>
      </motion.li>
  );
};
