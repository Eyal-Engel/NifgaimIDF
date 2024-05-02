import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Input,
  InputLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  DialogActions,
  createTheme,
  ThemeProvider,
  FormControl,
  ListSubheader,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import RtlPlugin from "../../components/rtlPlugin/RtlPlugin";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  deleteHalal,
  getLeftOversByHalalId,
  getSoldierAccompaniedsByHalalId,
  updateHalal,
} from "../../utils/api/halalsApi";
import Swal from "sweetalert2";
import {
  getCommandIdByName,
  getCommandNameById,
} from "../../utils/api/commandsApi";
import {
  getGraveyardById,
  getGraveyardIdByName,
} from "../../utils/api/graveyardsApi";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { useCallback } from "react";
import Transition from "../../components/TableUtils/Transition";
import PaperComponent from "../../components/TableUtils/PaperComponent";
import { useForm } from "react-hook-form";
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

const errorDict = {
  len: "אורך",
  isNumeric: "חובה מספר",
  not_unique: "חובה ערך יחודי",
};

const translationDict = {
  id: "מספר זיהוי",
  privateNumber: "מספר פרטי",
  rank: "דרגה",
  lastName: "שם משפחה",
  firstName: "שם פרטי",
  dateOfDeath: "תאריך פטירה",
  serviceType: "סוג שירות",
  circumstances: "נסיבות המוות",
  unit: "יחידה",
  division: "אוגדה",
  specialCommunity: "קהילה מיוחדת",
  area: "אזור",
  plot: "חלקה",
  line: "שורה",
  graveNumber: "מספר קבר",
  permanentRelationship: "קשר קבוע",
  comments: "הערות",
  graveyardName: "בית קברות",
  commandName: "פיקוד",
};
export default function EditHalalDIalog({
  openDialog,
  setOpenDialog,
  selectedRow,
  allDataOfHalalsColumns,
  // originalColumns,
  setRows,
  commands,
  graveyards,
  enums,
}) {
  const [soldierAccompanieds, setSoldierAccompanieds] = useState([]);
  const [leftOvers, setLeftOvers] = useState([]);
  const [inputValues, setInputValues] = useState({});
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    const fetchHalalsData = async () => {
      try {
        setInputValues(selectedRow);

        const halalId = selectedRow.id;
        const soldierAccompaniedsData = await getSoldierAccompaniedsByHalalId(
          halalId
        );
        const LeftOversData = await getLeftOversByHalalId(halalId);

        setSoldierAccompanieds(soldierAccompaniedsData);
        setLeftOvers(LeftOversData);
      } catch (error) {
        console.error("Error fetching halals:", error);
      }
    };

    fetchHalalsData();
  }, [selectedRow]);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const loggedUserId = userData ? userData.userId : "";

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

  // const rearrangedColumns = [
  //   ...originalColumns.map((col) =>
  //     allDataOfHalalsColumns.find((item) => item.column_name === col)
  //   ),
  //   ...allDataOfHalalsColumns.filter(
  //     (item) => !originalColumns.includes(item.column_name)
  //   ),
  // ].filter((column) => column.column_name !== "id"); // Filter out the "id" column

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setInputValues({});
  };

  function formatPhoneNumber(phone) {
    const words = phone.split(" ");
    if (words.length > 0) {
      const firstWord = words[0];
      if (firstWord.length > 1) {
        const lastChar = firstWord.charAt(0);
        words[0] = firstWord.substring(1, firstWord.length) + lastChar;
      }
    }
    const reversedWords = words.reverse().join(" ");
    return <div>{reversedWords}</div>;
  }

  // const getColumnByName = useCallback(
  //   (columnName) => {
  //     return allDataOfHalalsColumns.find(
  //       (column) => column.column_name === columnName
  //     );
  //   },
  //   [allDataOfHalalsColumns]
  // );

  const handleInputChange = useCallback(
    async (column, value) => {
      try {
        if (column === "commandName") {
          const commandId = await getCommandIdByName(value);
          setInputValues((prevValues) => ({
            ...prevValues,
            ["nifgaimCommandId"]: commandId,
          }));
        } else if (column === "graveyardName") {
          const graveyardId = await getGraveyardIdByName(value);
          setInputValues((prevValues) => ({
            ...prevValues,
            ["nifgaimGraveyardId"]: graveyardId,
          }));
        }
        setInputValues((prevValues) => ({
          ...prevValues,
          [column]: value,
        }));
      } catch (error) {
        console.error("Error:", error);
        // Handle error appropriately, such as displaying an error message
      }
    },
    [setInputValues]
  );

  const handleSubmitForm = async () => {
    try {
      const updatedHalalData = {};

      // Iterate over keys in selectedRow
      for (const key in selectedRow) {
        let sanitizedValue;
        // Check if the key exists in inputValues and has a value
        if (inputValues.hasOwnProperty(key) && inputValues[key]) {
          // Escape single quotes and double quotes in the value from inputValues
          console.log(inputValues[key]);

          if (typeof inputValues[key] === "string") {
            sanitizedValue = inputValues[key]
              .replace(/\\/g, "\\\\")
              .replace(/'/g, "''");
          } else {
            sanitizedValue = inputValues[key];
          }
          updatedHalalData[key] = sanitizedValue; // Use the sanitized value
        } else {
          // Escape single quotes and double quotes in the value from selectedRow
          console.log(selectedRow[key]);
          if (typeof selectedRow[key] === "string") {
            sanitizedValue = selectedRow[key]
              .replace(/\\/g, "\\\\")
              .replace(/'/g, "''");
          } else {
            sanitizedValue = selectedRow[key];
          }
          updatedHalalData[key] = sanitizedValue; // Use the sanitized value
        }
      }

      const updatedHalal = await updateHalal(
        loggedUserId,
        selectedRow.id,
        updatedHalalData
      );

      const graveyard = await getGraveyardById(updatedHalal.nifgaimGraveyardId);
      const graveyardName = graveyard.graveyardName;
      const commandName = await getCommandNameById(
        updatedHalal.nifgaimCommandId
      );

      // Create a new object with updated values
      const halalUpdatedRow = {
        id: selectedRow.id,
        ...updatedHalal,
        graveyardName: graveyardName,
        commandName: commandName,
      };

      // Update the row in the state
      setRows((prevRows) =>
        prevRows.map((row) => {
          if (row.id === selectedRow.id) {
            return { ...row, ...halalUpdatedRow };
          }
          return row;
        })
      );
      Swal.fire({
        title: `עודכן בהצלחה "${updatedHalal.firstName}" החלל `,
        text: "",
        icon: "success",
        confirmButtonText: "אישור",
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then((result) => {
        handleCloseDialog();
      });
    } catch (error) {
      console.log(error);
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
          if (error.type === "unique violation") {
            if (error.path === "privateNumber") {
              errorsForSwal += `<li>קיים חלל עם ${
                translationDict[error.path]
              }: ${error.value} (${errorDict[error.validatorKey]})</li>`;
            } else {
              errorsForSwal += `<li>הערך בעמודה "${
                translationDict[error.path]
              }" קיים (${errorDict[error.validatorKey]})</li>`;
            }
          }
        });
      } else {
        const nameOfColumn =
          translationDict[error.response.data.body.parent.column];
        errorsForSwal += `<li>התא "${nameOfColumn}" ריק</li>`;
      }
      Swal.fire({
        title: `לא ניתן לעדכן את השאר`,
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

  const handleDeleteClick = (id) => () => {
    try {
      const halalName = selectedRow.firstName + " " + selectedRow.lastName;

      Swal.fire({
        title: `האם את/ה בטוח/ה שתרצה/י למחוק החלל ${halalName}`,
        text: "פעולה זאת איננה ניתנת לשחזור",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "מחק חלל",
        cancelButtonText: "בטל",
        reverseButtons: true,
        customClass: {
          container: "swal-dialog-custom",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteHalal(loggedUserId, selectedRow.id);
            setRows((prevRows) =>
              prevRows.filter((row) => row.id !== selectedRow.id)
            );
            Swal.fire({
              title: `חלל "${halalName}" נמחק בהצלחה!`,
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
            Swal.fire({
              title: `לא ניתן למחוק את החלל`,
              text: error,
              icon: "error",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "אישור",
              reverseButtons: true,
              customClass: {
                container: "swal-dialog-custom",
              },
            }).then((result) => {});
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

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
                  עריכת חלל
                </p>
                <p
                  style={{
                    fontSize: "large",
                    color: theme.palette.secondary.main,
                  }}
                >
                  {selectedRow &&
                    selectedRow.lastName + " " + selectedRow.firstName}
                </p>
              </div>
            </DialogTitle>
          </ThemeProvider>
        </CacheProvider>
        <Divider></Divider>

        <DialogContent>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            {allDataOfHalalsColumns.map((column) => {
              const { column_name: key, data_type } = column;
              const value =
                inputValues[key] !== undefined
                  ? inputValues[key]
                  : selectedRow[key]; // Get value from inputValues if available, otherwise fallback to selectedRow

              return (
                <div
                  key={key}
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {key === "commandName" ? (
                    <>
                      <InputLabel id={key}>
                        {translationDict[key] ? translationDict[key] : key}
                      </InputLabel>
                      <FormControl>
                        <Select
                          {...register(key, {
                            required: {
                              value: true,
                              message: `${
                                translationDict[key] || key
                              } שדה חובה `,
                            },
                          })}
                          sx={{ direction: "rtl" }}
                          labelId={key}
                          value={value}
                          displayEmpty
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          renderValue={(value) => (value ? value : "פיקוד")} // Render placeholder
                        >
                          <MenuItem sx={{ direction: "rtl" }} value="" disabled>
                            פיקוד
                          </MenuItem>
                          {commands.map((command) => (
                            <MenuItem
                              sx={{ direction: "rtl" }}
                              key={command}
                              value={command}
                            >
                              {command}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors[key] && (
                          <p style={{ color: "red" }}>{errors[key].message}</p>
                        )}
                      </FormControl>
                    </>
                  ) : key === "graveyardName" ? (
                    <>
                      <InputLabel id={key}>
                        {translationDict[key] ? translationDict[key] : key}
                      </InputLabel>
                      <FormControl>
                        <Select
                          {...register(key, {
                            required: {
                              value: true,
                              message: `${
                                translationDict[key] || key
                              } שדה חובה `,
                            },
                          })}
                          sx={{ direction: "rtl" }}
                          labelId={key}
                          value={value}
                          displayEmpty
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          renderValue={(value) =>
                            value ? value : "בחר בית קברות"
                          } // Render placeholder
                        >
                          <MenuItem sx={{ direction: "rtl" }} value="" disabled>
                            בחר בית קברות
                          </MenuItem>
                          {graveyards.map((graveyard) => (
                            <MenuItem
                              sx={{ direction: "rtl" }}
                              key={graveyard.id}
                              value={graveyard.graveyardName}
                            >
                              {graveyard.graveyardName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors[key] && (
                          <p style={{ color: "red" }}>{errors[key].message}</p>
                        )}
                      </FormControl>
                    </>
                  ) : column.column_name === "rank" ? (
                    <>
                      <InputLabel id={column.column_name}>דרגה</InputLabel>
                      <FormControl>
                        <RtlPlugin>
                          <Select
                            {...register(column.column_name, {
                              required: {
                                value: true,
                                message: `${
                                  translationDict[column.column_name] ||
                                  column.column_name
                                } שדה חובה `,
                              },
                            })}
                            labelId={column.column_name}
                            value={value || ""}
                            displayEmpty
                            onChange={(event) =>
                              handleInputChange(
                                column.column_name,
                                event.target.value
                              )
                            }
                            style={{
                              direction: "rtl",
                              width: "100%",
                              marginTop: "8px",
                            }}
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
                          {errors["rank"] && (
                            <p style={{ color: "red" }}>
                              {errors["rank"].message}
                            </p>
                          )}
                        </RtlPlugin>
                        {errors[column.column_name] && (
                          <p style={{ color: "red" }}>
                            {errors[column.column_name].message}
                          </p>
                        )}
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <InputLabel id={key}>
                        {translationDict[key] ? translationDict[key] : key}
                      </InputLabel>
                      {data_type === "timestamp with time zone" ? (
                        <RtlPlugin
                          style={{
                            margin: "auto",
                            marginTop: "15px",
                          }}
                        >
                          <FormControl fullWidth>
                            <DatePicker
                              {...register(key, {
                                required: {
                                  value: true,
                                  message: `${
                                    translationDict[key] || key
                                  } שדה חובה `,
                                },
                              })}
                              label="תאריך ברירת מחדל"
                              value={value ? dayjs(value) : null}
                              onChange={(date) => handleInputChange(key, date)}
                              sx={{ width: "100%" }}
                            />
                            {errors[key] && (
                              <p style={{ color: "red" }}>
                                {errors[key].message}
                              </p>
                            )}
                          </FormControl>
                        </RtlPlugin>
                      ) : data_type === "integer" ? (
                        <>
                          <Input
                            {...register(key, {
                              required: {
                                value: true,
                                message: `${
                                  translationDict[key] || key
                                } שדה חובה `,
                              },
                            })}
                            type="number"
                            value={value || ""}
                            inputProps={{ maxLength: "500" }}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                          />
                          {errors[key] && (
                            <p style={{ color: "red" }}>
                              {errors[key].message}
                            </p>
                          )}
                        </>
                      ) : data_type === "boolean" ? (
                        <FormControl>
                          <RadioGroup
                            value={value}
                            aria-labelledby="booleanSelect"
                            name="controlled-radio-buttons-group"
                            {...register(key, {
                              validate: () => {
                                if (value === null) {
                                  return `${
                                    translationDict[key] || key
                                  } שדה חובה `;
                                } else {
                                  return true;
                                }
                              },
                            })}
                            onChange={(e) => {
                              handleInputChange(key, e.target.value);
                            }}
                            row
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              sx={{ marginRight: 0 }}
                              label="כן"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="לא"
                            />
                          </RadioGroup>
                          {errors[key] && (
                            <p style={{ color: "red" }}>
                              {errors[key].message}
                            </p>
                          )}
                        </FormControl>
                      ) : data_type === "USER-DEFINED" ? (
                        <FormControl fullWidth>
                          <Select
                            {...register(key, {
                              required: {
                                value: true,
                                message: `${
                                  translationDict[key] || key
                                } שדה חובה `,
                              },
                            })}
                            sx={{ direction: "rtl" }}
                            labelId={key}
                            value={value || ""}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                          >
                            {enums[key] ? (
                              enums[key].map((option) => (
                                <MenuItem
                                  dir="rtl"
                                  key={option}
                                  value={option}
                                  selected={option.trim() === value?.trim()}
                                >
                                  {option}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value={value}>{value}</MenuItem>
                            )}
                          </Select>
                          {errors[key] && (
                            <p style={{ color: "red" }}>
                              {errors[key].message}
                            </p>
                          )}
                        </FormControl>
                      ) : (
                        <>
                          <Input
                            value={value || ""}
                            {...register(key, {
                              required: {
                                value: true,
                                message: `${
                                  translationDict[key] || key
                                } שדה חובה `,
                              },
                              ...(key === "privateNumber"
                                ? {
                                    pattern: {
                                      value: /^\d{7}$/,
                                      message: ` הכנס מספר אישי בעל 7 ספרות `,
                                    },
                                  }
                                : {}),
                              // ...(key === "lastName" || key === "firstName"
                              //   ? {
                              //       pattern: {
                              //         value: /^[a-zA-Z\u05D0-\u05EA\s]+$/,
                              //         message: ` שם יכול לכלול רק אותיות `,
                              //       },
                              //     }
                              //   : {}),
                            })}
                            inputProps={{ maxLength: "500" }}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value)
                            }
                          />
                          {errors[key] && (
                            <p style={{ color: "red" }}>
                              {errors[key].message}
                            </p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })}
            <div>
              <h2 style={{ color: theme.palette.secondary.main }}>מלווים </h2>
              {soldierAccompanieds.length === 0 ? (
                <p>אין מלווים משוייכים</p>
              ) : (
                soldierAccompanieds.map((soldier, index) => (
                  <div key={index}>
                    <p>
                      {`שם: `}
                      <strong>{soldier.fullName}</strong>
                    </p>
                    <p>
                      {`מספר פרטי: `}
                      <strong>{soldier.privateNumber}</strong>
                    </p>
                    <p>
                      {`דרגה: `}
                      <strong>{soldier.rank}</strong>
                    </p>
                    <p>
                      {`טלפון: `}
                      <strong>{formatPhoneNumber(soldier.phone)}</strong>
                    </p>
                    <p>
                      {`יחידה: `}
                      <strong>{soldier.unit}</strong>
                    </p>
                    <p>
                      {`הערות: `}
                      <strong>{soldier.comments}</strong>
                    </p>
                    <br />
                  </div>
                ))
              )}
              <br />
            </div>
            <div>
              <h2 style={{ color: theme.palette.secondary.main }}>שארים</h2>
              {leftOvers.length === 0 ? (
                <p>אין שארים משוייכים</p>
              ) : (
                leftOvers.map((leftOver, index) => (
                  <div key={index}>
                    <p>
                      {`שם: `}
                      <strong>{leftOver.fullName}</strong>
                    </p>
                    <p>
                      {`קרובות: `}
                      <strong>{leftOver.proximity}</strong>
                    </p>
                    <p>
                      {`עיר: `}
                      <strong>{leftOver.city}</strong>
                    </p>
                    <p>
                      {`כתובת: `}
                      <strong>{leftOver.address}</strong>
                    </p>
                    <p>
                      {`טלפון: `}
                      <strong>{formatPhoneNumber(leftOver.phone)}</strong>
                    </p>
                    <p>
                      {`הערות: `}
                      <strong>{leftOver.comments}</strong>
                    </p>
                    <p>
                      {`דתי: `}
                      <strong>{leftOver.isReligious ? "כן" : "לא"}</strong>
                    </p>
                    <br />
                  </div>
                ))
              )}
              <br />
            </div>
          </form>
        </DialogContent>

        <Divider></Divider>
        <DialogActions>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button onClick={handleCloseDialog}>ביטול</Button>
            <div>
              <Button
                variant="contained"
                onClick={handleSubmit(handleSubmitForm)}
                style={{ marginLeft: "10px" }}
              >
                שמור שינויים
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteClick(selectedRow.id)}
              >
                מחיקה
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
