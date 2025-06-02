import React, { useState, useEffect } from "react";
import logo from "../assets/bookstacktitleblack.jpg";
import logo_with_title from "../assets/bookstacktitlewhite.jpg";
import {Link, Navigate, useParams} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, register, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const OTP = () => {
  const {email} = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const {loading, error, message, user, isAuthenticated} = useSelector(state=>state.auth);

  const handeleOtpVerification = (e)=>{
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  }
  useEffect(()=>{
      if(message){
       toast.success(message);
       dispatch(resetAuthSlice());
      }
      if(error){
        toast.error(error)
        dispatch(resetAuthSlice());
      }
    },[dispatch, isAuthenticated, error, loading]);
  if(isAuthenticated){
    return <Navigate to={"/"}/>
  }
  return <>
      <div className="flex flex-col justify-center md:flex-row h-screen relative">
        {/* Back Button */}
        

        {/* Left Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
         <div className="max-w-sm w-full">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="h-20 w-auto rounded-lg"/>
          </div>
           <h1 className="text-3xl font-semibold text-center mb-6">Check Your MailBox</h1>
           <p className="text-gray-600 text-center mb-8">Enter the OTP to proceed</p>
           <form onSubmit={handeleOtpVerification}>
            <div className="mb-6">
              <input 
                type="number" 
                value={otp} 
                onChange={(e)=>setOtp(e.target.value)} 
                placeholder="Enter OTP" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
              />
            </div>
            <button 
              type="submit" 
              className="w-full font-semibold bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition border-2 border-black"
            >
              VERIFY
            </button>
           </form>
         </div>
        </div>

        {/* Right Section */}
        <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-8">
              <img src={logo_with_title} alt="logo" className="h-32 w-auto rounded-lg"/>
            </div>
            <p className="text-gray-300 mb-8 text-lg">New to our platform? Sign Up Now.</p>
            <Link 
              to={"/register"}  
              className="inline-block w-full border-2 border-white font-semibold bg-transparent text-white py-3 rounded-lg hover:bg-white hover:text-black transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
  </>;
};

export default OTP;
