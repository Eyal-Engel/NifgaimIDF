import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./style.css";

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

export const MenuItem = ({ menuItem }) => {
  const navigate = useNavigate();

  const style = {
    background: "#fffbfb",
  };

  return (
    <>
      <motion.li
        variants={variants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(menuItem.url)}
        className="listItemSideBar"
      >
        <div className="icon-placeholder">
          <img src={menuItem.imgSrc} alt="" />
        </div>
        <div className="text-border-wrap" style={menuItem.styles}>
          <div className="text-placeholder" style={style}>
            {menuItem.name}
          </div>
        </div>
      </motion.li>
    </>
  );
};
