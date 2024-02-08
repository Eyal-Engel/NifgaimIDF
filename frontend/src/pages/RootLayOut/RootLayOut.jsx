import React from "react";
import { Link, Outlet } from "react-router-dom";
import SideBar from "../../components/sideBar/SideBar";
import "./RootLayOut.css";
export default function RootLayout() {
  return (
    <>
      {/* <div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "rgba(98, 144, 212, 1)",
          height: "100%",
        }}
      > */}
      <SideBar />
      <Outlet />
      {/* 
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
      </div> */}
    </>
  );
}
