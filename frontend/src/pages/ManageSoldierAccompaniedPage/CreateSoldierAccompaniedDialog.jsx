import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  ThemeProvider,
  Input,
  InputLabel,
  Select,
  createTheme,
  MenuItem,
  DialogActions,
  Autocomplete,
  TextField,
  ListSubheader,
} from "@mui/material";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { getHalalByPrivateNumber, getHalals } from "../../utils/api/halalsApi";
import { MuiTelInput } from "mui-tel-input";
import Swal from "sweetalert2";
import { createSoldierAccompanied } from "../../utils/api/soldierAccompaniedsApi";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import Transition from "../../components/TableUtils/Transition";
import PaperComponent from "../../components/TableUtils/PaperComponent";
import alufAvir from "../../assets/images/ranks/אלוף אוויר.png";
import alufYabasha from "../../assets/images/ranks/אלוף יבשה.png";
import alufYam from "../../assets/images/ranks/אלוף ים.png";
import alufMishnehAvir from "../../assets/images/ranks/אלוף משנה אוויר.png";
import alufMishnehYabasha from "../../assets/images/ranks/אלוף משנה יבשה.png";
import alufMishnehYam from "../../assets/images/ranks/אלוף משנה ים.png";
import toraiYabasha from "../../assets/images/ranks/טוראי יבשה.png";
import segamAvir from "../../assets/images/ranks/סגם אוויר.png";
import segamYabasha from "../../assets/images/ranks/סגם יבשה.png";
import segamYam from "../../assets/images/ranks/סגם ים.png";
import seganAvir from "../../assets/images/ranks/סגן אוויר.png";
import seganAlufAvir from "../../assets/images/ranks/סגן אלוף אוויר.png";
import seganAlufYabasha from "../../assets/images/ranks/סגן אלוף יבשה.png";
import seganAlufYam from "../../assets/images/ranks/סגן אלוף ים.png";
import seganYabasha from "../../assets/images/ranks/סגן יבשה.png";
import seganYam from "../../assets/images/ranks/סגן ים.png";
import semelYabasha from "../../assets/images/ranks/סמל יבשה.png";
import semarYabasha from "../../assets/images/ranks/סמר יבשה.png";
import serenAvir from "../../assets/images/ranks/סרן אוויר.png";
import serenYabasha from "../../assets/images/ranks/סרן יבשה.png";
import serenYam from "../../assets/images/ranks/סרן ים.png";
import kavAvir from "../../assets/images/ranks/קאב אוויר.png";
import kavYabasha from "../../assets/images/ranks/קאב יבשה.png";
import kavYam from "../../assets/images/ranks/קאב ים.png";
import kamAvir from "../../assets/images/ranks/קאם אוויר.png";
import kamYabasha from "../../assets/images/ranks/קאם יבשה.png";
import kamYam from "../../assets/images/ranks/קאם ים.png";
import kamaAvir from "../../assets/images/ranks/קמא אוויר.png";
import kamaYabasha from "../../assets/images/ranks/קמא יבשה.png";
import kamaYam from "../../assets/images/ranks/קמא ים.png";
import ravAlufAvir from "../../assets/images/ranks/רב אלוף אוויר.png";
import ravAlufYabasha from "../../assets/images/ranks/רב אלוף יבשה.png";
import ravAlufYam from "../../assets/images/ranks/רב אלוף ים.png";
import ravSerenAvir from "../../assets/images/ranks/רב סרן אוויר.png";
import ravSerenYabasha from "../../assets/images/ranks/רב סרן יבשה.png";
import ravSerenYam from "../../assets/images/ranks/רב סרן ים.png";
import ravatYabasha from "../../assets/images/ranks/רבט יבשה.png";
import rengAvir from "../../assets/images/ranks/רנג אוויר.png";
import rengYabasha from "../../assets/images/ranks/רנג יבשה.png";
import rengYam from "../../assets/images/ranks/רנג ים.png";
import rsevAvir from "../../assets/images/ranks/רסב אוויר.png";
import rsevYabasha from "../../assets/images/ranks/רסב יבשה.png";
import rsevYam from "../../assets/images/ranks/רסב ים.png";
import rselAvir from "../../assets/images/ranks/רסל אוויר.png";
import rselYabasha from "../../assets/images/ranks/רסל יבשה.png";
import rselYam from "../../assets/images/ranks/רסל ים.png";
import rsemAvir from "../../assets/images/ranks/רסם אוויר.png";
import rsemYabasha from "../../assets/images/ranks/רסם יבשה.png";
import rsemYam from "../../assets/images/ranks/רסם ים.png";
import rserAvir from "../../assets/images/ranks/רסר אוויר.png";
import rserYabasha from "../../assets/images/ranks/רסר יבשה.png";
import rserYam from "../../assets/images/ranks/רסר ים.png";
import tateAlufYabasha from "../../assets/images/ranks/תת אלוף יבשה.png";
import tateAlufAvir from "../../assets/images/ranks/תת אלוף אוויר.png";
import tateAlufYam from "../../assets/images/ranks/תת אלוף ים.png";

