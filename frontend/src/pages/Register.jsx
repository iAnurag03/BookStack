import React, { useEffect, useState } from "react";
import blacklogo from "../assets/bookstackblack.jpg";
import bookstacktitlewhite from "../assets/bookstacktitlewhite.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { resetAuthSlice, register } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const dispatch = useDispatch();
  const {loading, error, message, user, isAuthenticated} = useSelector(state=>state.auth);
  const navigateTo = useNavigate();
  const handleRegister = (e)=>{
    e.preventDefault();
    const data = new FormData();
    data.append("name", name)
    data.append("email",email)
    data.append("password", password)
    dispatch(register(data));
  }
  useEffect(()=>{
    if(message){
      navigateTo(`/otp-verification/${email}`)
    }
    if(error){
      toast.error(error)
      dispatch(resetAuthSlice());
    }
  },[dispatch, isAuthenticated, error, loading]);
  if(isAuthenticated){
    return <Navigate to={"/"}/>
  }
  return (<>
    <div className="flex flex-col justify-center md:flex-row min-h-screen">
        {/* Left Section - Hidden on Mobile */}
        <div className="hidden md:flex w-full md:w-1/2 bg-black text-white flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
          <div className="text-center max-w-md">
            <div className="rounded-[10px] flex justify-center mb-8">
              <img src={bookstacktitlewhite} alt="logo" className="h-32 w-auto rounded-lg"/>
            </div>
            <p className="text-gray-300 mb-6 text-lg font-semibold">Already a user? Sign In now.</p>
            <Link 
              to={"/login"} 
              className="inline-block border-2 border-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-black transition"
            >
              SIGN IN
            </Link>
          </div>
        </div>

        {/* Right Section - Full width on Mobile */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4 md:p-8">
           <div className="w-full max-w-sm">
            <div className="flex justify-center mb-8">
              <h3 className="font-semibold text-3xl md:text-4xl">SIGN UP</h3>
            </div>
            <p className="text-gray-600 text-center mb-8">Please provide the following details to complete your Sign up</p>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e)=>setName(e.target.value)} 
                  placeholder="Full Name" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
                />
              </div>
              <div className="mb-4">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e)=>setEmail(e.target.value)} 
                  placeholder="Email" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
                />
              </div>
              <div className="mb-6">
                <input 
                  type="text" 
                  value={password} 
                  onChange={(e)=>setPassword(e.target.value)} 
                  placeholder="Password" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
                />
              </div>

              {/* Mobile Sign In Link */}
              <div className="md:hidden text-center mb-6">
                <p className="text-gray-600">Already have an account?</p>
                <Link to="/login" className="text-black font-semibold hover:underline">Sign In</Link>
              </div>

              <button 
                type="submit" 
                className="w-full font-semibold bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition border-2 border-black"
              >
                SIGN UP
              </button>
            </form>
          </div>
        </div>
    </div>
  </>);
};

export default Register;
