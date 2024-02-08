import React from "react";
import { motion } from "framer-motion";
import graveIcon from "../../assets/images/icons/graveIcon.png";
import pikodimIcon from "../../assets/images/icons/pikodimIcon.png";
import usersIcon from "../../assets/images/icons/usersManageIcon.png";
import soliderIcon from "../../assets/images/icons/soldierIcon.png";

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

  const itemListInfo = [
    {
      name: "נפגעים",
      styles: {
        background: "#ECBA22",
      },
      imgSrc: soliderIcon,
    },
    {
      name: "ניהול הרשאות",
      styles: {
        background: "linear-gradient( #E7AF04, rgb(144,153,184))",
      },
      imgSrc: usersIcon,
    },
    {
      name: "בתי עלמין",
      styles: {
        background: "linear-gradient( rgb(144,153,184), rgb(71, 111, 248))",
      },
      imgSrc: graveIcon,
    },
    {
      name: "פיקודים",
      styles: {
        background: "linear-gradient( rgb(71, 111, 248), rgb(76, 99, 178))",
      },
      imgSrc: pikodimIcon,
    },
  ];

  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* <div class="icon-border-wrap" style={itemListInfo[i].styles}>
        <div className="icon-placeholder" style={style}><img src={itemListInfo[i].imgSrc} alt="" style={{borderRadius: "50%" }}></img></div>
      </div> */}
      <div className="icon-placeholder">
        <img src={itemListInfo[i].imgSrc}></img>
      </div>

      <div className="text-border-wrap" style={itemListInfo[i].styles}>
        <div className="text-placeholder" style={style}>
          {itemListInfo[i].name}
        </div>
      </div>
    </motion.li>
  );
};
