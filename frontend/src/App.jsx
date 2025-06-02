import React, { useEffect } from "react";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Home from "./pages/Home"
import ForgotPassword from "./pages/ForgotPassword"
import Login from "./pages/Login"
import OTP from "./pages/OTP"
import ResetPassword from "./pages/ResetPassword"
import Register from "./pages/Register"
import {ToastContainer} from "react-toastify"
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBook } from "./store/slices/bookSlice";
import { fetchAllborroweBooks, fetchUserBooks } from "./store/slices/borrowSlice";

const App = () => {
  const {user, isAuthenticated} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getUser());
    dispatch(fetchAllBook());
    if(isAuthenticated && user.role==="User") dispatch(fetchUserBooks());
    if(isAuthenticated && user.role==="Admin") dispatch(fetchAllUsers());
    if(isAuthenticated && user.role==="Admin") dispatch(fetchAllborroweBooks());
    
  },[isAuthenticated]);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/password/forgot" element={<ForgotPassword/>}/>
        <Route path="/otp-verification/:email" element={<OTP/>}/>
        <Route path="/password/reset/:token" element={<ResetPassword/>}/>
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
