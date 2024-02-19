import React from "react";
import { motion } from "framer-motion";
// import graveIcon from "../../assets/images/icons/check.png";
// import pikodimIcon from "../../assets/images/icons/pikodimIcon.png";
// import usersIcon from "../../assets/images/icons/usersManageIcon.png";
// import soliderIcon from "../../assets/images/icons/soldierIcon.png";
import halalIcon from "../../assets/images/icons/halalIcon.png";
import userIcon from "../../assets/images/icons/userIcon.png";
import graveyardIcon from "../../assets/images/icons/graveyardIcon.png";
import commandIcon from "../../assets/images/icons/commandIcon.png";
import columnIcon from "../../assets/images/icons/columnIcon.png";

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

export const MenuItem = ({ i }) => {
  // const auth = useContext(AuthContext);
  // const userData = JSON.parse(localStorage.getItem("userData"));
  // const loggedUserId = userData ? userData.userId : "";
  // const [loggedUserFullName, setLoggedUserFullName] = useState("");
  // const [loggedUserCommand, setLoggedUserCommand] = useState("");
  const navigate = useNavigate();

  const style = {
    background: "#fffbfb",
  };

  // let linksArray;

  // if (auth.isLoggedIn && loggedUserCommand === "חיל הלוגיסטיקה") {
  //   linksArray = [
  //     { name: "אודות המערכת", url: "/about" },
  //     { name: "ניהול אירועים", url: "/manageEvents" },
  //     { name: "יצירת אירוע", url: "/createEvent" },
  //     { name: "ניהול משתמשים", url: "/manageUsers" },
  //   ];
  // } else if (auth.isLoggedIn) {
  //   linksArray = [
  //     { name: "אודות המערכת", url: "/about" },
  //     { name: "ניהול אירועים", url: "/manageEvents" },
  //   ];
  // } else {
  //   linksArray = [{ name: "אודות המערכת", url: "/about" }];
  // }

  const itemListInfo = [
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

  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(itemListInfo[i].url)}
      className="listItemSideBar"
    >
      {/* <div class="icon-border-wrap" style={itemListInfo[i].styles}>
        <div className="icon-placeholder" style={style}><img src={itemListInfo[i].imgSrc} alt="" style={{borderRadius: "50%" }}></img></div>
      </div> */}
      <div className="icon-placeholder">
        <img src={itemListInfo[i].imgSrc} alt=""></img>
      </div>

      <div className="text-border-wrap" style={itemListInfo[i].styles}>
        <div className="text-placeholder" style={style}>
          {itemListInfo[i].name}
        </div>
      </div>
    </motion.li>
  );
};
