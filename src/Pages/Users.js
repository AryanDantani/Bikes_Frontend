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
import fetcher from "../fetcher";
import Avatar from "@mui/material/Avatar";
import "./user.scss";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: 800,
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
    let data = await fetcher.get(`/api/users`);
    setUsersData(data?.data?.user);
  };

  return (
    <div className="bookings-main">
      <div>
        <h1>Available Users</h1>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="ceter">No.</StyledTableCell>
                <StyledTableCell align="ceter">Name</StyledTableCell>
                <StyledTableCell align="ceter">Email</StyledTableCell>
                <StyledTableCell align="ceter">Role</StyledTableCell>
                <StyledTableCell align="ceter">Bookings</StyledTableCell>
                <StyledTableCell align="ceter">Contact No.</StyledTableCell>
                <StyledTableCell align="ceter">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData.map((row, index) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row" align="ceter">
                    {index + 1}.
                  </StyledTableCell>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    align="ceter"
                    onClick={() => {
                      console.log(row);
                    }}
                  >
                    <div className="User-image">
                      <div>
                        <Avatar alt="Remy Sharp" src={row.image} />
                      </div>
                      <div style={{ marginLeft: "10px" }}>{row.name}</div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="ceter">{row.email}</StyledTableCell>
                  <StyledTableCell align="ceter">{row.role}</StyledTableCell>
                  <StyledTableCell align="ceter">
                    {row.bookings}
                  </StyledTableCell>
                  <StyledTableCell align="ceter">{row.phone}</StyledTableCell>
                  <StyledTableCell align="ceter">
                    <button
                      className="users-btn"
                      onClick={() => {
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
