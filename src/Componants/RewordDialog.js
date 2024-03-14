import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Confetti from "react-confetti";
import IconButton from "@mui/material/IconButton";
import "./RewardDialog.css";
import { useNavigate } from "react-router-dom";

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

export default function RewardDialog({ isReward, setIsReward, GetBookingByUser }) {
  const navigate = useNavigate();
  const handleClose = () => {
    // setIsReward(false);
    GetBookingByUser()
  };

  return (
    <React.Fragment>
      <Dialog
        open={isReward}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Reward
        </DialogTitle>
        <IconButton
          className="Close-Icon"
          aria-label="close"
          onClick={handleClose}
        ></IconButton>
        <DialogContent>
          <DialogContentText
            style={{
              fontSize: "x-large",
              textAlign: "center",
              fontWeight: "700",
              padding: "10px",
            }}
          >
            Congratulations! You've won a reward. Click below to claim it.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => {
              handleClose();
              navigate("/profile");
            }}
            style={{
              backgroundColor: "#93b0b9",
              fontSize: "revert",
              color: "#fff",
            }}
          >
            Claim Reward
          </Button>
        </DialogActions>
      </Dialog>
      {isReward && <Confetti />}{" "}
      {/* Render Confetti component when dialog is open */}
    </React.Fragment>
  );
}
