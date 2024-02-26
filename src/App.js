import './App.css';
import NavigationBar from './Componants/NavigationBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from './Pages/AboutUs';
import NewRide from './Pages/NewRide';
import Login from './Login&Registration/login';
import SignUp from "./Login&Registration/SignUp"
import PrivateRoutes from './PrivateRoute';
import Rental from './Pages/Rental';
// import BookingForm from './Pages/BookingForm';
// import Bookings from './Pages/Bookings';
import RentalForm from './Pages/RentalForm';
import OtpInput from './Pages/OtpInput';
import NewPassword from './Pages/NewPassword';

function App() {
  return (
    <div className='App'>
      
      <BrowserRouter>
      <NavigationBar />
        <Routes>
          <Route  path="/" element={<Login />}/>
          <Route  path="/signup" element={<SignUp />}/>
          <Route path="/checkotp" element={<OtpInput/>}/>
          <Route path="/reset-password" element={<NewPassword/>}/>
          <Route element={<PrivateRoutes/>}>
          <Route  path="/aboutus" element={<AboutUs />}/>
          <Route  path="/newride" element={<NewRide />}/>
          <Route path="/rental/:id" element={<RentalForm/>}/>
          <Route path="/rental" element={<Rental/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
