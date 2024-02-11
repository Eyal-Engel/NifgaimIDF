import React from "react";
import { Link, Outlet } from "react-router-dom";
import SideBar from "../../components/sideBar/SideBar";
import logiCorpLogo from "../../assets/images/pictures/logistic_corp_logo.png";
import mekalarLogo from "../../assets/images/pictures/mekalr_logo.png";
import nifgaimLogo from "../../assets/images/pictures/nifgaim_logo.png";

import "./RootLayOut.css";
export default function RootLayout() {
  return (
    <>
      <div style={{ position: "absolute" }}>
        <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
          <img
            className="mekalarLogo"
            src={mekalarLogo}
            alt=""
            width={"100px"}
          />
        </Link>
        <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
          <img
            className="logiCorpLogo"
            src={logiCorpLogo}
            alt=""
            width={"100px"}
          />
        </Link>
        <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
          <img
            className="nifgaimLogo"
            src={nifgaimLogo}
            alt=""
            width={"100px"}
          />
        </Link>
      </div>
      <SideBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <Outlet />
      </div>

      <div
        className="developerCredits"
        style={{ position: "absolute", bottom: "0", left: "1rem" }}
      >
        <h5
          style={{
            color: "rgba(225,225,225,0.8)",
            marginTop: "0",
            marginBottom: "0.5rem",
          }}
        >
          פותח ע”י בית התוכנה - חיל הלוגיסטיקה
        </h5>
      </div>
    </>
  );
}
