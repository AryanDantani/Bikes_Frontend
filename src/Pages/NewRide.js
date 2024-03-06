/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./newride.scss";
import AddRentalBike from "./AddRentalBike";

const NewRide = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [rentalData, setRentalData] = useState({
    userName: "",
    email: "",
    contact: "",
    type: "",
    engine: "",
    date: "",
    owner: "",
    mileage: "",
    rent: "",
    image: "",
  });
  const [selected, setSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isData, setIsData] = useState(false);

  useEffect(() => {
    GetAllCategory();
  }, []);

  const GetAllCategory = async () => {
    let result = await fetch("http://localhost:4000/api/category");
    result = await result.json();
    setData(result);
    console.log(result);
  };

  async function AddBikeForRent(event) {
    event.preventDefault();

    if (
      (!rentalData.userName,
      !rentalData.email,
      !rentalData.contact,
      !rentalData.type,
      !rentalData.engine,
      !rentalData.date,
      !rentalData.owner,
      !rentalData.rent,
      !rentalData.name,
      !rentalData.mileage,
      !rentalData.km,
      !rentalData.image)
    ) {
      return false;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/add-rental",
        {
          userName: rentalData.userName,
          email: rentalData.email,
          contact: rentalData.contact,
          type: rentalData.type,
          engine: rentalData.engine,
          date: rentalData.date,
          owner: rentalData.owner,
          rent: rentalData.rent,
          name: rentalData.name,
          mileage: rentalData.mileage,
          km: rentalData.km,
          image: imageUrl,
        }
      );
      if (response.status) {
        setIsOpen(false);
        GetAllCategory()
        console.log(response?.data);
      } else {
        // toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div>
        <h1
          style={{
            marginBottom: "30px",
          }}
        >
          Select Your Riding Type
        </h1>
        <button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Add Your Bike
        </button>
      </div>

      <hr />
      <div className="category">
        {data?.map((item) => {
          return (
            <div className="category-main" key={item._id}>
              <div
                className="category-card"
                onClick={() => {
                  if (item?.bikes?.length === 0) {
                    setIsData(true);
                    setSelected([]);
                  } else {
                    setIsData(false);
                    setSelected(item?.bikes);
                  }
                }}
              >
                <div className="category-img">
                  <img src={item?.image} />
                  <h3>{item?.title}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <AddRentalBike
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        rentalData={rentalData}
        setImageUrl={setImageUrl}
        setRentalData={setRentalData}
        AddBikeForRent={AddBikeForRent}
      />
      <hr />

      {isData ? (
        <h1>Vehicle Is Not Available Yet</h1>
      ) : (
        <h1>Choose Any Available Rides</h1>
      )}
      <div className="category1">
        {selected.map((item) => {
          return (
            <div className="category-main1" key={item?._id}>
              <div className="category-card1">
                <div className="category-img1">
                  <img src={item?.image} />
                </div>
                <hr />
                <div className="category-details1">
                  <div className="category-lab1">
                    <p>Engine:</p>
                    <p>Mileage:</p>
                    <p>Owner:</p>
                    <p>Model:</p>
                    <p>left:</p>
                    <p>Km / Run:</p>
                    <p>Available:</p>
                    <p>Price For Rent:</p>
                  </div>
                  <div className="category-val1">
                    <p>{item.engine}</p>
                    <p>{item.mileage}</p>
                    <p>{item.owner}</p>
                    <p>{item.name}</p>
                    <p>{item.stock}</p>
                    <p>{item.km}</p>
                    <p>{item.date}</p>
                    <p>{item.rent}</p>
                  </div>
                </div>
                <hr />
                <div>
                  <button
                    style={{
                      width: "40%",
                      marginTop: "10px",
                      marginRight: "10px",
                      height: "30px",
                      marginBottom: "5px",
                      backgroundColor: "#000",
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      console.log(item?._id);
                      navigate("/booking/" + item?._id);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default NewRide;
