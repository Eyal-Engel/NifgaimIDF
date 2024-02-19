import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
// import graveIcon from "../../assets/images/icons/check.png";
// import pikodimIcon from "../../assets/images/icons/pikodimIcon.png";
// import usersIcon from "../../assets/images/icons/usersManageIcon.png";
// import soliderIcon from "../../assets/images/icons/soldierIcon.png";

import { useNavigate } from "react-router-dom";
import "./style.css";
import { AuthContext } from "../../utils/contexts/authContext";
import { getCommandNameByUserId } from "../../utils/api/usersApi";

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
  const auth = useContext(AuthContext);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";
  const [loggedUserCommand, setLoggedUserCommand] = useState("");
  const navigate = useNavigate();

  const style = {
    background: "#fffbfb",
  };

  useEffect(() => {
    if (loggedUserId !== "") {
      const fetchCommand = async () => {
        try {
          const command = await getCommandNameByUserId(loggedUserId);
          setLoggedUserCommand(command);
        } catch (error) {
          console.error("Error fetching command:", error);
        }
      };

      fetchCommand();
    } else {
      console.log("not logged in");
    }
  }, [loggedUserId]);

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
