import React from "react";
import "./navigation.scss";
import { useNavigate } from "react-router-dom";
import SideBar from "./Drawer";

const NavigationBar = () => {
  const navigate = useNavigate();
  const User = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  console.log(User);

  return (
    <div>
      <div className="nav-main">
        <div className="nav-img">
          <SideBar />
        </div>
        <div className="nav-logo">
          <div className="nav-bac">
            <span>MyBike</span>
          </div>
        </div>
        <div
          className="navigate"
          onClick={() => {
            navigate("/newride");
          }}
        >
          <a>New ride</a>
        </div>
        {User.role === "user" || User.role === "owner" ? (
          ""
        ) : (
          <div
            className="navigate"
            onClick={() => {
              navigate("/users");
            }}
          >
            <a>Users</a>
          </div>
        )}
        {User.role === "admin" ? (
          ""
        ) : (
          <div
            className="navigate"
            onClick={() => {
              navigate("/bookings");
            }}
          >
            <a>Rental Services</a>
          </div>
        )}

        <div
          className="navigate"
          onClick={() => {
            navigate("/aboutus");
          }}
        >
          <a>About Us</a>
        </div>
        <div
          className="navigate"
          onClick={() => {
            navigate("/profile");
          }}
        >
          <i
            class="fa-solid fa-user"
            style={{
              width: "23px",
              borderRadius: "30px",
              height: "19px",
              border: "1px solid #fff",
              marginRight: "10px",
            }}
          />
          {User ? User?.name : ""}
        </div>
        {User ? (
          <div>
            <i
              className="fa-solid fa-right-from-bracket"
              style={{ color: "#fff" }}
              onClick={() => {
                navigate("/");
                localStorage.removeItem("tokan");
                localStorage.removeItem("user");
              }}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
