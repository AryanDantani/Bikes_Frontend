/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./booking.scss";
import fetcher from "../fetcher";
import { useNavigate, useParams } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

const RentalForm = () => {
  const params = useParams();
  const navigate = useNavigate();
  const UserData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : "";
  const [bikeData, setBikeData] = useState([]);
  const [error, setError] = useState("");
  const [errorId, setErrorId] = useState("");
  // const [bikeId, setBikeId] = useState("");
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
    date: "",
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
    // console.log(data, "😍😍");
    setBikeData([data.bike]);
  };

  const DecrementStock = async () => {
    let data = await fetch(
      `http://localhost:4000/api/category/bike/booked/${params.id}`
    );
    data = await data.json();
    console.log(data, "😍😍");
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

  console.log(bikeData);

  const validateForm = () => {
    if (
      !bookingForm.firstname ||
      !bookingForm.lastname ||
      !bookingForm.email ||
      !bookingForm.phone ||
      !bookingForm.city ||
      !bookingForm.date ||
      !bookingForm.startTime ||
      !bookingForm.endTime ||
      !bookingForm.age ||
      !bookingForm.liceNumber ||
      !bookingForm.idProof
    ) {
      toast.error("Please fill all the fields");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingForm.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Validate age as a number
    if (isNaN(bookingForm.age)) {
      toast.error("Please enter a valid age");
      return false;
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(bookingForm.phone)) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    // Validate driving license number format
    const licenseRegex =
      /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
    if (!licenseRegex.test(bookingForm.liceNumber)) {
      toast.error("Please enter a valid driving license number");
      return false;
    }

    // Validate ID proof number
    const idProofRegex = /^\d{12}$/;
    if (!idProofRegex.test(bookingForm.idProof)) {
      toast.error("Please enter a valid ID proof number");
      return false;
    }

    return true;
  };

  async function save(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetcher.post(`/api/rental`, {
        firstname: bookingForm.firstname,
        lastname: bookingForm.lastname,
        age: bookingForm.age,
        email: bookingForm.email,
        city: bookingForm.city,
        date: bookingForm.date,
        phone: bookingForm.phone,
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime,
        userId: UserData,
        bikeId: params.id,
        licenceNumber: bookingForm.liceNumber,
      });

      console.log(response)

      if (response.status === 201) {
        toast.success("Booking successful!");
        DecrementStock();
        navigate("/bookings");
      } else {
        const errorData = await response.json();
        toast.warning(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving booking:", error);
      toast.error("An error occurred while saving the booking.");
    }
  }

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

  const handleDateChange = (date) => {
    const dateObject = date instanceof Date ? date : new Date(date);
    const formattedDate = dateObject
      ? dateObject?.toLocaleDateString("en-GB")
      : null;

    setBookingForm({
      ...bookingForm,
      date: formattedDate,
    });
  };

  console.log(params.id);

  return (
    <div className="booking-main">
      <ToastContainer />
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
      </div>
      <div className="booking-form">
        <div>
          <h2>Rental Booking</h2>
        </div>
        <hr />
        <div
          style={{ display: "flex", marginBottom: "25px", marginTop: "35px" }}
        >
          <div>
            <TextField
              className="form-fn"
              id="filled-basic"
              label="First Name"
              variant="filled"
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
              variant="filled"
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
              variant="filled"
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
              variant="filled"
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
              variant="filled"
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
        <div style={{ marginTop: "30px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="form-date"
              value={dayjs(bookingForm?.date)}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              disablePast
              shouldDisableDate={(date) => disableWeekends(date)}
            />
            <TimePicker
              label="Start Time"
              // className="form-time"
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
              // className="form-time"
              value={bookingForm?.endTime}
              onChange={handleChangeEndTime}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
            />
          </LocalizationProvider>
        </div>
        <div style={{ diplay: "flex" }}>
          <div>
            <TextField
              id="filled-basic"
              label="Licence Number"
              className="form-lice"
              variant="filled"
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
              variant="filled"
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
          }}
          variant="outlined"
          onClick={(event) => {
            save(event);
          }}
        >
          submit
        </Button>
      </div>
    </div>
  );
};

export default RentalForm;
