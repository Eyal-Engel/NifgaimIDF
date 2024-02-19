import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import exitIcon from "../../assets/images/icons/exitIcon.png";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { AuthContext } from "../../utils/contexts/authContext";
import { getCommandNameByUserId } from "../../utils/api/usersApi";
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

export const Navigation = ({ hideNavigation }) => {
  const navigate = useNavigate();

  let itemIds = [];

  const auth = useContext(AuthContext);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";
  const [loggedUserCommand, setLoggedUserCommand] = useState("");

  const handleLogout = () => {
    auth.logout();
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (loggedUserId !== "") {
      const fetchCommand = async () => {
        try {
          const command = await getCommandNameByUserId(loggedUserId);
          setLoggedUserCommand(command);
          console.log(command);
        } catch (error) {
          console.error("Error fetching command:", error);
        }
      };

      fetchCommand();
    }
  }, [loggedUserId]);

  if (auth.isLoggedIn && loggedUserCommand === "חיל הלוגיסטיקה") {
    itemIds = [0, 1, 2, 3, 4];
  } else if (auth.isLoggedIn) {
    itemIds = [0];
  }

  return (
    <>
      {itemIds.length > 0 ? (
        <motion.ul
          variants={variants}
          className={`ulSideBar ${hideNavigation ? "hidden" : ""}`}
        >
          {itemIds.map((i) => (
            <MenuItem key={i} i={i} variants={itemVariants} />
          ))}
          <motion.li variants={itemVariants} className="listItemButton">
            <motion.button
              className="exitButton"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLogout()}
            >
              <img src={exitIcon} alt="" />
            </motion.button>
          </motion.li>
        </motion.ul>
      ) : (
        <motion.ul
          variants={variants}
          className={`ulSideBar ${hideNavigation ? "hidden" : ""}`}
        >
          <motion.li variants={itemVariants} className="listItemButton">
            <motion.button
              className="exitButton"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLogout()}
            >
              <img src={exitIcon} alt="" />
            </motion.button>
          </motion.li>
        </motion.ul>
      )}
    </>
  );
};
