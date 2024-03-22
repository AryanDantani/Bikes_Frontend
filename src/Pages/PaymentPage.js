import React, { useEffect, useState } from "react";
import "./pamentPage.scss";
import fetcher from "../fetcher";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { UseChannelIdContext } from "../Context/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";

const PaymentPage = () => {
  const [usersData, setUsersData] = useState([]);
  const [bikeData, setBikeData] = useState([]);
  const { bookedData } = UseChannelIdContext();
  const [isLoad, setIsLoad] = useState(false);
  const navigate = useNavigate();
  const bike = localStorage.getItem("bikeId")
    ? JSON.parse(localStorage.getItem("bikeId"))
    : "";

  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";

  const getBikeById = async () => {
    let data = await fetch(`http://localhost:4000/api/category/bike/${bike}`);
    data = await data.json();
    console.log(data, "asdasdas");
    setBikeData(data.bike);
  };

  const GetUserByID = async () => {
    const userId = userData._id;
    let data = await fetcher.get(`/api/users/${userId}`);
    setUsersData(data?.data?.user);
  };

  // calculation according to Hours
  const startMoment = moment(bookedData.startTime, "hh:mm A");
  const endMoment = moment(bookedData.endTime, "hh:mm A");

  const durationInHours = endMoment.diff(startMoment, "hours");

  const RentByHours = durationInHours * 200;

  // calculation according to Days
  const sDate = moment(bookedData.startDate, "DD/MM/YYYY");
  const eDate = moment(bookedData.endDate, "DD/MM/YYYY");

  const differenceInDays = eDate.diff(sDate, "days");

  const RentByDays = bookedData.isDay ? differenceInDays * 200 : RentByHours;

  // calculation according payment

  const AmoutPerHour = bookedData.isDay
    ? RentByDays
    : durationInHours * bikeData.rent;

  const GSTRate = bookedData.isDay
    ? RentByDays * (8 / 100)
    : AmoutPerHour * (8 / 100);

  const TotalAmount = AmoutPerHour + GSTRate;

  // validation of booking Fields
  const validateForm = () => {
    if (
      !bookedData.firstname ||
      !bookedData.lastname ||
      !bookedData.email ||
      !bookedData.phone ||
      !bookedData.city ||
      !bookedData.age ||
      !bookedData.liceNumber ||
      !bookedData.idProof
    ) {
      toast.error("Please fill all the fields");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookedData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Validate age as a number
    if (isNaN(bookedData.age)) {
      toast.error("Please enter a valid age");
      return false;
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(bookedData.phone)) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    // Validate driving license number format
    const licenseRegex =
      /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
    if (!licenseRegex.test(bookedData.liceNumber)) {
      toast.error("Please enter a valid driving license number");
      return false;
    }

    // Validate ID proof number
    const idProofRegex = /^\d{12}$/;
    if (!idProofRegex.test(bookedData.idProof)) {
      toast.error("Please enter a valid ID proof number");
      return false;
    }

    return true;
  };

  async function save(event) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoad(true)
    const userId = userData._id;

    try {
      const response = await fetcher.post(`/api/rental`, {
        firstname: bookedData.firstname,
        lastname: bookedData.lastname,
        age: bookedData.age,
        email: bookedData.email,
        city: bookedData.city,
        startDate: bookedData.startDate,
        endDate: bookedData.endDate,
        phone: bookedData.phone,
        startTime: bookedData.startTime,
        endTime: bookedData.endTime,
        userId: userId,
        bikeId: bikeData._id,
        licenceNumber: bookedData.liceNumber,
        idProof: bookedData.idProof,
      });

      if (response.status === 201) {
        toast.success("Booking successful!");
        localStorage.removeItem("bikeId");
        generateAndDownloadInvoice();
        setTimeout(() => {
          navigate("/bookings");
          setIsLoad(false)
        }, [5000]);
      } else {
        const errorData = await response.json();
        toast.warning(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving booking:", error);
      toast.error("An error occurred while saving the booking.");
    }
  };

  const generateAndDownloadInvoice = async () => {
    debugger;
    try {
      const response = await fetch(
        `http://localhost:4000/api/invoices/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoiceData: {
              name: bookedData?.firstname + " " + bookedData?.lastname,
              bike: bikeData?.name,
              hours: durationInHours ? durationInHours : " - ",
              date: bookedData?.startDate + " - " + bookedData.endDate,
              rent: RentByDays,
            },
            customTitle: "Rental Invoice",
          }),
        }
      );

      console.log("Response:", response);

      if (!response.ok) {
        // Handle non-successful response
        const errorData = await response.json();
        throw new Error(`Failed to generate invoice: ${errorData.message}`);
      }

      // Check content type of response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/pdf") !== -1) {
        // If the response is a PDF file, create a blob from the response data
        const blob = await response.blob();
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.download = "invoice.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Revoke the object URL to free up memory
        URL.revokeObjectURL(url);
      } else {
        // If the response is not a PDF file, handle accordingly
        throw new Error("Response is not a PDF file");
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const userId = userData._id;
    if (bookedData.lenght === 0) {
      navigate("/bookings/" + userId);
    } else {
      getBikeById();
      GetUserByID();
    }
  }, []);

  return (
    <div className="payment-main">
      <ToastContainer />
      {isLoad ? (
        <div className="loader-bg">
          <CircularProgress className="loader" />
        </div>
      ) : (
        ""
      )}
      <div className="paper-payment">
        <div className="payment-details">
          <h3>Payment Page</h3>
        </div>
        <div className="payment-content">
          <div className="contant-name">
            <div className="name-par-con">
              <div className="name-key">Name:</div>
              <div className="name-value">{usersData.name}</div>
            </div>
            <div className="name-par-con">
              <div className="name-key">Email:</div>
              <div className="name-value">{usersData.email}</div>
            </div>
            <div className="name-par-con">
              <div className="name-key">Contact:</div>
              <div className="cont-value">{usersData.phone}</div>
            </div>
            <div className="name-par-con">
              <div className="name-key">Licence No:</div>
              <div className="lice-value">{usersData.phone}</div>
            </div>
          </div>
          <div className="calculation">
            <div className="name-par-con">
              <div style={{ display: "flex" }}>
                <div
                  className="calculation-keys-1"
                  style={{ fontWeight: "600" }}
                >
                  Bike Name:
                </div>
                <div className="calculation-keys-1">{bikeData.name}</div>
              </div>
              {!bookedData.isDay ? (
                <div style={{ display: "flex" }}>
                  <div
                    className="calculation-keys-2"
                    style={{ fontWeight: "600" }}
                  >
                    Rental Duration:
                  </div>
                  <div className="calculation-keys-2">{durationInHours}</div>
                </div>
              ) : (
                ""
              )}

              <div style={{ display: "flex" }}>
                <div
                  className="calculation-keys-2"
                  style={{ fontWeight: "600" }}
                >
                  {bookedData.isDay ? "Rent By Days:" : "Rent Per Hour:"}
                </div>
                <div className="calculation-keys-2">
                  {bookedData.isDay
                    ? differenceInDays + " " + "Days"
                    : bikeData.rent}
                </div>
              </div>

              <div className="calculation-keys-3" style={{ fontWeight: "600" }}>
                Amount:{AmoutPerHour} ₹
              </div>
              <div
                className="calculation-keys-3"
                style={{
                  marginLeft: "50%",
                  marginTop: "15px",
                  fontWeight: "600",
                  marginBottom: "15px",
                }}
              >
                GST (18%):{GSTRate} ₹
              </div>
              <hr />
              <div
                className="name-key"
                style={{
                  marginRight: "-45%",
                  marginTop: "10px",
                  fontWeight: "600",
                }}
              >
                Total Amount:{TotalAmount} ₹
              </div>
            </div>
          </div>
          <div>
            <button
              className="payment-btn"
              onClick={(event) => {
                save(event);
              }}
            >
              PayNow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
