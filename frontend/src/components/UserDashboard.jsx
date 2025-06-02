import React, { useEffect, useState } from "react";
import logo_with_title from "../assets/bookstacktitleblack.jpg";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBooks } from "../store/slices/borrowSlice";
import Header from "../layout/Header";

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

const UserDashboard = ({ setSelectedComponent }) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.auth);
  const {userBooks} = useSelector((state)=>state.borrow);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    dispatch(fetchUserBooks());
  }, [dispatch]);

  useEffect(()=>{
   let numBorrrowedBooks = userBooks?.filter(
    (book)=>book.returned===false
   ).length || 0;
   let numReturnedBooks = userBooks?.filter(
    (book)=>book.returned===true
   ).length || 0;
   setTotalBorrowedBooks(numBorrrowedBooks);
   setTotalReturnedBooks(numReturnedBooks);
  },[userBooks]);

  const data ={
    labels:["Currently Borrowed Books", "Total Returned Books"],
    datasets :[
      {
         data: [totalBorrowedBooks, totalReturnedBooks],
         backgroundColor:["#151619", "#41FA88"]
      }
    ]
  }

  const handleMyBooksClick = (filter) => {
    setSelectedComponent("My Books");
    // Store the filter in localStorage so MyBorrowedBooks can access it
    localStorage.setItem('myBooksFilter', filter);
  };

  const handleBrowseBooksClick = () => {
    setSelectedComponent("Books");
  };

  return <>
    <main className="relative flex-1 p-6 pt-28 bg-gray-50 min-h-screen">
      <Header/>
      {/* Dashboard Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Dashboard</h1>
          <p className="text-gray-500">Welcome back, <span className="font-semibold">{user?.name || 'User'}</span>!</p>
        </div>
        <img src={logo} alt="logo" className="w-32 h-auto rounded-lg shadow-md hidden md:block"/>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div 
          onClick={() => handleMyBooksClick("nonReturned")}
          className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
        >
          <img src={bookIcon} alt="Borrowed" className="w-8 h-8 mb-2" />
          <span className="text-2xl font-bold text-blue-600">{totalBorrowedBooks}</span>
          <span className="text-gray-600 mt-1">Currently Borrowed</span>
        </div>
        <div 
          onClick={() => handleMyBooksClick("returned")}
          className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
        >
          <img src={returnIcon} alt="Returned" className="w-8 h-8 mb-2" />
          <span className="text-2xl font-bold text-green-600">{totalReturnedBooks}</span>
          <span className="text-gray-600 mt-1">Returned Books</span>
        </div>
        <div 
          onClick={handleBrowseBooksClick}
          className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
        >
          <img src={browseIcon} alt="Browse" className="w-8 h-8 mb-2" />
          <span className="text-2xl font-bold text-purple-600">Browse</span>
          <span className="text-gray-600 mt-1">Available Books</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex flex-col-reverse xl:flex-row gap-8">
        <div className="flex-[2] flex-col gap-7 lg:flex-row flex lg:items-center xl:flex-col justify-between xl:gap-20 py-5">
          <div className="xl:flex-[4] flex items-end w-full content-center">
            <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-[500px] mx-auto">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Book History</h2>
              <div className="w-full max-w-[400px] mx-auto">
                <Pie data={data} options={{cutout:0}} className="mx-auto lg:mx-0 w-full h-auto"/>
              </div>
              <div className="flex items-center justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#151619]"></span>
                  <span className="text-gray-600 text-sm">Currently Borrowed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#41FA88]"></span>
                  <span className="text-gray-600 text-sm">Returned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-8 relative">
        <h4 className="text-xl md:text-2xl text-gray-700 italic text-center">
          "Books are a uniquely portable magic. They open doors to worlds unseen, lives unimagined, and truths unspoken, all while fitting in the palm of your hand"
        </h4>
        <p className="text-gray-600 text-right mt-4">~Stephen King</p>
      </div>
    </main>
  </>;
};

export default UserDashboard;
