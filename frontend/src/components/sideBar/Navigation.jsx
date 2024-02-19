import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import exitIcon from "../../assets/images/icons/exitIcon.png";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { AuthContext } from "../../utils/contexts/authContext";
import { getCommandNameByUserId } from "../../utils/api/usersApi";
import halalIcon from "../../assets/images/icons/halalIcon.png";
import userIcon from "../../assets/images/icons/userIcon.png";
import graveyardIcon from "../../assets/images/icons/graveyardIcon.png";
import commandIcon from "../../assets/images/icons/commandIcon.png";
import columnIcon from "../../assets/images/icons/columnIcon.png";

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

  // if (auth.isLoggedIn && loggedUserCommand === "צפון") {
  //   itemIds = [0, 1, 2, 3, 4];
  // } else if (auth.isLoggedIn) {
  //   itemIds = [0];
  // }

  let itemListInfo = [];

  if (auth.isLoggedIn && loggedUserCommand === "צפון") {
    itemListInfo = [
      // {
      //   name: "אודות המערכת",
      //   styles: {
      //     background: "#ECBA22",
      //   },
      //   imgSrc: soliderIcon,
      //   url: "/about",
      // },
      {
        name: "נפגעים",
        styles: {
          background: "linear-gradient( rgb(71, 111, 248), rgb(76, 99, 178))",
        },
        imgSrc: halalIcon,
        url: "/halalim",
      },
      {
        name: "ניהול הרשאות",
        styles: {
          background: "linear-gradient( rgb(71, 111, 248), rgb(76, 99, 178))",
        },
        imgSrc: userIcon,
        url: "/manageUsers",
      },
      {
        name: "בתי עלמין",
        styles: {
          background: "linear-gradient( rgb(71, 111, 248), rgb(76, 99, 178))",
        },
        imgSrc: graveyardIcon,
        url: "/manageGraveYards",
      },
      {
        name: "פיקודים",
        styles: {
          background: "linear-gradient( rgb(71, 111, 248), rgb(76, 99, 178))",
        },
        imgSrc: commandIcon,
        url: "/manageCommands",
      },
      {
        name: "מאפייני חלל",
        styles: {
          background: "linear-gradient( rgb(71, 111, 248), rgb(76, 99, 178))",
        },
        imgSrc: columnIcon,
        url: "/manageColumns",
      },
    ];
  } else if (auth.isLoggedIn) {
    itemListInfo = [
      // {
      //   name: "אודות המערכת",
      //   styles: {
      //     background: "#ECBA22",
      //   },
      //   imgSrc: soliderIcon,
      //   url: "/about",
      // },
      {
        name: "נפגעים",
        styles: {
          background: "linear-gradient( rgb(71, 111, 248), rgb(76, 99, 178))",
        },
        imgSrc: halalIcon,
        url: "/halalim",
      },
    ];
  }

  return (
    <>
      {itemListInfo.length > 0 ? (
        <motion.ul
          variants={variants}
          className={`ulSideBar ${hideNavigation ? "hidden" : ""}`}
        >
          {itemListInfo.map((menuItem) => (
            <MenuItem
              key={menuItem.url}
              menuItem={menuItem}
              variants={itemVariants}
            />
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
        // make exit icon most bottom
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
