import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import { UseChannelIdContext } from "../Context/Context";

function Login() {
  const navigate = useNavigate();
  const { setIsVisible } = UseChannelIdContext();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState({ email: "" });
  const [isforgot, setIsFogot] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  axios.defaults.withCredentials = true;
  async function login(event) {
    event.preventDefault();

    if ((!loginData.email, !loginData.password)) {
      return toast.warn("Please fill all the Field");
    }
    setIsLoad(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        {
          email: loginData.email,
          password: loginData.password,
        }
      );

      if (response.data.statusCode === 200) {
        localStorage.setItem("user", JSON.stringify(response?.data?.data));
        localStorage.setItem("tokan", response.data.token);
        toast.success("Login in Successfully");
        setTimeout(() => {
          setIsLoad(false);
          setIsVisible(false);
          navigate("/");
        }, [5000]);
      } else {
        toast.error(response.data.message);
        setIsLoad(false);
      }
    } catch (err) {
      setIsLoad(false);
      toast.error(err);
    }
  }

  async function fogetPassword(event) {
    if (event) {
      event.preventDefault();
    } else {
      return false;
    }

    localStorage.setItem("userEmail", JSON.stringify(forgotEmail.email));

    if (!forgotEmail.email) {
      return toast.warn("Please Fill All The Field");
    }

    setIsLoad(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/send/forgot-password",
        {
          email: forgotEmail.email,
        }
      );

      if (response.status === 201) {
        toast("sent forgot password request successfully");
        setForgotEmail({
          email: "",
        });
        setIsFogot(false);
        navigate("/checkotp");
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="main-div">
      <ToastContainer />
      {isLoad ? (
        <div className="loader-bg">
          <CircularProgress className="loader" />
        </div>
      ) : (
        ""
      )}

      <div className="log-img">
        <p>
          We have no limitations when it comes to two wheelers and enjoy serving
          everything from a scooter to a superbike available on both website and
          mobile application. We are obsessed with the concept of ‘Why buy when
          you can rent’.
        </p>
      </div>
      <div className="log-form">
        <div className="logo-container">
          <span
            style={{
              color: "darkgoldenrod",
              fontSize: "80px",
            }}
          >
            𝑀
          </span>
          <span
            style={{
              marginLeft: "-26px",
              fontSize: "60px",
            }}
          >
            𝒴
          </span>
          <span>𝐵𝐼𝒦𝐸</span>
          <hr
            style={{
              marginLeft: "-11px",
              width: "115%",
              marginTop: "-30px",
            }}
          />
        </div>
        <div className="container">
          <div>
            <div className="ad-sec">
              Welcome New User
              <br /> Are You Ready To Explore
            </div>
            <div
              style={{
                border: "1px solid rgb(255, 255, 255)",
                borderTopRightRadius: "116px",
                borderBottomLeftRadius: "116px",
                marginTop: "75px",
                padding: "55px",
              }}
            >
              <div className="header">
                <h3 style={{ marginleft: "20px" }}>Login</h3>
              </div>
              <br />
              <div className="row">
                <div className="col-sm-6">
                  {!isforgot ? (
                    <>
                      <form onSubmit={login} className="form">
                        <div className="form-group">
                          <div className="form-label">
                            <label>Email</label>
                          </div>
                          <div>
                            <input
                              id="email"
                              placeholder="Enter Email"
                              className="form-input"
                              value={loginData.email}
                              onChange={(event) => {
                                setLoginData({
                                  ...loginData,
                                  email: event.target.value,
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="form-label">
                            <label>Password</label>
                          </div>
                          <div>
                            <input
                              id="password"
                              placeholder="Enter Password"
                              className="form-input"
                              value={loginData.password}
                              onChange={(event) => {
                                setLoginData({
                                  ...loginData,
                                  password: event.target.value,
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-btn">
                          <button type="submit">Login</button>
                          <button
                            onClick={() => {
                              navigate("/signup");
                            }}
                          >
                            Sign~up
                          </button>
                          <button
                            onClick={() => {
                              setIsFogot(true);
                            }}
                          >
                            Forggot password
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <>
                      <form onSubmit={fogetPassword} className="form">
                        <div className="form-group">
                          <div className="form-label">
                            <label>Email</label>
                          </div>
                          <div>
                            <input
                              id="email"
                              placeholder="Enter Email"
                              className="form-input"
                              value={forgotEmail.email}
                              onChange={(event) => {
                                setForgotEmail({
                                  ...forgotEmail,
                                  email: event.target.value,
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-btn">
                          <button
                            type="submit"
                            onClick={() => {
                              fogetPassword();
                            }}
                          >
                            Send Request
                          </button>
                          <button
                            onClick={() => {
                              setIsFogot(false);
                            }}
                          >
                            cancel
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
