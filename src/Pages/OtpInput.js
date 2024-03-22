import React, { useState } from "react";
import fetcher from "../fetcher";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./otp.scss";

const OtpInput = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  // Handle change for each digit of OTP
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (value.length === 1 && /^\d+$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3 && value.length === 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  // Backspace in otp
  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // Combin Otp Digits
  const combinedOtp = parseInt(otp.join(""), 10);

  //verify Otp API
  async function checkOtp(event) {
    debugger;
    if (event) {
      event.preventDefault();
    } else {
      return false;
    }

    try {
      let response = await fetcher.post(`/api/otp/verify`, {
        otp: combinedOtp,
      });
      if (response.status === 201) {
        toast("Otp is Valid");
        navigate("/reset-password");
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="otp-section">
      <div className="otp-form-Container">
        <h1 className="otp-header">𝐎𝐓𝐏 𝐕𝐞𝐫𝐢𝐟𝐢𝐂𝐚𝐭𝐢𝐨𝐧</h1>
        <form onSubmit={checkOtp}>
          <ToastContainer />
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              style={{
                width: "30px",
                height: "30px",
                margin: "5px",
                color: "#fff",
                textAlign: "center",
                fontWeight: "900",
                backgroundColor: "transparent",
                border: "1px solid rgb(255, 255, 255)",
              }}
            />
          ))}
          <div>
            <button type="submit" className="otp-btn">Submit otp</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpInput;
