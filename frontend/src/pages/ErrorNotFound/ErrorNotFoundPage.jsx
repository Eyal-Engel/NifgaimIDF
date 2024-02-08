import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import "./ErrorNotFoundPage.css";

const ErrorNotFoundPage = () => {
  useEffect(() => {
    localStorage.removeItem("newEditFormstates");
    localStorage.removeItem("newEditFormIsValid");
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "40vh",
          width: "35vw",
          background: "#CCCBCB",
          borderRadius: "1rem",
        }}
      >
        <div className="textAbout404">
          <p className="paragraph404">העמוד שביקשת אינו קיים/דורש התחברות</p>
          <p className="secondParagraph404" style={{ marginTop: "0" }}>
            נסה עמוד אחר
          </p>
        </div>
      </Box>
    </div>
  );
};

export default ErrorNotFoundPage;
