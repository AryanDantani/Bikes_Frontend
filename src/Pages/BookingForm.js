/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./booking.scss";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from 'dayjs';
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

const BookingForm = () => {
  const params = useParams();
  const navigate = useNavigate()
  const UserData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))._id : "";
  const [bikeData, setBikeData] = useState([]);
  const [bikeId, setBikeId] = useState("");
  const [bookingForm, setBookingForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    userId: UserData,
    phone: "",
    city: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const getBikeById = async () => {
      let data = await fetch(`http://localhost:3001/bike/${params.id}`);
      data = await data.json();
      const bikeId = data.bikes[0]._id
       setBikeData(data?.bikes);
       setBikeId(bikeId)
    };
    getBikeById();
  }, []);

  async function save(event) {
    event.preventDefault();

    if (
      (
        !bookingForm.firstname,
        !bookingForm.lastname,
        !bookingForm.email,
        !bookingForm.phone,
        !bookingForm.city,
        !bookingForm.date,
        !bookingForm.time
      )
    ) {
      alert("Please fill the form");
      return false;
    }

    try {
      const response = await axios.post("http://localhost:3001/booking", {
        firstname: bookingForm?.firstname,
        lastname: bookingForm?.lastname,
        email: bookingForm?.email,
        city: bookingForm?.city,
        date: bookingForm?.date,
        phone: bookingForm?.phone,
        time: bookingForm?.time,
        userId: UserData,
        bikeId: bikeId
      });

      if (response.status === 200) {
        alert("Users Booking Is Done Successfully");
        navigate("/booking")
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please check the console for more details.");
    }
  }

  const handleTimeChange = (time) => {
    const dateObject = time instanceof Date ? time : new Date(time);
    const formattedTime = dateObject.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setBookingForm({
      ...bookingForm,
      time: formattedTime,
    });
  };

  const handleDateChange = (date) => {
    debugger
    const dateObject = date instanceof Date ? date : new Date(date);
    const formattedDate = dateObject ? dateObject?.toLocaleDateString('en-GB') : null;

    setBookingForm({
      ...bookingForm,
      date: formattedDate,
    });
  };

  return (
    <div className="booking-main">
      <div className="category2">
        {bikeData.map((item) => {
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
                    <p>Price for Purchase:</p>
                  </div>
                  <div className="category-val2">
                    <p>{item?.engine}</p>
                    <p>{item?.mileage}</p>
                    <p>{item?.owner}</p>
                    <p>{item?.name}</p>
                    <p>{item?.km}</p>
                    <p>{item?.available}</p>
                    <p>{item?.price}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="booking-form">
        <div>
          <h2>Test Drive Booking</h2>
        </div>
        <hr />
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
        <TextField
          className="form-ph"
          id="filled-basic"
          label="Phone no"
          variant="filled"
          value={bookingForm?.phone}
          onChange={(e) => {
            setBookingForm({
              ...bookingForm,
              phone: e.target.value,
            });
          }}
        />
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="form-date"
            value={dayjs(bookingForm?.date)}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
          />
          <TimePicker
            label="With Time Clock"
            className="form-time"
            value={bookingForm?.time}
            onChange={handleTimeChange}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
          />
        </LocalizationProvider>
        <br />
        <Button
          style={{ color: "#fff", backgroundColor: "#000", border: "none", width: "20%" }}
          variant="outlined"
          onClick={(event) => {
            save(event)
          }}
        >
          submit
        </Button>
      </div>
    </div>
  );
};

export default BookingForm;
