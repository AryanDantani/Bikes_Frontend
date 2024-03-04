/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import "./profile.scss";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TableRow, TableCell } from "@mui/material";
import "./cardCarousel.scss";
import dayjs from "dayjs";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Profile = () => {
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  const [usersData, setUsersData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rewardCards, setRewardCards] = useState([]);
  const [noReward, setNoReward] = useState(false);

  const GetUserRewardByID = async () => {
    const userId = userData._id;
    let data = await fetch(`http://localhost:4000/api/rewards/${userId}`);
    data = await data.json();
    if (data.length > 0) {
      setNoReward(false);
    } else {
      setNoReward(true);
    }
    console.log(data.length > 0 ? true : false);
    setRewardCards(data);
  };

  const ClaimReward = async (rewardId) => {
    const user = userData._id;
    const reward = rewardId;
    try {
      const response = await fetch(
        `http://localhost:4000/api/rewards/${reward}/${user}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Delete Response:", response);
      if (response.status === 200) {
        toast.success("ClaimReward successfully");
        GetUserRewardByID();
        GetUserByID();
      } else {
        toast.warning("Failed to delete Reward Cards");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error);
    }
  };

  const GetUserByID = async () => {
    const userId = userData._id;
    let data = await fetch(`http://localhost:4000/api/users/${userId}`);
    data = await data.json();
    setUsersData(data);
  };

  useEffect(() => {
    GetUserRewardByID();
    GetUserByID();
  }, []);

  return (
    <div>
      {/* <div className="bg-3"> */}
      <ToastContainer />
      <div className="Profile">
        <div className="logo">
          <i
            class="fa-solid fa-user"
            style={{
              fontSize: "119px",
            }}
          />
        </div>
        <div className="userData">
          <div>
            <div style={{ marginTop: "12px" }}>User Name: {usersData.name}</div>
            <div>Email: {usersData.email}</div>
            <div>Role: {usersData.role}</div>
            <div>Contact No: {userData.phone}</div>
          </div>
        </div>
      </div>
      <div className="bookings-rewards">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="coins" />
          <div style={{ marginRight: "10px" }}>:</div>
          <div>{usersData.coins}</div>
        </div>
        <div>Bookings: {usersData.bookings}</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="voucher" />
          <div style={{ marginRight: "10px" }}>:</div>
          <div>{rewardCards.length}</div>
        </div>
      </div>
      <div>
        <div className="carousel">
          <ToastContainer />
          {rewardCards.length > 3 ? (
            <button
              className="arrow prev"
              onClick={() => {
                setCurrentSlide((prev) =>
                  prev === rewardCards.length - 3 ? 0 : prev + 1
                );
              }}
            >
              {"<"}
            </button>
          ) : (
            ""
          )}

          <div className="slider-container">
            {rewardCards.length > 0 &&
              rewardCards
                .slice(currentSlide, currentSlide + 3)
                .map((reward, index) => (
                  <Card key={index} sx={{ maxWidth: 345 }} className="card">
                    <CardMedia className="card-media" sx={{ height: 140 }}>
                      <h2
                        style={{
                          paddingTop: "1%",
                          paddingLeft: "75%",
                          color: "purple",
                        }}
                      >
                        ${reward.reward}
                      </h2>
                      <p
                        style={{
                          paddingTop: "23%",
                          paddingLeft: "40%",
                          color: "purple",
                          fontWeight: "700",
                        }}
                      >
                        Expired Date:{" "}
                        {dayjs(reward.expiredDate).format("DD/MM/YYYY")}
                      </p>
                    </CardMedia>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Redeem Your Reward
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Congratulations! You have earned a reward. Redeem it now
                        to enjoy exclusive benefits.
                      </Typography>
                    </CardContent>
                    <CardActions
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        style={{ background: "brown" }}
                        onClick={() => {
                          ClaimReward(reward._id);
                          console.log(reward, "adasdasdasdas");
                        }}
                      >
                        Redeem
                      </Button>
                      <Button
                        size="small"
                        style={{
                          border: "1px solid brown",
                          color: "brown",
                        }}
                      >
                        No Thanks
                      </Button>
                    </CardActions>
                  </Card>
                ))}
          </div>
          {noReward ? (
            <div className="noBookigs">
              <h2 style={{ paddingTop: "40px" }}>
                There Are No Bookings Yet...
              </h2>
            </div>
          ) : (
            ""
          )}

          {rewardCards.length > 3 ? (
            <button
              className="arrow next"
              onClick={() => {
                setCurrentSlide((prev) =>
                  prev === 0 ? rewardCards.length - 3 : prev - 1
                );
              }}
            >
              {">"}
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
