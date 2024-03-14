import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./newPass.scss";
import fetcher from "../fetcher";

const NewPassword = () => {
  const [changePassData, setChangePassData] = useState({
    newPassword: "",
    confirPassword: "",
  });
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail")
    ? JSON.parse(localStorage.getItem("userEmail"))
    : "";

  async function changePassword(event) {
    event.preventDefault();

    // Check if newPassword and confirmPassword match
    if (changePassData.confirPassword !== changePassData.newPassword) {
      toast.warning("New Password and Confirm Password must be the same");
      return;
    }

    try {
      let response = await fetcher.put(`/api/users/${userEmail}/password`, {
        newPassword: changePassData.newPassword,
      });

      if (response.status === 200) {
        toast.success("Password Change Successfully");
        setTimeout(() => {
          navigate("/");
        }, [5000]);
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="main-pass-div">
      <ToastContainer />
      <div className="log-img" />
      <div className="bg-layer">
        <h3>Reset Password</h3>
        <hr />
        <form onSubmit={changePassword} className="pass-form">
          <div style={{ display: "flex" }}>
            <div
              style={{
                marginRight: "15%",
                fontWeight: "600",
                marginTop: "65px",
              }}
            >
              New Password
            </div>
            <div>
              <input
                className="pass-input"
                value={changePassData.newPassword}
                onChange={(e) => {
                  setChangePassData({
                    ...changePassData,
                    newPassword: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                marginRight: "10.5%",
                fontWeight: "600",
                marginTop: "67px",
              }}
            >
              Confirm Password
            </div>
            <div>
              <input
                className="pass-input"
                value={changePassData.confirPassword}
                s
                onChange={(e) => {
                  setChangePassData({
                    ...changePassData,
                    confirPassword: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <button className="pass-btn" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
