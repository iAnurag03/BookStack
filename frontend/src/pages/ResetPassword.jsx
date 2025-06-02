import React, { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import logo from "../assets/bookstacktitleblack.jpg";
import logo_with_title from "../assets/bookstacktitlewhite.jpg";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthSlice, resetPassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword]= useState("");
  const [confirmPassword, setConfirmPassword]= useState("");
  const {token} = useParams();
  const dispatch = useDispatch();
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const handleResetPassword =(e)=>{
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("password", password);
    formdata.append("confirmPassword", confirmPassword);
    dispatch(resetPassword(formdata, token));  
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
     <div className="flex flex-col justify-center md:flex-row h-screen">
       <div className="hidden w-full md:w-1/2 bg-black text-white md:flex-col items-center justify-center rounded-tr-[80px] rounded-br-[80px]">
        <div>
          <div className="text-center">
                    <div className="flex justify-center mb-8">
                      <img src={logo_with_title} alt="logo" className="h-32 w-auto rounded-lg" />
                    </div>
                    <h3 className="text-gray-300 mb-8 text-lg">forgot your password??? We have got you covered.</h3>
           </div>
        </div>
       </div>
       <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
               <Link
                 to={"/login"}
                 className="absolute top-6 left-6 border-2 border-black rounded-full px-6 py-2 font-semibold hover:bg-black hover:text-white transition duration-300"
               >
                 Back
               </Link>
               <div className="w-full max-w-sm">
                 <div className="flex justify-center mb-8">
                   <img src={logo} alt="logo" className="h-20 w-auto rounded-lg" />
                 </div>
                 <h1 className="text-3xl font-semibold text-center mb-6">Reset Password</h1>
                 <p className="text-gray-600 text-center mb-8">Please enter your new password</p>
                 <form onSubmit={handleResetPassword}>
                   <div className="mb-6">
                     <input
                       type="password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="New password"
                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
                       required
                     />
                   </div>
                   <div className="mb-6">
                     <input
                       type="password"
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       placeholder="confirm new password"
                       className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
                       required
                     />
                   </div>
                   <button
                     type="submit"
                     className="w-full font-semibold bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition border-2 border-black"
                     disabled={loading}
                     
                   >
                     RESET PASSWORD
                   </button>
                 </form>
               </div>
             </div>



     </div>
  </>;
};

export default ResetPassword;
