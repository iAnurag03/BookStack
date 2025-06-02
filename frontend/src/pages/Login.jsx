import React, { useEffect, useState } from "react";
import logo from "../assets/bookstacktitleblack.jpg";
import logo_with_title from "../assets/bookstacktitlewhite.jpg";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Navigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const {loading, error, message, user, isAuthenticated} = useSelector(
    (state)=>state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    dispatch(login(data));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message]);

  if (isAuthenticated) {
    return <Navigate to={"/"} replace />;
  }

  return (
    <div className="flex flex-col justify-center md:flex-row h-screen relative">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="max-w-sm w-full">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="h-20 w-auto rounded-lg"/>
          </div>
           <h1 className="text-3xl font-semibold text-center mb-6">Welcome Back</h1>
           <p className="text-gray-600 text-center mb-8">Please Enter Your Credentials</p>
           <form onSubmit={handleLogin}>
            <div className="mb-6">
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
                type="password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
                placeholder="Password" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
              />
            </div>
            <Link to={"/password/forgot"} className="font-semibold text-black mb-12">Forgot Password?</Link>
            <div className="block md:hidden font-semibold mt-5">
              <p>New to our platform?</p>
              <Link to={"/register"} className="text-sm text-gray-500 hover:underline">Sign Up</Link>
            </div>
            <button 
              type="submit" 
              className="w-full font-semibold bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition border-2 border-black"
            >
             LOGIN
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
  
  
  )
};

export default Login;
