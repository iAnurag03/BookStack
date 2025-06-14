import  { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate} from "react-router-dom";
import Sidebar from "../layout/SideBar";

import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagment from "../components/BookManagement";
import Catalog from "../components/Catalog";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import Users from "../components/Users";


const Home = () => {
  const [isSideBar, setSideBar] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("");
  const { user, isAuthenticated } = useSelector(state => state.auth);

   if (!isAuthenticated) {
      return <Navigate to="/login"/>;
    }
  return <>
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
      <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">
        <GiHamburgerMenu className="text-2xl" onClick={()=> setSideBar(!isSideBar)}/>
      </div>
      <Sidebar isSideBar={isSideBar} setSideBar={setSideBar} setSelectedComponent={setSelectedComponent}/>

      {
        (
          ()=>{
            switch(selectedComponent){
              case "Dashboard":
                return user?.role === "User"?(
                  <UserDashboard setSelectedComponent={setSelectedComponent}/>
                ):(
                  <AdminDashboard setSelectedComponent={setSelectedComponent}/>
                )
                break;
              case "Books":
                return <BookManagment/>
                break;
              case "Catalog":
                if(user.role === "Admin"){
                  return <Catalog/>
                }
                break;
              case "Users":
                if(user.role === "Admin"){
                  return <Users/>
                }
                break;
              case "My Books":
                return <MyBorrowedBooks/>
              default:
                 return user?.role === "User"?(
                  <UserDashboard setSelectedComponent={setSelectedComponent}/>
                ):(
                  <AdminDashboard setSelectedComponent={setSelectedComponent}/>
                )
                break;
              
            }
          })()}
    </div>

  </>
};

export default Home;
