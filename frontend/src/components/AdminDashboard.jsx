import React, { useEffect, useState } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/bookstacktitleblack.jpg";
import { useSelector, useDispatch } from "react-redux";
import Header from "../layout/Header";
import { fetchAllUsers } from "../store/slices/userSlice";
import { fetchAllBook } from "../store/slices/bookSlice";
import { fetchAllborroweBooks } from "../store/slices/borrowSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const AdminDashboard = ({ setSelectedComponent }) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.auth);
  const {users} = useSelector((state)=>state.user);
  const {books} = useSelector((state)=>state.book);
  const {allBorrowedBooks} = useSelector((state)=>state.borrow);
  const {settingPopup} = useSelector((state)=>state.popup);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalBooks, setTotalBooks] = useState((books && books.length)||0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalOverdueBooks, setTotalOverdueBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBook());
    dispatch(fetchAllborroweBooks());
  }, [dispatch]);

  useEffect(()=>{
    let numUsers = users.filter(user=>user.role==="User");
    let numAdmins = users.filter(user=>user.role==="Admin");
    let numBooks = books?.length || 0;
    const curDate = new Date();
    
    let numBorrowedBooks = allBorrowedBooks?.filter(
      (book)=>!book.returnDate && new Date(book.dueDate) > curDate
    ).length || 0;
    
    let numOverdueBooks = allBorrowedBooks?.filter(
      (book)=>!book.returnDate && new Date(book.dueDate) <= curDate
    ).length || 0;
    
    let numReturnedBooks = allBorrowedBooks?.filter(
      (book)=>book.returnDate
    ).length || 0;

    setTotalAdmins(numAdmins);
    setTotalUsers(numUsers);
    setTotalBooks(numBooks);
    setTotalBorrowedBooks(numBorrowedBooks);
    setTotalOverdueBooks(numOverdueBooks);
    setTotalReturnedBooks(numReturnedBooks);
  },[users, allBorrowedBooks]);

  const handleManageClick = (section) => {
    switch(section) {
      case "users":
        setSelectedComponent("Users");
        break;
      case "books":
        setSelectedComponent("Books");
        break;
      case "borrowed":
        setSelectedComponent("Catalog");
        break;
      case "overdue":
        localStorage.setItem('catalogFilter', 'due');
        setSelectedComponent("Catalog");
        break;
      case "returned":
        localStorage.setItem('catalogFilter', 'returned');
        setSelectedComponent("Catalog");
        break;
      default:
        break;
    }
  };

  const data ={
    labels:["Currently Borrowed Books", "Overdue Books", "Total Returned Books"],
    datasets :[
      {
         data: [totalBorrowedBooks, totalOverdueBooks, totalReturnedBooks],
         backgroundColor:["#151619", "#FF6B6B", "#41FA88"],
         hoverOffset:4,
      }
    ]
  }
  return <>
    <main className="relative flex-1 p-4 pt-20 bg-gray-50 min-h-screen">
      <Header/>
      {/* Dashboard Header */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, <span className="font-semibold">{user?.name || 'Admin'}</span>!</p>
        </div>
        <img src={logo} alt="logo" className="w-24 h-auto rounded-lg shadow-md hidden md:block"/>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Section - Cards and Quote */}
        <div className="flex-[2] bg-white rounded-lg shadow-md p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div 
              onClick={() => handleManageClick("users")}
              className="bg-gray-50 rounded-lg p-2.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer border border-black/10"
            >
              <img src={usersIcon} alt="Users" className="w-4 h-4" />
              <div>
                <span className="text-sm font-bold text-blue-600 block leading-tight">{totalUsers.length}</span>
                <span className="text-gray-600 text-[11px]">Users</span>
              </div>
            </div>
            <div 
              className="bg-gray-50 rounded-lg p-2.5 flex items-center gap-2 border border-black/10"
            >
              <img src={adminIcon} alt="Admins" className="w-4 h-4" />
              <div>
                <span className="text-sm font-bold text-purple-600 block leading-tight">{totalAdmins.length}</span>
                <span className="text-gray-600 text-[11px]">Admins</span>
              </div>
            </div>
            <div 
              onClick={() => handleManageClick("books")}
              className="bg-gray-50 rounded-lg p-2.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer border border-black/10"
            >
              <img src={bookIcon} alt="Books" className="w-4 h-4" />
              <div>
                <span className="text-sm font-bold text-green-600 block leading-tight">{books?.length || 0}</span>
                <span className="text-gray-600 text-[11px]">Books</span>
              </div>
            </div>
            <div 
              onClick={() => handleManageClick("borrowed")}
              className="bg-gray-50 rounded-lg p-2.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer border border-black/10"
            >
              <span className="inline-block w-4 h-4 rounded-full bg-[#151619]"></span>
              <div>
                <span className="text-sm font-bold text-gray-800 block leading-tight">{totalBorrowedBooks}</span>
                <span className="text-gray-600 text-[11px]">Borrowed(not-overdue)</span>
              </div>
            </div>
            <div 
              onClick={() => handleManageClick("overdue")}
              className="bg-gray-50 rounded-lg p-2.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer border border-black/10"
            >
              <span className="inline-block w-4 h-4 rounded-full bg-[#FF6B6B]"></span>
              <div>
                <span className="text-sm font-bold text-gray-800 block leading-tight">{totalOverdueBooks}</span>
                <span className="text-gray-600 text-[11px]">Overdue</span>
              </div>
            </div>
            <div 
              onClick={() => handleManageClick("returned")}
              className="bg-gray-50 rounded-lg p-2.5 flex items-center gap-2 hover:bg-gray-100 transition cursor-pointer border border-black/10"
            >
              <span className="inline-block w-4 h-4 rounded-full bg-[#41FA88]"></span>
              <div>
                <span className="text-sm font-bold text-gray-800 block leading-tight">{totalReturnedBooks}</span>
                <span className="text-gray-600 text-[11px]">Returned</span>
              </div>
            </div>
          </div>

          {/* Quote Section */}
          <div className="mt-3 pt-3 border-t border-black/10">
            <div className="flex items-center gap-2">
              <span className="text-xl text-gray-300">"</span>
              <p className="text-gray-700 font-bold text-sm">
                A library is not a luxury but one of the necessities of life.
              </p>
              <span className="text-xl text-gray-300">"</span>
            </div>
            <p className="text-right text-[10px] text-gray-500 mt-1">- Henry Ward Beecher</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex-[1] bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Book Status Overview</h2>
          <div className="w-full max-w-[300px] mx-auto">
            <Pie data={data} options={{cutout:0}} className="mx-auto w-full h-auto"/>
          </div>
          {/* <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#151619]"></span>
              <span className="text-gray-600 text-xs">Currently Borrowed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#FF6B6B]"></span>
              <span className="text-gray-600 text-xs">Overdue</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#41FA88]"></span>
              <span className="text-gray-600 text-xs">Returned</span>
            </div>
          </div> */}
        </div>
      </div>
    </main>
  </>;
};


export default AdminDashboard;
