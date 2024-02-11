import React from "react";
import { motion } from "framer-motion";
import graveIcon from "../../assets/images/icons/graveIcon.png";
import pikodimIcon from "../../assets/images/icons/pikodimIcon.png";
import usersIcon from "../../assets/images/icons/usersManageIcon.png";
import soliderIcon from "../../assets/images/icons/soldierIcon.png";
import { useNavigate } from "react-router-dom";

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

  let linksArray;

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
        background: "#ECBA22",
      },
      imgSrc: soliderIcon,
      url: "/halalim",
    },
    {
      name: "ניהול הרשאות",
      styles: {
        background: "linear-gradient( #E7AF04, rgb(144,153,184))",
      },
      imgSrc: usersIcon,
      url: "/manageUsers",
    },
    {
      name: "בתי עלמין",
      styles: {
        background: "linear-gradient( rgb(144,153,184), rgb(71, 111, 248))",
      },
      imgSrc: graveIcon,
      url: "/manageGraveYards",
    },
    {
      name: "פיקודים",
      styles: {
        background: "linear-gradient( rgb(71, 111, 248), rgb(76, 99, 178))",
      },
      imgSrc: pikodimIcon,
      url: "/manageCommands",
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
      <div className="icon-placeholder" onClick={() => navigate(itemListInfo[i].url)}>
        <img src={itemListInfo[i].imgSrc}></img>
      </div>

      <div
        className="text-border-wrap"
        style={itemListInfo[i].styles}
        onClick={() => navigate(itemListInfo[i].url)}
      >
        <div className="text-placeholder" style={style}>
          {itemListInfo[i].name}
        </div>
    </div>
    </motion.li>
  );
};
