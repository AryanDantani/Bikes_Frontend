import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetcher from "../fetcher";
import "./allRequest.scss";
import Avatar from "@mui/material/Avatar";

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function AllRequests() {
  const [requestdata, setRequestData] = React.useState([]);
  const [isActive, setIsActive] = React.useState(false);

  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  React.useEffect(() => {
    GetRequest();
  }, []);

  const GetRequest = async () => {
    let response = await fetcher.get(`/api/request`);
    setRequestData(response?.data?.RequestData);
  };

  // Remove Rented Bike API
  const UpdateUserStatus = async (Id) => {
    try {
      let response = await fetch(`http://localhost:4000/api/request/${Id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.status); // Log the response status for debugging

      if (response.status === 200) {
        const data = await response.json();
        GetRequest();
        toast.success(data.message);
        // GetBikesDataById();
      } else {
        toast.warning("Failed To Update Status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to Update Status. Please try again.");
    }
  };

  return (
    <>
      <h3 className="request-header">User Request</h3>
      <div className="request-main-status">
        <TableContainer component={Paper}>
          <ToastContainer />
          <Table sx={{ minWidth: 800 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">UserID</StyledTableCell>
                <StyledTableCell align="center">Name</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requestdata &&
                requestdata.length > 0 &&
                requestdata.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {row.userId}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="center">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.status === "Approved" ? (
                        <div className="reuest-status">
                          <div className="verfied-svg"></div>
                          <div className="status">Approved</div>
                        </div>
                      ) : (
                        <div className="reuest-status">
                          <div className="panding-svg"></div>
                          <div className="pan-status">Panding...</div>
                        </div>
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <button
                        className="request-btn"
                        onClick={() => {
                          if (row.status === "Approved") {
                            return toast.warn("Request Is Already Approved");
                          } else {
                            UpdateUserStatus(row._id);
                          }
                        }}
                      >
                        Approve
                      </button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
