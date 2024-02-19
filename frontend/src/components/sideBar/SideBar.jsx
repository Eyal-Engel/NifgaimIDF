import React, { useEffect, useRef, useState } from "react";
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./use-dimensions";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import "./style.css";

const sidebar = {
  open: (width = 1000) => ({
    clipPath: `circle(${width * 2 + 200}px at calc(100% - 40px) 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at calc(100% - 40px) 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const SideBar = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const [hideNavigation, setHideNavigation] = useState(false);

  const handleToggle = () => {
    toggleOpen();
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setHideNavigation(true);
      }, 1000);
    } else {
      setTimeout(() => {
        setHideNavigation(false);
      }, 30);
    }
  }, [isOpen]);

  return (
    <>
      <motion.div
        style={{ direction: "rtl" }}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
      >
        <motion.div
          className={`sideBarBackground ${hideNavigation ? "hidden" : ""}`}
          variants={sidebar}
        />
        <Navigation hideNavigation={hideNavigation} />
        <MenuToggle toggle={handleToggle} />
      </motion.div>
    </>
  );
};

export default SideBar;
