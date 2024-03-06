/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import "./profile.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./cardCarousel.scss";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Profile = () => {
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rewardCards, setRewardCards] = useState([]);
  const [deleteData, setDeleteData] = useState({
    email: "",
    password: "",
  });
  const [noReward, setNoReward] = useState(false);
  const [open, setOpen] = React.useState(false);

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

  const DeleteAccount = async () => {
    const Mail = deleteData.email;
    const Password = deleteData.password;

    if (userData.email !== Mail) {
      toast.warning("Please Provide Your Valid Email");
    } else {
      try {
        const response = await fetch(
          `http://localhost:4000/api/users/${Mail}/password`,
          {
            method: "POST", // Correct method
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: Password }), // Stringify body data
          }
        );
        console.log("Delete Response:", response);

        // Assuming the API returns a status code 204 for successful deletion
        if (response.status === 201) {
          toast.success("Account Deleted successfully");
          setTimeout(() => {
            navigate("/");
            localStorage.removeItem("tokan");
            localStorage.removeItem("user");
          }, [5000]);
        } else {
          toast.warning("Failed To Delete Account");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to delete account. Please try again.");
      }
    }
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

  console.log(currentSlide, "");

  return (
    <div>
      <ToastContainer />
      <div className="Pro-bg">
        <div className="main-box">
          <div>
            <button
              className="settings"
              onClick={() => {
                setOpen(true);
              }}
            >
              <i class="fa-solid fa-gear" />
            </button>
          </div>
          <div className="profile-bg">
            <div className="profile"></div>
            <h3 className="userName">{userData.name}</h3>
            <div>
              <button className="upload" type="file">
                <i class="fa-solid fa-plus" />
              </button>
            </div>
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
          <div>{rewardCards?.length ? rewardCards?.length : "0"}</div>
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
              disabled={currentSlide === 0}
            >
              {"<"}
            </button>
          ) : (
            ""
          )}

          <div className="slider-container">
            {rewardCards.length > 0 &&
              rewardCards
                .slice(currentSlide, currentSlide + 4)
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
              disabled={currentSlide + 3 >= rewardCards.length}
            >
              {">"}
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <div>
        <BootstrapDialog
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Delete Account Verification
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpen(false);
            }}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <form>
            <DialogContent dividers>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div>
                  <Typography>Email</Typography>
                </div>
                <input
                  value={deleteData.email}
                  onChange={(e) => {
                    setDeleteData({
                      ...deleteData,
                      email: e.target.value,
                    });
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div>
                  <Typography>Password</Typography>
                </div>
                <input
                  value={deleteData.password}
                  onChange={(e) => {
                    setDeleteData({
                      ...deleteData,
                      password: e.target.value,
                    });
                  }}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={() => {
                  setOpen(false);
                  DeleteAccount();
                }}
              >
                Save changes
              </Button>
            </DialogActions>
          </form>
        </BootstrapDialog>
      </div>
    </div>
  );
};
export default Profile;
