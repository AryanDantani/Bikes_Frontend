import React, { useEffect, useState } from "react";
import "./profile.scss";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
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

const Profile = () => {
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  const [usersData, setUsersData] = useState([]);
  const [rentalData, setRentalData] = useState([]);

  useEffect(() => {
    GetUserByID();
    GetBookingForUser();
  }, []);

  const GetUserByID = async () => {
    const userId = userData._id;
    let data = await fetch(`http://localhost:4000/api/users/${userId}`);
    data = await data.json();
    setUsersData(data);
  };

  const GetBookingForUser = async () => {
    const userId = userData._id;
    let data = await fetch(`http://localhost:4000/api/rental/user/${userId}`);
    data = await data.json();
    console.log(data);
    setRentalData(data);
  };

  console.log(usersData.email, "asdasdasdas");

  return (
    <div>
      {/* <div className="bg-3"> */}
        <div className="Profile">
          <div className="logo">
            <i
              class="fa-solid fa-user"
              style={{
                fontSize: "119px",
              }}
            />
          </div>
          <div className="userData">
            <div>
              <div style={{ marginTop: "12px" }}>
                User Name: {usersData.name}
              </div>
              <div>Email: {usersData.email}</div>
              <div>Role: {usersData.role}</div>
              <div>Contact No: {userData.phone}</div>
            </div>
          </div>
        </div>
        <div className="bookings-rewards">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="coins" />
            <div style={{ marginRight: "10px" }}>:</div>
            <div>{usersData.coins}</div>
          </div>
          <div>Bookings: {usersData.bookings}</div>
        </div>
        <div
          style={{
            width: "40%",
            position: "relative",
            top: "20%",
            left: "1%",
          }}
        >
          <h1 style={{color:"#fff"}}>Today's Booking</h1>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">No.</StyledTableCell>
                  <StyledTableCell align="center">Model</StyledTableCell>
                  <StyledTableCell align="center">time</StyledTableCell>
                  <StyledTableCell align="center">Rent</StyledTableCell>
                  <StyledTableCell align="center">Km-Used</StyledTableCell>
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
                      <StyledTableCell align="center">
                        {row?.bike?.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.startTime + " To " + row?.endTime}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.bike?.rent}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.bike?.km}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row?.bike?.mileage}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <button onClick={() => {}}>open</button>
                        {/* <button
                          onClick={() => {
                          }}
                        >
                          Cancel Booking
                        </button> */}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      {/* </div> */}
    </div>
  );
};

export default Profile;
