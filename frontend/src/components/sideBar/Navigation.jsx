import React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import exitIcon from "../../assets/images/icons/exitIcon.png";
import { useNavigate } from "react-router-dom";
import "./style.css";
const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: 50 },
};

const itemIds = [0, 1, 2, 3];

export const Navigation = ({ hideNavigation }) => {
  const navigate = useNavigate();
  return (
    <motion.ul
      variants={variants}
      className={`ulSideBar ${hideNavigation ? "hidden" : ""}`}
    >
      {itemIds.map((i) => (
        <MenuItem key={i} i={i} variants={itemVariants} />
      ))}
      <motion.li variants={itemVariants} className="listItemButton">
        <>
          <motion.button
            className="exitButton"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={exitIcon} alt="" onClick={() => navigate("/login")} />
          </motion.button>
        </>
      </motion.li>
    </motion.ul>
  );
};
