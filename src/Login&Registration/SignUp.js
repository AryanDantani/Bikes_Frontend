/* eslint-disable no-sequences */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./sign.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";

function SignUp() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const [isLoad, setIsLoad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function save(event) {
    event.preventDefault();

    if (
      (!registerData.name,
      !registerData.email,
      !registerData.phone,
      !registerData.password,
      !registerData.role)
    ) {
      toast.warn("Please fill the form");
      return false;
    }
    setIsLoad(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/signup",
        {
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password,
          role: registerData.role,
        }
      );

      if (response.status === 201) {
        if (!response.data.status) {
          return toast.warn(response.data.message);
        }
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/login");
          setIsLoad(false);
        }, [5000]);
      } else {
        const errorData = await response.json();
        toast.warning(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        "An error occurred. Please check the console for more details."
      );
    }
  }

  return (
    <div className="main-signup">
      <ToastContainer />
      {isLoad ? (
        <div className="sign-loader-bg">
          <CircularProgress />
        </div>
      ) : (
        ""
      )}

      <div className="sig-bg">
        <p>
          "Four wheels move the body; two wheels move the soul. Life is short,
          buy the motorcycle, have a ride, live your dreams. You don't stop
          riding when you get old; you get old when you stop riding."
        </p>
        <br />
        <hr style={{ color: "#fff" }} />
      </div>
      <div className="sig-form">
        <div className="form-side">
          <div className="form-header">
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "#000",
                position: "absolute",
                borderTopRightRadius: "40px",
                borderBottomRightRadius: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                left: "92%",
              }}
            >
              <i
                className="fa-solid fa-bookmark"
                style={{
                  fontSize: "30px",
                  color: "#fff",
                }}
              />
            </div>
            <h2>Register Now</h2>
          </div>
          <div className="form-reg">
            <form className="main-form" autoComplete="off">
              <div className="reg-group">
                <div className="reg-label">
                  <label>Name</label>
                </div>
                <div>
                  <input
                    type="text"
                    className="form-control"
                    autoComplete="off"
                    id="fname"
                    placeholder="Enter Fname"
                    value={registerData.name}
                    onChange={(event) => {
                      setRegisterData({
                        ...registerData,
                        name: event.target.value,
                      });
                    }}
                  />
                </div>
              </div>

              <div className="reg-group">
                <div className="reg-label">
                  <label>Email</label>
                </div>
                <div>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter Email"
                    autoComplete="off"
                    value={registerData.email}
                    onChange={(event) => {
                      setRegisterData({
                        ...registerData,
                        email: event.target.value,
                      });
                    }}
                  />
                </div>
              </div>

              <div className="reg-group">
                <div className="reg-label">
                  <label>Mobile no</label>
                </div>
                <div>
                  <input
                    className="form-control"
                    id="number"
                    placeholder="Enter vallid mobile number"
                    autoComplete="off"
                    value={registerData.phone}
                    onChange={(event) => {
                      setRegisterData({
                        ...registerData,
                        phone: event.target.value,
                      });
                    }}
                  />
                </div>
              </div>

              <div className="reg-group">
                <div className="reg-label">
                  <label>Password</label>
                </div>
                <div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    autoComplete="off"
                    value={registerData.password}
                    onChange={(event) => {
                      setRegisterData({
                        ...registerData,
                        password: event.target.value,
                      });
                    }}
                  />
                  <button
                    type="button"
                    className="Show-passwor-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i class="fa-solid fa-eye-slash"></i>
                    ) : (
                      <i class="fa-solid fa-eye"></i>
                    )}{" "}
                  </button>
                </div>
              </div>

              <div className="reg-group">
                <div className="reg-label-select">
                  <label>User Type</label>
                </div>
                <div>
                  <select
                    className="form-control-select"
                    placeholder="Select User type"
                    autoComplete="off"
                    value={registerData.role}
                    onChange={(event) => {
                      setRegisterData({
                        ...registerData,
                        role: event.target.value,
                      });
                    }}
                  >
                    <option className="options" style={{ background: "#000" }}>
                      Select User Type
                    </option>
                    <option
                      className="options"
                      style={{ background: "#000" }}
                      value={"user"}
                    >
                      User
                    </option>
                    <option
                      className="options"
                      style={{ background: "#000" }}
                      value={"owner"}
                    >
                      Owner
                    </option>
                  </select>
                </div>
              </div>

              <div className="reg-btn">
                <button type="submit" onClick={save}>
                  Register
                </button>
              </div>
              <p
                style={{
                  color: "#fff",
                  marginLeft: "60px",
                  marginBottom: "10px",
                }}
              >
                Or
              </p>
              <div className="reg-btn">
                <button
                  type="submit"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  logIn
                </button>
              </div>

              <div className="end-para">
                <p>
                  “Wishing you the finest rides and the most peaceful moments
                  with your new bike.”
                </p>
              </div>
              {/* <hr/> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
