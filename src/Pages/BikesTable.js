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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import "react-toastify/dist/ReactToastify.css";
import fetcher from "../fetcher";

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

export default function BikesTable() {
  const [ownbikes, setOwnBikes] = React.useState([]);
  const [isActive, setIsActive] = React.useState(false);

  console.log(isActive);

  const handleToggle = (Id, bikeId) => {
    setIsActive((prevIsActive) => !prevIsActive);
    UpdateStatus(Id, bikeId);
  };
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : "";

  React.useEffect(() => {
    GetBikesDataById();
  }, []);

  const GetBikesDataById = async () => {
    let response = await fetcher.get(`/api/add-rental/user/${userData}`);
    setOwnBikes(response.data);
  };

  const DeleteRentedBike = async (Id, bikeId) => {
    console.log(Id, bikeId);
    try {
      let response = await fetcher.get(`/api/add-rental/${Id}/${bikeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Delete Response:", data);
        toast.success(data.message);
        GetBikesDataById();
      } else {
        toast.warning("Failed To Delete Account");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete account. Please try again.");
    }
  };

  const UpdateStatus = async (Id, bikeId) => {
    try {
      let response = await fetcher.get(`/api/add-rental/${Id}/${bikeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: isActive }),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        GetBikesDataById();
      } else {
        toast.warning("Failed To Update Bike Status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to Update status. Please try again.");
    }
  };

  return (
    <TableContainer component={Paper}>
      <ToastContainer />
      <Table sx={{ minWidth: 800 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Module</StyledTableCell>
            <StyledTableCell align="center">Type</StyledTableCell>
            <StyledTableCell align="center">Rent</StyledTableCell>
            <StyledTableCell align="center">Mileage</StyledTableCell>
            <StyledTableCell align="center">Engine</StyledTableCell>
            <StyledTableCell align="center">Available</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ownbikes.length > 0 &&
            ownbikes.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row" align="center">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="center">{row.type}</StyledTableCell>
                <StyledTableCell align="center">{row.rent}</StyledTableCell>
                <StyledTableCell align="center">{row.mileage}</StyledTableCell>
                <StyledTableCell align="center">{row.engine}</StyledTableCell>
                <StyledTableCell align="center">{row.date}</StyledTableCell>
                <StyledTableCell align="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
                        onChange={() => {
                          handleToggle(row._id, row.bikeId);
                        }}
                      />
                    }
                    label={isActive ? "Active" : "Deactive"}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <button
                    onClick={() => {
                      DeleteRentedBike(row._id, row.bikeId);
                    }}
                  >
                    R
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
