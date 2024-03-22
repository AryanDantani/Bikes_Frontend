import "./App.css";
import NavigationBar from "./Componants/NavigationBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./Pages/AboutUs";
import NewRide from "./Pages/NewRide";
import Login from "./Login&Registration/login";
import SignUp from "./Login&Registration/SignUp";
import PrivateRoutes from "./PrivateRoute";
import Rental from "./Pages/Rental";
import RentalForm from "./Pages/RentalForm";
import OtpInput from "./Pages/OtpInput";
import NewPassword from "./Pages/NewPassword";
import Profile from "./Pages/Profile";
import Users from "./Pages/Users";
import PaymentPage from "./Pages/PaymentPage";
import UserStatusForm from "./Pages/UserStatusForm";
import Dashboard from "./Pages/Dashboard";
import AllRequests from "./Pages/AllRequests";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/checkotp" element={<OtpInput />} />
          <Route path="/reset-password" element={<NewPassword />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<AboutUs />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/newride" element={<NewRide />} />
            <Route path="/booking/:id" element={<RentalForm />} />
            <Route path="user/bookings/:id" element={<Rental />} />
            <Route path="paymentpage/:id" element={<PaymentPage />} />
            <Route path="/bookings" element={<Rental />} />
            <Route path="/request" element={<UserStatusForm />} />
            <Route path="/allrequests" element={<AllRequests />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
