/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./booking.scss";
import { useNavigate, useParams } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { UseChannelIdContext } from "../Context/Context";
import CircularProgress from "@mui/material/CircularProgress";

const RentalForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const UserData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : "";
  const [bikeData, setBikeData] = useState([]);
  const { setBookedData } = UseChannelIdContext();
  const [error, setError] = useState("");
  const [isDay, setIsDay] = useState(false);
  const [isHours, setIsHours] = useState(false);
  const [errorId, setErrorId] = useState("");
  const [isLoad, setIsLoad] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    userId: UserData,
    liceNumber: "",
    idProof: "",
    phone: "",
    city: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    getBikeById();
  }, []);

  const getBikeById = async () => {
    let data = await fetch(
      `http://localhost:4000/api/category/bike/${params.id}`
    );
    data = await data.json();
    setBikeData([data.bike]);
    localStorage.setItem("bikeId", JSON.stringify(data.bike._id));
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setBookingForm({
      ...bookingForm,
      liceNumber: value,
    });

    const regex =
      /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
    if (!regex.test(value)) {
      setError("Please enter a valid driving license number");
    } else {
      setError("");
    }
  };

  const handleChangeIdprof = (e) => {
    const value = e.target.value;
    setBookingForm({
      ...bookingForm,
      idProof: value,
    });

    const regex = /^\d{12}$/;
    if (!regex.test(value)) {
      setErrorId("Please enter a valid IdProof Number");
    } else {
      setErrorId("");
    }
  };

  const disableWeekends = (date) => {
    if (!date) {
      return false;
    }
    const day = date.day;
    return day === 0 || day === 6;
  };

  const handleChangeStartTime = (time) => {
    const dateObject = time instanceof Date ? time : new Date(time);
    const formattedTime = dateObject.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setBookingForm({
      ...bookingForm,
      startTime: formattedTime,
    });
  };

  const handleChangeEndTime = (time) => {
    const dateObject = time instanceof Date ? time : new Date(time);
    const formattedTime = dateObject.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setBookingForm({
      ...bookingForm,
      endTime: formattedTime,
    });
  };

  const handleStartDateChange = (date) => {
    const dateObject = date instanceof Date ? date : new Date(date);
    const formattedDate = dateObject
      ? dateObject?.toLocaleDateString("en-GB")
      : null;

    setBookingForm({
      ...bookingForm,
      startDate: formattedDate,
    });
  };

  const handleEndDateChange = (date) => {
    const dateObject = date instanceof Date ? date : new Date(date);
    const formattedDate = dateObject
      ? dateObject?.toLocaleDateString("en-GB")
      : null;

    setBookingForm({
      ...bookingForm,
      endDate: formattedDate,
    });
  };

  return (
    <>
      <div>
        <h2>Rental Booking</h2>
      </div>
      <div className="booking-main">
        <ToastContainer />
        {isLoad ? (
          <div className="loader-bg">
            <CircularProgress className="loader" />
          </div>
        ) : (
          ""
        )}
        {/* <div className="category2">
        <>
          {bikeData.length !== null &&
            bikeData?.map((item) => {
              return (
                <div className="category-main2" key={item?.name}>
                  <div className="category-card2">
                    <div className="category-img2">
                      <img src={item?.image} />
                    </div>
                    <hr />
                    <div className="category-details2">
                      <div className="category-lab2">
                        <p>Engine:</p>
                        <p>Mileage:</p>
                        <p>Owner:</p>
                        <p>Model:</p>
                        <p>Km / Run:</p>
                        <p>Available:</p>
                        <p>Price for Rent:</p>
                      </div>
                      <div className="category-val2">
                        <p>{item?.engine}</p>
                        <p>{item?.mileage}</p>
                        <p>{item?.owner}</p>
                        <p>{item?.name}</p>
                        <p>{item?.km}</p>
                        <p>{item?.date}</p>
                        <p>{item?.rent}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </>
      </div> */}
        <div className="booking-form">
          <div className="booking-field">
            <div
              style={{
                display: "flex",
                marginBottom: "25px",
                marginTop: "35px",
              }}
            >
              <div>
                <TextField
                  className="form-fn"
                  id="filled-basic"
                  label="First Name"
                  variant="outlined"
                  value={bookingForm?.firstname}
                  onChange={(e) => {
                    setBookingForm({
                      ...bookingForm,
                      firstname: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <TextField
                  className="form-ln"
                  id="filled-basic"
                  label="Last Name"
                  variant="outlined"
                  value={bookingForm?.lastname}
                  onChange={(e) => {
                    setBookingForm({
                      ...bookingForm,
                      lastname: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <TextField
                  className="form-em"
                  id="filled-basic"
                  label="Email id"
                  variant="outlined"
                  value={bookingForm?.email}
                  onChange={(e) => {
                    setBookingForm({
                      ...bookingForm,
                      email: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  marginLeft: "29px",
                  marginRight: "25px",
                }}
              >
                <TextField
                  className="form-ag"
                  id="filled-basic"
                  label="Age"
                  variant="outlined"
                  value={bookingForm?.age}
                  onChange={(e) => {
                    const age = parseInt(e.target.value);
                    setBookingForm({
                      ...bookingForm,
                      age: isNaN(age) ? "" : age,
                    });
                  }}
                />
              </div>
              <div>
                <TextField
                  id="filled-basic"
                  label="Phone no"
                  variant="outlined"
                  className="form-ph"
                  value={bookingForm?.phone}
                  onChange={(e) => {
                    setBookingForm({
                      ...bookingForm,
                      phone: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <FormControl
                  variant="standard"
                  sx={{ m: 1, minWidth: 120 }}
                  className="form-select"
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Pick-up City
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={bookingForm?.city}
                    onChange={(e) => {
                      setBookingForm({
                        ...bookingForm,
                        city: e.target.value,
                      });
                    }}
                    label="Pick-up City"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Thaltej"}>Thaltej</MenuItem>
                    <MenuItem value={"Shilaj"}>Shilaj</MenuItem>
                    <MenuItem value={"Bopal"}>Bopal</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
                marginLeft: "15%",
              }}
            >
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isDay}
                      onChange={(e) => {
                        setIsDay(e.target.checked);
                        setIsHours(false);
                      }}
                    />
                  }
                  label="Do You want Bike for Days"
                />
              </div>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isHours}
                      onChange={(e) => {
                        setIsHours(e.target.checked);
                        setIsDay(false);
                      }}
                    />
                  }
                  label="Do You want Bike for Hours"
                />
              </div>
            </div>

            <div style={{ marginLeft: "-61%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {isHours ? (
                  <div>
                    <div style={{ padding: "25px" }}>
                      <TimePicker
                        label="Start Time"
                        value={bookingForm?.startTime}
                        onChange={handleChangeStartTime}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                      />
                      <span>- To -</span>
                      <TimePicker
                        label="End Time"
                        value={bookingForm?.endTime}
                        onChange={handleChangeEndTime}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                      />
                    </div>
                    <div>
                      <DatePicker
                        // className="form-date"
                        value={dayjs(bookingForm?.startDate)}
                        onChange={handleStartDateChange}
                        format="DD/MM/YYYY"
                        disablePast
                        shouldDisableDate={(date) => disableWeekends(date)}
                      />
                      <span>- To -</span>
                      <DatePicker
                        // className="form-date"
                        value={dayjs(bookingForm?.endDate)}
                        onChange={handleEndDateChange}
                        format="DD/MM/YYYY"
                        disablePast
                        shouldDisableDate={(date) => disableWeekends(date)}
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {isDay ? (
                  <>
                    <DatePicker
                      className="form-date"
                      value={dayjs(bookingForm?.startDate)}
                      onChange={handleStartDateChange}
                      format="DD/MM/YYYY"
                      disablePast
                      shouldDisableDate={(date) => disableWeekends(date)}
                    />
                    <span>- To -</span>
                    <DatePicker
                      className="form-date"
                      value={dayjs(bookingForm?.endDate)}
                      onChange={handleEndDateChange}
                      format="DD/MM/YYYY"
                      disablePast
                      shouldDisableDate={(date) => disableWeekends(date)}
                    />
                  </>
                ) : (
                  ""
                )}
              </LocalizationProvider>
            </div>
            <div className="Lic-and-Id" style={{ diplay: "flex" }}>
              <div>
                <TextField
                  id="filled-basic"
                  label="Licence Number"
                  className="form-lice"
                  variant="outlined"
                  value={bookingForm.liceNumber}
                  onChange={handleChange}
                />
                {error && <div style={{ color: "red" }}>{error}</div>}
              </div>
              <div>
                <TextField
                  id="filled-basic"
                  label="ID Proof Number"
                  className="form-lice"
                  variant="outlined"
                  value={bookingForm.idProof}
                  onChange={handleChangeIdprof}
                />
                {errorId && <div style={{ color: "red" }}>{errorId}</div>}
              </div>
            </div>
            <br />
            <Button
              style={{
                color: "#fff",
                backgroundColor: "#000",
                border: "none",
                width: "20%",
                marginLeft: "-76%",
              }}
              variant="outlined"
              onClick={(event) => {
                setBookedData({
                  ...bookingForm,
                  isDay: isDay,
                });
                setIsLoad(true);
                setTimeout(() => {
                  navigate("/paymentpage/" + UserData);
                  setIsLoad(false);
                }, [5000]);
                // save(event);
              }}
            >
              submit
            </Button>
          </div>
        </div>
        <div className="category2">
        <>
          {bikeData.length !== null &&
            bikeData?.map((item) => {
              return (
                <div className="category-main2" key={item?.name}>
                  <div className="category-card2">
                    <div className="category-img2">
                      <img src={item?.image} />
                    </div>
                    <div className="category-details2">
                      <div className="category-lab2">
                        <p>Engine:</p>
                        <p>Mileage:</p>
                        <p>Owner:</p>
                        <p>Model:</p>
                        <p>Km / Run:</p>
                        <p>Available:</p>
                        <p>Price for Rent:</p>
                      </div>
                      <div className="category-val2">
                        <p>{item?.engine}</p>
                        <p>{item?.mileage}</p>
                        <p>{item?.owner}</p>
                        <p>{item?.name}</p>
                        <p>{item?.km}</p>
                        <p>{item?.date}</p>
                        <p>{item?.rent}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </>
      </div>
      </div>
    </>
  );
};

export default RentalForm;
