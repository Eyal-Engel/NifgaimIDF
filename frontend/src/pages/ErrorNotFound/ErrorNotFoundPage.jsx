import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import "./ErrorNotFoundPage.css";

const ErrorNotFoundPage = () => {
  useEffect(() => {
    // localStorage.removeItem("newEditFormstates");
    // localStorage.removeItem("newEditFormIsValid");
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "35%",
          height: "40%",
          background: "linear-gradient(#fcfcfc, #f1dea1 , #fccd38)",
          borderRadius: "20px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
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
