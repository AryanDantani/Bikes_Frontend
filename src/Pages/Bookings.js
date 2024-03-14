/* eslint-disable react-hooks/exhaustive-deps */
import "./bookingPage.scss";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState([]);
  const [bikesData, setBikesData] = useState([]);
  const UserData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : "";
  const User = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  const GetBookingForUser = async () => {
    let data = await fetch(`http://localhost:3001/bookings/${UserData}`);
    data = await data.json();
    const newData = data?.data?.map((i) => i.bikeId);
    setBookingData(data?.data);
    setBikesData(newData);
  };

  const GetBookingForAdmin = async () => {
    let data = await fetch(`http://localhost:3001/booking`);
    data = await data.json();
    const newData = data?.data?.map((i) => i.bikeId);
    setBookingData(data?.data);
    setBikesData(newData);
  };

  const DeleteBookings = async (bookingId) => {
    console.log(bookingId, "bookingId");
    try {
      const response = await fetch(
        `http://localhost:3001/booking/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log("Booking deleted successfully");
        GetBookingForAdmin();
      } else {
        console.log("Failed to delete booking");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (User.role === "user") {
      GetBookingForUser();
    } else {
      GetBookingForAdmin();
    }
  }, []);

  return (
    <div>
      <div>
        {User.role === "user" ? (
          <h1> Your Bookings </h1>
        ) : (
          <h1> Available Bookings </h1>
        )}
      </div>
      <div className="page-main">
        <div style={{ width: "50%" }}>
          {bookingData.map((item, index) => {
            return (
              <div key={item?._id} className="user-detiles">
                <div className="tags">({index + 1})</div>
                <div className="tags">
                  <p>Name:</p>
                  <p>{item.firstname + item.lastname}</p>
                </div>
                <div className="tags">
                  <p>Email:</p>
                  <p>{item.email}</p>
                </div>
                <div className="tags">
                  <p>Phone:</p>
                  <p>{item.phone}</p>
                </div>
                <div className="tags">
                  <p>Time:</p>
                  <p>{item.time}</p>
                </div>
                <div className="tags">
                  <p>Date:</p>
                  <p>{item.date}</p>
                </div>
                <div className="tags">
                  <p>City:</p>
                  <p>{item.city}</p>
                </div>
                <div className="tags">
                  {User.role === "user" ? (
                    <>
                      <button>Edit Booking</button>
                      <button onClick={() => {
                        DeleteBookings(item?._id);
                      }}>Cancel Booking</button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        DeleteBookings(item?._id);
                      }}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ width: "40%" }}>
          {bikesData.map((item) => {
            return (
              <div key={item?._id} className="user-detiles">
                <div className="tags">
                  <p>Model:</p>
                  <p>{item.name}</p>
                </div>
                <div className="tags">
                  <p>Purchasing Price:</p>
                  <p>{item.price}</p>
                </div>
                <div className="tags">
                  <p>Km/run:</p>
                  <p>{item.km}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
