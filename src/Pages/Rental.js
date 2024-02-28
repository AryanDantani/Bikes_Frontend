import "./bookingPage.scss";
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
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  InputLabel,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Table,
  Paper,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Rental = () => {
  // const navigate = useNavigate();
  const [rentalData, setRentalData] = useState([]);
  const [data, setData] = useState({
    rentalId: "",
    userId: "",
  });
  const [editData, setEditData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    date: "",
    startTime: "",
    endTime: "",
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

  const handleChangeStartTime = (time) => {
    const dateObject = time instanceof Date ? time : new Date(time);
    const formattedTime = dateObject.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setEditData({
      ...editData,
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

    setEditData({
      ...editData,
      endTime: formattedTime,
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
    let data = await fetch(`http://localhost:4000/api/rental/user/${UserData}`);
    data = await data.json();
    console.log(data);
    setRentalData(data);
  };

  const GetBookingForAdmin = async () => {
    let data = await fetch(`http://localhost:4000/api/rental`);
    data = await data.json();
    console.log(data.map((i) => i.bike));
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
          startTime: editData.startTime,
          endTime: editData.endTime,
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

  const DeleteBookings = async (userId, rentalId, bikeId) => {
    const user = userId
    const rental = rentalId
    const bike = bikeId

    console.log(`user${userId} and rental${rentalId}`)
    try {
      const response = await fetch(
        `http://localhost:4000/api/rental/booking/${rental}/${user}/${bike}`,
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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">No.</StyledTableCell>
                <StyledTableCell align="center">Name</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Age</StyledTableCell>
                <StyledTableCell align="center">Phone</StyledTableCell>
                <StyledTableCell align="center">time</StyledTableCell>
                <StyledTableCell align="center">Model</StyledTableCell>
                <StyledTableCell align="center">Rent</StyledTableCell>
                <StyledTableCell align="center">Mileage</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rentalData.length > 0 &&
                rentalData.map((row, index) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                      ({index + 1})
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row?.firstname + row?.lastname}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row?.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row?.age}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row?.phone}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row?.startTime + " To " + row?.endTime}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row?.bike?.name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row?.bike?.rent}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row?.bike?.mileage}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setBookingId(row?._id);
                          setEditData({
                            firstname: row.firstname,
                            lastname: row.lastname,
                            email: row.email,
                            phone: row.phone,
                            age: row.age,
                            date: row.date,
                            startTime: row.startTime,
                            endTime: row.endTime,
                            city: row.city,
                          });
                        }}
                      >
                        Edit Booking
                      </button>
                      <button
                        onClick={() => {
                          // handlebooking(row?.bike?._id);
                          if(User.role === 'admin') {
                            DeleteBookings(row?.user?._id, row?._id, row?.bike?._id);
                          }else {
                            DeleteBookings(row?.user, row?._id);
                          }
                        }}
                      >
                        Cancel Booking
                      </button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
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
                width: "250px",
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
                width: "250px",
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div
                style={{
                  position: "absolute",
                  top: "59.5%",
                  left: "56%",
                  width: "38%",
                }}
              >
                <DatePicker
                  value={dayjs(editData.date)}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  disablePast
                />
              </div>

              <TimePicker
                label="Start Time"
                style={{
                  width: "40%",
                  marginTop: "3%",
                }}
                value={editData.startTime}
                onChange={handleChangeStartTime}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
              />

              <div
                style={{
                  width: "40%",
                  position: "absolute",
                  bottom: "14.5%",
                  left: "55%",
                }}
              >
                <TimePicker
                  label="End Time"
                  value={editData.endTime}
                  onChange={handleChangeEndTime}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                />
              </div>
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
