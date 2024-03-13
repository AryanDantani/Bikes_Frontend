import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import Select from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "./addRentalFile.scss";
import Divider from "@mui/material/Divider";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function AddRentalBike({
  isOpen,
  setIsOpen,
  rentalData,
  setRentalData,
  setImageUrl,
  AddBikeForRent,
}) {
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDateChange = (date) => {
    const dateObject = date instanceof Date ? date : new Date(date);
    const formattedDate = dateObject
      ? dateObject?.toLocaleDateString("en-GB")
      : null;

    setRentalData({
      ...rentalData,
      date: formattedDate,
    });
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `http://localhost:4000/api/cloudinary/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setImageUrl(data.url);
      // console.log('Image uploaded successfully:', data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setRentalData({
      ...rentalData,
      image: file,
    });

    uploadImage(file);
  };

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          style={{
            cursor: "move",
            // backgroundColor: "#000",
            color: "#000",
            fontFamily: "emoji",
          }}
          id="draggable-dialog-title"
        >
          Add Rental Bike
        </DialogTitle>
        <Divider />
        <form>
          {/* <DialogContent> */}
          <div className="main-divs">
            <div>
              <div className="form-div">
                <div
                  style={{
                    marginRight: "15px",
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    User_Name:
                  </InputLabel>
                </div>
                <div className="UN-Field">
                  <TextField
                    value={rentalData.userName}
                    onChange={(e) => {
                      setRentalData({
                        ...rentalData,
                        userName: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-div">
                <div
                  style={{
                    marginRight: "62px",
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">Email:</InputLabel>
                </div>
                <div className="UN-Field">
                  <TextField
                    value={rentalData.email}
                    onChange={(e) => {
                      setRentalData({
                        ...rentalData,
                        email: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-div">
                <div
                  style={{
                    marginRight: "17px",
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    Contact_No:
                  </InputLabel>
                </div>
                <div className="UN-Field">
                  <TextField
                    value={rentalData.contact}
                    onChange={(e) => {
                      setRentalData({
                        ...rentalData,
                        contact: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-div">
                <div
                  style={{
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    Vehicle_Category:
                  </InputLabel>
                </div>
                <div className="SL-Field">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={rentalData.type}
                    onChange={(e) => {
                      setRentalData({
                        ...rentalData,
                        type: e.target.value,
                      });
                    }}
                  >
                    <MenuItem value={"Road Bikes"}>Road Bikes</MenuItem>
                    <MenuItem value={"Sports Bikes"}>Sports Bikes</MenuItem>
                    <MenuItem value={"Cruser Bikes"}>Cruser Bikes</MenuItem>
                    <MenuItem value={"Mountain Bikes"}>Mountain Bikes</MenuItem>
                    <MenuItem value={"Scooters and Activa"}>
                      Scooters and Activa
                    </MenuItem>
                    <MenuItem value={"Electric Bikes"}>Electric Bikes</MenuItem>
                  </Select>
                </div>
              </div>
              <div className="form-div">
                <div
                  style={{
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    Vehicle_Name:
                  </InputLabel>
                </div>
                <div className="UN-Field">
                  <TextField
                    value={rentalData?.name}
                    onChange={(e) => {
                      setRentalData({
                        ...rentalData,
                        name: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-div">
                <div
                  style={{
                    marginLeft: "30px",
                  }}
                  className="VM-Field"
                >
                  <InputLabel id="demo-simple-select-label">
                    Vehicle_Mileage:
                  </InputLabel>
                </div>
                <div
                  className="UN-Field"
                  style={{
                    marginLeft: "-12px",
                  }}
                >
                  <TextField
                    value={rentalData?.mileage}
                    onChange={(e) => {
                      setRentalData({
                        ...rentalData,
                        mileage: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-div">
                <div
                  style={{
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    KM_Vehicle_run:
                  </InputLabel>
                </div>
                <div
                  className="UN-Field"
                  style={{
                    marginLeft: "-10px",
                  }}
                >
                  <TextField
                    value={rentalData?.km}
                    onChange={(e) => {
                      setRentalData({
                        ...rentalData,
                        km: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-div">
                <div
                  style={{
                    marginRight: "54px",
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">Engine:</InputLabel>
                </div>
                <div className="UN-Field">
                  <TextField
                    value={rentalData?.engine}
                    onChange={(e) => {
                      setRentalData({
                        ...rentalData,
                        engine: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-div">
                <div
                  style={{
                    marginRight: "39px",
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    Available:
                  </InputLabel>
                </div>
                <div className="UN-Field-Select">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(rentalData?.date)}
                      onChange={handleDateChange}
                      format="DD/MM/YYYY"
                      disablePast
                    />
                  </LocalizationProvider>
                  {/* <TextField value={rentalData?.available}/> */}
                </div>
              </div>
              <div className="form-div">
                <div
                  style={{
                    marginRight: "24px",
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    OwnerShip:
                  </InputLabel>
                </div>
                <div className="Sl-OW">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={rentalData?.owner}
                    onChange={(e) => {
                      setRentalData({
                        ...rentalData,
                        owner: e.target.value,
                      });
                    }}
                  >
                    <MenuItem value={"first"}>First Owner</MenuItem>
                    <MenuItem value={"Second"}>Second Owner</MenuItem>
                  </Select>
                </div>
              </div>
              <div className="form-div">
                <div
                  style={{
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    Rent Per Hour:
                  </InputLabel>
                </div>
                <div className="UN-Field">
                  <TextField
                    value={rentalData?.rent}
                    onChange={(e) => {
                      setRentalData({
                        ...rentalData,
                        rent: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="form-div">
                <div
                  style={{
                    marginLeft: "30px",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    upload_Image:
                  </InputLabel>
                </div>
                <div className="UN-Field">
                  <TextField type="file" onChange={handleFileChange} />
                </div>
              </div>
            </div>

            <div className="side-Image">
              <h3>𝑻𝒖𝒓𝒏 𝒚𝒐𝒖𝒓 𝒑𝒂𝒔𝒔𝒊𝒐𝒏 𝒊𝒏𝒕𝒐 𝒑𝒓𝒐𝒇𝒊𝒕 - 𝒍𝒊𝒔𝒕 𝒚𝒐𝒖𝒓 𝒎𝒐𝒕𝒐𝒓𝒄𝒚𝒄𝒍𝒆 𝒇𝒐𝒓 𝒓𝒆𝒏𝒕 𝒂𝒏𝒅 𝒎𝒂𝒌𝒆 𝒎𝒐𝒏𝒆𝒚 𝒅𝒐𝒊𝒏𝒈 𝒘𝒉𝒂𝒕 𝒚𝒐𝒖 𝒍𝒐𝒗𝒆</h3>
            </div>
          </div>
          {/* </DialogContent> */}
          <Divider />
          <DialogActions>
            <Button
              autoFocus
              onClick={handleClose}
              style={{
                height: "30px",
                background: "whitesmoke",
                fontFamily: "emoji",
                color: "#000",
              }}
            >
              Cancel
            </Button>
            <Button style={{
                height: "30px",
                background: "whitesmoke",
                fontFamily: "emoji",
                color: "#000",
              }} onClick={AddBikeForRent}>Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}
