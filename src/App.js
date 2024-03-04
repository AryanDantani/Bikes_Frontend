import './App.css';
import NavigationBar from './Componants/NavigationBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from './Pages/AboutUs';
import NewRide from './Pages/NewRide';
import Login from './Login&Registration/login';
import SignUp from "./Login&Registration/SignUp"
import PrivateRoutes from './PrivateRoute';
import Rental from './Pages/Rental';
import RentalForm from './Pages/RentalForm';
import OtpInput from './Pages/OtpInput';
import NewPassword from './Pages/NewPassword';
import Profile from './Pages/Profile';
import Users from './Pages/Users';

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
          <Route  path="/users" element={<Users />}/>
          <Route  path="/profile" element={<Profile />}/>
          <Route  path="/aboutus" element={<AboutUs />}/>
          <Route  path="/newride" element={<NewRide />}/>
          <Route path="/booking/:id" element={<RentalForm/>}/>
          <Route path="user/bookings/:id" element={<Rental/>}/>
          <Route path="/bookings" element={<Rental/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
