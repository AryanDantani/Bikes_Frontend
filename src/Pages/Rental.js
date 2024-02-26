/* eslint-disable react-hooks/exhaustive-deps */ import "./bookingPage.scss";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { useNavigate } from "react-router-dom";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import "./rentalFrom.scss";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  InputLabel,
} from "@mui/material";

const Rental = () => {
  // const navigate = useNavigate();
  const [rentalData, setRentalData] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [editData, setEditData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    date: "",
    time: "",
    city: "",
  });
  const [bookingId, setBookingId] = useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };

  const UserData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : "";
  const User = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  const handleTimeChange = (time) => {
    const dateObject = time instanceof Date ? time : new Date(time);
    const formattedTime = dateObject.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setEditData({
      ...editData,
      time: formattedTime,
    });
  };

  const handleDateChange = (date) => {
    const dateObject = date instanceof Date ? date : new Date(date);
    const formattedDate = dateObject
      ? dateObject?.toLocaleDateString("en-GB")
      : null;

    setEditData({
      ...editData,
      date: formattedDate,
    });
  };

  const GetBookingForUser = async () => {
    let data = await fetch(`http://localhost:4000/api/rental/${UserData}`);
    data = await data.json();
    console.log(data)
    setRentalData(data);
  };

  const GetBookingForAdmin = async () => {
    let data = await fetch(`http://localhost:4000/api/rental`);
    data = await data.json();
    console.log(data.map((i) => i.bike))
    setRentalData(data);
  };

  async function handleUpdate() {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/rental/${bookingId}`,
        {
          firstname: editData.firstname,
          lastname: editData.lastname,
          email: editData.email,
          age: editData.age,
          date: editData.date,
          time: editData.time,
          city: editData.city,
        }
      );
      if (response.status === 200) {
        toast.success("Booking Created Successfully");
        GetBookingForAdmin();
        setIsOpen(false);
      }
    } catch (err) {
      toast.error(err);
    }
  }

  async function handlebooking(bookingId) {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/category/bikes/cancel/${bookingId}`,
      );
      if (response.status === 200) {
        toast.success("Booking Canceled Successfully");
        setIsOpen(false);
      }
    } catch (err) {
      toast.error(err);
    }
  }

  const DeleteBookings = async (rentalId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/rental/${rentalId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        toast.success("Rental deleted successfully");
        if (User.role === "admin") {
          GetBookingForAdmin();
        } else {
          GetBookingForUser();
        }
      } else {
        toast.warning("Failed to delete booking");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    if (User.role === "user") {
      GetBookingForUser();
    } else {
      GetBookingForAdmin();
    }
  }, []);

  return (
    <div>
      <ToastContainer />
      <div>
        {User.role === "user" ? (
          <h1> Your Bookings </h1>
        ) : (
          <h1> Available Rental Bookings </h1>
        )}
      </div>
      <div>
        <div>
          {rentalData.length > 0 && rentalData.map((item, index) => {
            return (
              <div key={item?._id}>
                <div className="sub-details">
                  <div
                    style={{
                      marginRight: "116px",
                    }}
                  >
                    <p>Name:</p>
                  </div>
                  <div>
                    <p>{item.firstname + item.lastname}</p>
                  </div>
                </div>
                <div className="sub-details">
                  <div
                    style={{
                      marginRight: "120px",
                    }}
                  >
                    <p>Email:</p>
                  </div>
                  <div>
                    <p>{item.email}</p>
                  </div>
                </div>
                <div className="sub-details">
                  <div
                    style={{
                      marginRight: "113px",
                    }}
                  >
                    <p>Phone:</p>
                  </div>
                  <div>
                    <p>{item.phone}</p>
                  </div>
                </div>
                <div className="sub-details">
                  <div
                    style={{
                      marginRight: "120px",
                    }}
                  >
                    <p>Time:</p>
                  </div>
                  <div>
                    <p>{item.time}</p>
                  </div>
                </div>
                <div className="sub-details">
                  <div
                    style={{
                      marginRight: "120px",
                    }}
                  >
                    <p>Date:</p>
                  </div>
                  <div>
                    <p>{item.date}</p>
                  </div>
                </div>
                <div className="sub-details">
                  <div
                    style={{
                      marginRight: "125px",
                    }}
                  >
                    <p>City:</p>
                  </div>
                  <div>
                    <p>{item.city}</p>
                  </div>
                </div>
                <div className="sub-details">
                  <div
                    style={{
                      marginRight: "108px",
                    }}
                  >
                    <p>Model:</p>
                  </div>
                  <div>
                    <p>{item?.bike?.name}</p>
                  </div>
                </div>
                <div className="sub-details">
                  <div
                    style={{
                      marginRight: "125px",
                    }}
                  >
                    <p>Rent:</p>
                  </div>
                  <div>
                    <p>{item?.bike?.rent}</p>
                  </div>
                </div>
                <div className="sub-details">
                  <div
                    style={{
                      marginRight: "125px",
                    }}
                  >
                    <p>KM:</p>
                  </div>
                  <div>
                    <p>{item?.bike?.km}</p>
                  </div>
                </div>
                <div className="sub-details">
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setBookingId(item?._id);
                      setEditData({
                        firstname: item.firstname,
                        lastname: item.lastname,
                        email: item.email,
                        phone: item.phone,
                        age: item.age,
                        date: item.date,
                        time: item.time,
                        city: item.city,
                      });
                    }}
                  >
                    Edit Booking
                  </button>
                  <button
                    onClick={() => {
                      handlebooking(item?.bike?._id)
                      DeleteBookings(item?._id);
                    }}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Edit Your bookings"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              // className="form-fn"
              id="filled-basic"
              label="First Name"
              variant="filled"
              style={{
                width: "240px",
                marginRight: "12%",
              }}
              disabled
              value={editData.firstname}
              onChange={(e) => {
                setEditData({
                  ...editData,
                  firstname: e.target.value,
                });
              }}
            />
            <TextField
              // className="form-ln"
              style={{
                width: "235px",
              }}
              id="filled-basic"
              label="Last Name"
              variant="filled"
              value={editData.lastname}
              disabled
              onChange={(e) => {
                setEditData({
                  ...editData,
                  lastname: e.target.value,
                });
              }}
            />
            <TextField
              // className="form-em"
              id="filled-basic"
              label="Email id"
              variant="filled"
              style={{
                width:"250px",
                marginRight: "12%",
                marginTop: "3%",
              }}
              disabled
              value={editData.email}
              onChange={(e) => {
                setEditData({
                  ...editData,
                  email: e.target.value,
                });
              }}
            />
            <TextField
              // className="form-em"
              id="filled-basic"
              label="Age"
              variant="filled"
              style={{
                width:"250px",
                marginRight: "12%",
                marginTop: "3%",
              }}
              value={editData.age}
              onChange={(e) => {
                setEditData({
                  ...editData,
                  age: e.target.value,
                });
              }}
            />
            <TextField
              // className="form-ph"
              id="filled-basic"
              label="Phone no"
              variant="filled"
              style={{
                marginTop: "3%",
              }}
              disabled
              value={editData.phone}
              onChange={(e) => {
                setEditData({
                  ...editData,
                  phone: e.target.value,
                });
              }}
            />
            <InputLabel
              style={{ marginTop: "15px" }}
              id="demo-simple-select-standard-label"
            >
              Pick-up City
            </InputLabel>
            <select
              style={{
                width: "250px",
                height: "55px",
                marginRight: "64px",
                marginBottom: "20px",
              }}
              value={editData.city}
              onChange={(e) => {
                setEditData({
                  ...editData,
                  city: e.target.value,
                });
              }}
            >
              <option value={"Thaltej"}>Thaltej</option>
              <option value={"Shilaj"}>Shilaj</option>
              <option value={"Bopal"}>Bopal</option>
            </select>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
            >
              <div style={{
                position: "absolute",
                top: "59.5%",
                left: "56%",
                width: "38%"
              }}>
              <DatePicker
                value={dayjs(editData.date)}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                disablePast
              />
              </div>
              <TimePicker
                label="With Time Clock"
                style={{
                  width: "40%",
                  marginTop: "3%",
                }}
                value={editData.time}
                onChange={handleTimeChange}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
              />
            </LocalizationProvider>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              handleUpdate();
              setEditData({
                firstname: "",
                lastname: "",
                email: "",
                age: "",
                date: "",
                time: "",
                city: "",
              });
              setIsOpen(false);
            }}
            autoFocus
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Rental;
