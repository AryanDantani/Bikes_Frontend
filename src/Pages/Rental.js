/* eslint-disable react-hooks/exhaustive-deps */
import "./bookingPage.scss";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams, useNavigate } from "react-router-dom";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import "./rentalFrom.scss";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import fetcher from "../fetcher";
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
import RewordDialog from "../Componants/RewordDialog";

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
  const params = useParams();
  const navigate = useNavigate();
  const [rentalData, setRentalData] = useState([]);
  const [verifyID, setVerifyId] = useState("");
  const [isVerify, setVerify] = React.useState(false);
  const [verifyUID, setVerifyUID] = useState({
    UID: "",
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
  const [isReward, setIsReward] = React.useState(false);
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
    let data = await fetcher.get(`/api/rental/user/bookings/${params?.id}`);
    // console.log(data, "UserData");
    setRentalData(data.data);
  };

  const GetBookingByUser = async () => {
    let data = await fetcher.get(`/api/rental/user/${UserData}`);
    setRentalData(data.data.rentalData);
    // console.log(data)
  };

  async function SendUid(event) {
    if (event) {
      event.preventDefault();
    } else {
      return false;
    }
    const UID = verifyUID.UID;
    try {
      let response = await fetcher.post(
        `/api/rental/genUID/${verifyID}/${UID}`
      );
      // console.log(response);
      if (response.status === 201) {
        toast.success("UID verified Successfully");
        setVerify(false);
        setIsReward(true);
      }
    } catch (err) {
      toast.error(err);
    }
  }

  async function handleUpdate() {
    try {
      let response = await fetcher.put(`/api/rental/${bookingId}`, {
        firstname: editData.firstname,
        lastname: editData.lastname,
        email: editData.email,
        age: editData.age,
        date: editData.date,
        startTime: editData.startTime,
        endTime: editData.endTime,
        city: editData.city,
      });
      if (response.status === 201) {
        toast.success("Booking Updated Successfully");
        if (User.role === "admin") {
          GetBookingForUser();
        } else {
          GetBookingByUser();
        }
        setIsOpen(false);
      }
    } catch (err) {
      toast.error(err);
    }
  }

  const DeleteBookings = async (rentalId, bikeId) => {
    const rental = rentalId;
    const bike = bikeId;
    try {
      const response = await fetch(
        `http://localhost:4000/api/rental/booking/${rental}/${UserData}/${bike}`,
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
          GetBookingByUser();
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
    if (User.role === "user" || User.role === "owner") {
      GetBookingByUser();
    } else {
      GetBookingForUser();
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {User.role === "user" || User.role === "owner" ? (
              ""
            ) : (
              <div>
                <button
                  style={{
                    background: "#fff",
                    width: "100px",
                    height: "30px",
                    border: "none",
                    color: "#74c0fc",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/users");
                  }}
                >
                  <i
                    className="fa-solid fa-arrow-left"
                    style={{ color: "#74c0fc", marginRight: "15px" }}
                  />
                  Back
                </button>
              </div>
            )}

          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">No.</StyledTableCell>
                  <StyledTableCell align="center">Model</StyledTableCell>
                  <StyledTableCell align="center">time</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Rent</StyledTableCell>
                  <StyledTableCell align="center">Mileage</StyledTableCell>
                  <StyledTableCell align="center">status</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rentalData &&
                  rentalData.length > 0 &&
                  rentalData.map((row, index) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {index + 1}.
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.bike?.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.startTime + " To " + row?.endTime}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.bike?.rent}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.bike?.mileage}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "#4aa146",
                          fontWeight: "600",
                        }}
                      >
                        {row?.status === "Booked" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "33%",
                            }}
                          >
                            <div className="svg-bg-bk" />
                            <div style={{ marginLeft: "15px" }}>
                              {row?.status}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}

                        {row?.status === "Completed" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "33%",
                            }}
                          >
                            <div className="svg-bg" />
                            <div style={{ marginLeft: "15px" }}>
                              {row?.status}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}

                        {row?.status === "Cancel Booking" ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "33%",
                            }}
                          >
                            <div className="svg-bg-cl" />
                            <div style={{ marginLeft: "15px", color: "red" }}>
                              {row?.status}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Tooltip title="Edit">
                          <button
                            style={{ border: "none", cursor: "pointer" }}
                            onClick={() => {
                              if (row.status === "Booked") {
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
                              } else if (row.status === "Cancel Booking") {
                                toast.warning(
                                  "This booking is already Cancel Booking"
                                );
                              } else {
                                toast.warning("This booking is already Cancel");
                              }
                            }}
                          >
                            <i
                              class="fa-regular fa-pen-to-square"
                              style={{
                                fontSize: "20px",
                                color: "brown",
                              }}
                            />
                          </button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <button
                            style={{
                              border: "none",
                              cursor: "pointer",
                              marginLeft: "20px",
                            }}
                            onClick={() => {
                              if (row.status === "Booked") {
                                DeleteBookings(row?._id, row?.bike?._id);
                              } else if (row.status === "") {
                                toast.warning(
                                  "This booking is already Completed"
                                );
                              } else {
                                toast.warning("This booking is already Cancel");
                              }
                            }}
                          >
                            <i
                              class="fa-solid fa-user-xmark"
                              style={{
                                fontSize: "20px",
                                color: "red",
                              }}
                            />
                          </button>
                        </Tooltip>
                        {User.role === "user" ? (
                          <Tooltip title="Verify UID">
                            <button
                              style={{
                                border: "none",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }}
                              onClick={() => {
                                if (row.status === "Booked") {
                                  setVerifyId(row?._id);
                                  setVerify(true);
                                } else if (row.status === "Completed") {
                                  toast.warning(
                                    "This booking is already Completed"
                                  );
                                } else {
                                  toast.warning(
                                    "This booking is already Cancel"
                                  );
                                }
                              }}
                            >
                              <i
                                class="fa-solid fa-users-viewfinder"
                                style={{
                                  fontSize: "20px",
                                  color: "red",
                                }}
                              />
                            </button>
                          </Tooltip>
                        ) : (
                          ""
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div>
        <RewordDialog
          setIsReward={setIsReward}
          isReward={isReward}
          GetBookingByUser={GetBookingByUser}
        />
      </div>
      <div className="account-verify">
        <Dialog
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">
            {"Edit Your bookings"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <TextField
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
      <div>
        <Dialog
          open={isVerify}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            UID Verification
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            ></IconButton>
          </DialogTitle>
          <form onSubmit={SendUid}>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <div>
                  <TextField
                    id="filled-basic"
                    label="UID"
                    variant="filled"
                    value={verifyUID.UID}
                    onChange={(e) => {
                      setVerifyUID({
                        ...verifyUID,
                        UID: e.target.value,
                      });
                    }}
                  />
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                onClick={() => {
                  setVerify(false);
                  SendUid();
                }}
              >
                Verify
              </Button>
              <Button
                onClick={() => {
                  setVerify(false);
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default Rental;
