import React, { useState } from "react";
import "./userStatusForm.scss";
import TextField from "@mui/material/TextField";
import fetcher from ".././fetcher";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserStatusForm = () => {
  const [requestData, setRequestData] = useState({
    name: "",
    email: "",
    description: "",
  });
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  const validateForm = () => {
    if (!requestData.name || !requestData.email || !requestData.description) {
      toast.warn("Please fill all the fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requestData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  async function save(event) {
    event.preventDefault();
    const userId = userData._id;
    if (!validateForm()) {
      return;
    }
    try {
      const response = await fetcher.post(`/api/request`, {
        userId: userId,
        name: requestData.name,
        email: requestData.email,
        description: requestData.description,
      });
      // console.log(response);
      if (response.status === 201) {
        toast.success(response?.data?.message);
        setRequestData({
          name: "",
          email: "",
          description: "",
        });
      } else {
        const errorData = await response.json();
        toast.warning(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  }

  return (
    <div>
      <ToastContainer />
      {/* <div></div> */}
      <div className="Request-bg">
        <div className="Requset-form-bg">
          <h3>Request To Rent</h3>
          <form onSubmit={save}>
            <div className="text-name">
              <TextField
                id="outlined-basic"
                label="Users Name"
                variant="outlined"
                value={requestData.name}
                onChange={(e) => {
                  setRequestData({
                    ...requestData,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div className="text-email">
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                value={requestData.email}
                onChange={(e) => {
                  setRequestData({
                    ...requestData,
                    email: e.target.value,
                  });
                }}
              />
            </div>
            <div className="text-description">
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={4}
                value={requestData.description}
                onChange={(e) => {
                  setRequestData({
                    ...requestData,
                    description: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <button className="text-btn" type="submit">
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserStatusForm;
