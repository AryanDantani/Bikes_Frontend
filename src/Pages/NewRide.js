import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./newride.scss";
import AddRentalBike from "./AddRentalBike";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import fetcher from "../fetcher";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const User = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    GetActiveBikesInCategory();
  }, []);

  //get all Bikes categories
  const GetActiveBikesInCategory = async (categoryId) => {
    try {
      let response = await fetcher.get("/api/category");
      const categoryData = response.data;
      const category = categoryData.find(
        (category) => category.id === categoryId || category.name === categoryId
      );

      if (!category) {
        console.error("Category not found");
        return;
      }

      const activeBikes = category.bikes.filter(
        (bike) => bike.status !== "Active"
      );
      console.log(activeBikes);
      setData(categoryData);
      setSelected(activeBikes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //Add Bike for Rent API
  async function AddBikeForRent(event) {
    event.preventDefault();

    const userId = User._id;

    if (
      !(
        rentalData.userName &&
        rentalData.email &&
        rentalData.contact &&
        rentalData.type &&
        rentalData.engine &&
        rentalData.date &&
        rentalData.owner &&
        rentalData.rent &&
        rentalData.name &&
        rentalData.mileage &&
        rentalData.km &&
        rentalData.image
      )
    ) {
      return false;
    }

    try {
      let response = await fetcher.post("/api/add-rental", {
        userId: userId,
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
      });
      if (response.status) {
        setIsOpen(false);
        GetActiveBikesInCategory();
      } else {
        console.log("Error:", response.data.message);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  }

  const handleDotClick = (index) => {
    setCurrentSlide(index * 4);
    setDotIndex(index);
  };

  return (
    <div className="new-ride-main">
      <ToastContainer />
      <div className="header">
        <h1>𝑺𝒆𝒍𝒆𝒄𝒕 𝒀𝒐𝒖𝒓 𝑹𝒊𝒅𝒊𝒏𝒈 𝑻𝒚𝒑𝒆</h1>
        {User.role === "owner" && (
          <button
            className="add-bike"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <i class="fa-solid fa-plus" style={{ marginRight: "10px" }} />
            𝑨𝒅𝒅 𝒀𝒐𝒖𝒓 𝑩𝒊𝒌𝒆
          </button>
        )}
      </div>
      <div className="category">
        {data?.map((item) => (
          <div
            key={item._id}
            className={`category-main ${
              selected._id === item._id ? "selected" : ""
            }`}
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
            <div className="category-card">
              <div className="category-img">
                <h3>{item?.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddRentalBike
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        rentalData={rentalData}
        setImageUrl={setImageUrl}
        setRentalData={setRentalData}
        AddBikeForRent={AddBikeForRent}
      />

      <div className="ride-selection-header">
        {isData ? (
          <h1>𝑽𝒆𝒉𝒊𝒄𝒍𝒆 𝑰𝒔 𝑵𝒐𝒕 𝑨𝒗𝒂𝒊𝒍𝒂𝒃𝒍𝒆 𝒀𝒆𝒕</h1>
        ) : (
          <h1>𝐶ℎ𝑜𝑜𝑠𝑒 𝐴𝑛𝑦 𝐴𝑣𝑎𝑖𝑙𝑎𝑏𝑙𝑒 𝑅𝑖𝑑𝑒𝑠</h1>
        )}
      </div>

      <div className="content-sec">
        <div className="slider-container">
          {selected.length > 0 &&
            selected
              .slice(currentSlide, currentSlide + 4)
              .map((item, index) => (
                <Card key={index} sx={{ maxWidth: 345 }} className="card">
                  <CardMedia className="card-media" sx={{ height: 140 }}>
                    <img src={item.image} alt={item.name} />
                  </CardMedia>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div>
                        <Typography variant="body2" color="text.secondary">
                          Engine:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mileage:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Owner:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Model:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Km / Run:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price For Rent:
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body2" color="text.secondary">
                          {item.engine}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.mileage}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.owner}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.stock}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.km}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.rent}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      style={{
                        background: "brown",
                        color: "#fff",
                        marginLeft: "22%",
                        width:"55%"
                      }}
                      onClick={() => {
                        if (item.stock <= 1) {
                          return toast.warn("Bike Is Not Available Right Now");
                        } else {
                          navigate("/booking/" + item?._id);
                        }
                      }}
                    >
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              ))}
        </div>

        <div className="dot-container">
          {Array(Math.ceil(selected.length / 4))
            .fill()
            .map((_, index) => (
              <span
                key={index}
                className={index === dotIndex ? "dot active" : "dot"}
                onClick={() => handleDotClick(index)}
              ></span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default NewRide;