const translationDict = {
  fullName: "שם מלא",
  privateNumber: "מספר אישי",
  rank: "דרגה",
  unit: "יחידה",
  phone: "מספר טלפון",
  nifgaimHalalId: "שיוך חלל",
};

const errorDict = {
  len: "אורך",
  isNumeric: "חובה מספר",
};
export default function CreateSoldierAccompaniedDialog({
  openDialog,
  setOpenDialog,
  rows,
  setRows,
  halals,
}) {
  const [inputValues, setInputValues] = useState({});
  const [phone, setPhone] = useState("+972");
  const [rank, setRank] = useState("");
  const [selectedHalal, setSelectedHalal] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";
  const ranksOptions = [
    // category: חובה
    `טירון`,
    `טוראי`,
    `רב"ט`,
    `סמל`,
    `סמ"ר`,
    // category: אקמדאיים
    `קמ"א`,
    `קא"ב`,
    `קא"ם`,
    // category: נגדים
    `רס"ל`,
    `רס"ר`,
    `רס"מ`,
    `רס"ב`,
    `רנ"ג`,
    // category: קצינים
    `סג"ם`,
    `סגן`,
    `סרן`,
    `רס"ן`,
    `סא"ל`,
    `אל"ם`,
    `תא"ל`,
    `אלוף`,
    `רא"ל`,
  ];

  const imageImports = [
    [],
    [toraiYabasha],
    [ravatYabasha],
    [semelYabasha],
    [semarYabasha],
    [kamaYabasha, kamaAvir, kamaYam],
    [kavYabasha, kavAvir, kavYam],
    [kamYabasha, kamAvir, kamYam],
    [rselYabasha, rselAvir, rselYam],
    [rserYabasha, rserAvir, rserYam],
    [rsemYabasha, rsemAvir, rsemYam],
    [rsevYabasha, rsevAvir, rsevYam],
    [rengYabasha, rengAvir, rengYam],
    [segamYabasha, segamAvir, segamYam],
    [seganYabasha, seganAvir, seganYam],
    [serenYabasha, serenAvir, serenYam],
    [ravSerenYabasha, ravSerenAvir, ravSerenYam],
    [seganAlufYabasha, seganAlufAvir, seganAlufYam],
    [alufMishnehYabasha, alufMishnehAvir, alufMishnehYam],
    [tateAlufYabasha, tateAlufAvir, tateAlufYam],
    [alufYabasha, alufAvir, alufYam],
    [ravAlufYabasha, ravAlufAvir, ravAlufYam],
  ];

  const renderImageOptions = (start, end) => {
    let images = [];
    for (let i = start; i < end; i++) {
      let imageArray = imageImports[i];
      if (i === 0 || i === 1 || i === 2 || i === 3) {
        // For ranks with only one image
        imageArray = [imageArray[0]]; // Take only the first image
      }

      images.push(
        <MenuItem
          key={`${i}`}
          value={ranksOptions[i]}
          style={{
            display: "flex",
            justifyContent: "space-between",
            direction: "rtl",
          }}
        >
          <p style={{ fontSize: "large" }}>{ranksOptions[i]}</p>
          <div>
            {imageArray.map(
              (image, index) =>
                image !== undefined && (
                  <img
                    key={`${i}-${index}`}
                    src={image}
                    alt={""}
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      marginRight: "5px",
                    }}
                  />
                )
            )}
          </div>
        </MenuItem>
      );
    }
    return images;
  };

  const theme = createTheme({
    direction: "rtl",
    palette: {
      primary: {
        main: "#ffa726",
      },
      secondary: {
        main: "#3069BE",
      },
    },
  });

  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = useCallback((column, value) => {
    if (column === "phone") {
      setPhone(value);
    } else if (column === "rank") {
      setRank(value);
    }
    setInputValues((prevValues) => ({
      ...prevValues,
      [column]: value,
    }));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newLeftOVer = await createSoldierAccompanied(
        loggedUserId,
        inputValues
      );

      const formmatedLeftOver = {
        ...newLeftOVer,
        halalId: selectedHalal.privateNumber,
        halalFullName: selectedHalal.lastName + " " + selectedHalal.firstName,
      };
      setRows([...rows, formmatedLeftOver]);
      Swal.fire({
        title: `מלווה "${inputValues.fullName}" נוסף בהצלחה!`,
        text: "",
        icon: "success",
        confirmButtonText: "אישור",
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then((result) => {
        setOpenDialog(false);
      });
    } catch (error) {
      const errors = error.response.data.body?.errors;
      let errorsForSwal = ""; // Start unordered list

      if (errors) {
        errors.forEach((error) => {
          if (error.type === "notNull Violation") {
            errorsForSwal += `<li>נדרש למלא את עמודה ${
              translationDict[error.path]
            }</li>`;
          }
          if (error.type === "Validation error") {
            errorsForSwal += `<li>הערך בעמודה "${
              translationDict[error.path]
            }" לא תקין (${errorDict[error.validatorKey]})</li>`;
          }
        });
      } else {
        errorsForSwal += `<li>${error}</li>`;
      }
      Swal.fire({
        title: `לא ניתן להוסיף את המלווה`,
        html: `<ul style="direction: rtl; text-align: right">${errorsForSwal}</ul>`,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "אישור",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then((result) => {});
    }
  };

  useEffect(() => {
    const fetchHalalsData = async () => {
      //   setLoading(true);

      try {
        if (inputValues.halalId) {
          const halal = await getHalalByPrivateNumber(inputValues.halalId);
          setSelectedHalal(halal);
        }

        // setLoading(false);
      } catch (error) {
        console.error("Error fetching halals:", error);
      }
    };

    fetchHalalsData();
  }, [inputValues.halalId]);

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        sx={{
          direction: "rtl",
          "& .MuiDialog-paper": {
            width: "100%",
          },
        }}
      >
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <DialogTitle>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p
                  style={{
                    fontSize: "large",
                    color: theme.palette.secondary.main,
                  }}
                >
                  הוסף מלווה חדש
                </p>
              </div>
            </DialogTitle>
          </ThemeProvider>
        </CacheProvider>
        <Divider />
        <DialogContent>
          <div
            key="מספר אישי"
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <InputLabel id="fullName">שם מלא</InputLabel>
            <Input
              label="fullName"
              onChange={(e) => handleInputChange("fullName", e.target.value)}
            />
            <RtlPlugin>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                style={{ marginTop: "20px" }}
                options={halals} // Assuming halals is the array you mapped before
                getOptionLabel={(option) =>
                  `${option.privateNumber}: ${option.firstName} ${option.lastName}`
                }
                value={selectedHalal}
                onChange={(event, newValue) => {
                  setSelectedHalal(newValue); // Update the selectedHalal state
                  handleInputChange(
                    "nifgaimHalalId",
                    newValue ? newValue.id : ""
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} label="שייך חלל" />
                )}
              />
            </RtlPlugin>
            <InputLabel id={"privateNumber"} style={{ marginTop: "20px" }}>
              מספר אישי
            </InputLabel>
            <Input
              onChange={(e) =>
                handleInputChange("privateNumber", e.target.value)
              }
            />
            <InputLabel id={"rank"} style={{ marginTop: "20px" }}>
              דרגה
            </InputLabel>
            <RtlPlugin>
              <Select
                value={rank}
                onChange={(e) => handleInputChange("rank", e.target.value)}
                style={{ direction: "rtl", width: "100%", marginTop: "8px" }}
              >
                <ListSubheader
                  style={{
                    textAlign: "right",
                    fontSize: "large",
                    fontWeight: "bold",
                  }}
                >
                  חובה
                </ListSubheader>
                {renderImageOptions(0, 5)}
                <ListSubheader
                  style={{
                    textAlign: "right",
                    fontSize: "large",
                    fontWeight: "bold",
                  }}
                >
                  אקדמאיים
                </ListSubheader>
                {renderImageOptions(5, 8)}
                <ListSubheader
                  style={{
                    textAlign: "right",
                    fontSize: "large",
                    fontWeight: "bold",
                  }}
                >
                  נגדים
                </ListSubheader>
                {renderImageOptions(8, 13)}
                <ListSubheader
                  style={{
                    textAlign: "right",
                    fontSize: "large",
                    fontWeight: "bold",
                  }}
                >
                  קצינים
                </ListSubheader>
                {renderImageOptions(13, imageImports.length)}
              </Select>
              {/* <Select
                value={rank}
                onChange={(e) => handleInputChange("rank", e.target.value)}
                style={{ direction: "rtl", width: "100%", marginTop: "8px" }}
              >
                <ListSubheader sx={{ textAlign: "right" }}>חובה</ListSubheader>
                {ranksOptions.slice(0, 5).map((option) => (
                  <MenuItem key={option} value={option}>
                    <div style={{ textAlign: "right" }}>{option}</div>
                  </MenuItem>
                ))}
                <ListSubheader>אקדמאיים</ListSubheader>
                {ranksOptions.slice(5, 8).map((option) => (
                  <MenuItem key={option} value={option}>
                    <div style={{ textAlign: "right" }}>{option}</div>
                  </MenuItem>
                ))}
                <ListSubheader>נגדים</ListSubheader>
                {ranksOptions.slice(8, 13).map((option) => (
                  <MenuItem key={option} value={option}>
                    <div style={{ textAlign: "right" }}>{option}</div>
                  </MenuItem>
                ))}
                <ListSubheader>קצינים</ListSubheader>
                {ranksOptions.slice(13).map((option) => (
                  <MenuItem key={option} value={option}>
                    <div style={{ textAlign: "right" }}>{option}</div>
                  </MenuItem>
                ))}
              </Select> */}
            </RtlPlugin>
            {/* <Input
              onChange={(e) => handleInputChange("rank", e.target.value)}
            /> */}
            <InputLabel id={"phone"} style={{ marginTop: "20px" }}>
              מספר טלפון
            </InputLabel>
            <MuiTelInput
              defaultCountry={"il"}
              value={phone}
              excludecountries={["pa"]} // Use lowercase prop name
              onChange={(value) => handleInputChange("phone", value)}
            />

            <InputLabel id={"unit"} style={{ marginTop: "20px" }}>
              יחידה
            </InputLabel>
            <Input
              onChange={(e) => handleInputChange("unit", e.target.value)}
            />
            <InputLabel id={"comments"} style={{ marginTop: "20px" }}>
              הערות
            </InputLabel>
            <Input
              onChange={(e) => handleInputChange("comments", e.target.value)}
            />
          </div>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleCloseDialog}>ביטול</Button>
          <Button variant="contained" onClick={handleSubmit}>
            צור מלווה
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
