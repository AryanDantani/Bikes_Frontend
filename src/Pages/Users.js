import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
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
    margin: 10,
  },
}));

export default function User() {
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    GetAllUser();
  }, []);

  const GetAllUser = async () => {
    let data = await fetch(`http://localhost:4000/api/users`);
    data = await data.json();
    setUsersData(data);
  };

  return (
    <div>
      <div>
        <h1>Available Users</h1>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>No.</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Bookings</StyledTableCell>
                <StyledTableCell>Contact No.</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData.map((row, index) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row">
                    ({index + 1})
                  </StyledTableCell>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    onClick={() => {
                      console.log(row);
                    }}
                  >
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell>{row.email}</StyledTableCell>
                  <StyledTableCell>{row.bookings}</StyledTableCell>
                  <StyledTableCell>{row.phone}</StyledTableCell>
                  <StyledTableCell>
                    <button
                      style={{
                        height: "30px",
                        width: "40%",
                        cursor: "pointer",
                        border: "1px solid brown",
                      }}
                      onClick={() => {
                        console.log(row);
                        navigate("/user/bookings/" + row?._id);
                      }}
                    >
                      View Bookings
                    </button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
