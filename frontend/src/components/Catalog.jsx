import React, { useEffect, useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBook, resetBookSlice } from "../store/slices/bookSlice";
import { fetchAllborroweBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup"
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();
  const {returnBookPopup} = useSelector((state)=>state.popup);
  const {loading, error, allBorrowedBooks, message} = useSelector((state)=>state.borrow);
  const {books} = useSelector((state)=>state.book);
  const [filter, setFilter] = useState("borrowed");

  useEffect(() => {
    dispatch(fetchAllborroweBooks());
    dispatch(fetchAllBook());
  }, [dispatch]);

  useEffect(() => {
    // Check if there's a filter in localStorage
    const savedFilter = localStorage.getItem('catalogFilter');
    if (savedFilter) {
      setFilter(savedFilter);
      // Clear the filter from localStorage after using it
      localStorage.removeItem('catalogFilter');
    }
  }, []);

  useEffect(()=>{
    if(message){
      toast.success(message);
      dispatch(fetchAllborroweBooks());
      dispatch(fetchAllBook());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if(error){
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  },[dispatch, error, loading, message, allBorrowedBooks]);

  const formatDateTime = (timeStamp)=>{
       const date = new Date(timeStamp);
       const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getFullYear()).padStart(2,"0")}`;
       const formattedTime = `${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}:${String(date.getSeconds()).padStart(2,"0")}`;
       const result = `${formattedDate} ${formattedTime}`;
       return result;
  };

  const formatDate = (timeStamp)=>{
       const date = new Date(timeStamp);
       const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getFullYear()).padStart(2,"0")}`;
       return formattedDate;
  };

  const curDate = new Date();
  
  // Filter books based on their status
  const borrowBooks = allBorrowedBooks?.filter((book) => {
    return !book.returnDate;
  });

  const dueBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return !book.returnDate && dueDate <= curDate;
  });

  const returnedBooks = allBorrowedBooks?.filter((book) => {
    return book.returnDate;
  });

  // Select which books to display based on the current filter
  const booksToDisplay = filter === "borrowed" ? borrowBooks :
                        filter === "due" ? dueBooks :
                        returnedBooks;

  const [email,setEmail] = useState("");
  const [borrowBookId, setBorrowBookId] = useState("");
  const openReturnBookPopup=(bookId, email)=>{
        setBorrowBookId(bookId);
        setEmail(email);
        dispatch(toggleReturnBookPopup());    
  }

  // Function to get book title by ID
  const getBookTitle = (bookId) => {
    const book = books.find(book => book._id === bookId);
    return book ? book.title : "Unknown Book";
  };

  return <>
     <main className="relative flex-1 p-6 pt-28">
        <Header/>
       
        <header className="flex flex-col gap-3 sm:flex-row md:items-center">
          <button 
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:roundede-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${filter==="borrowed"? "bg-black text-white border-black":"bg-gray-200 text-black border-gray-200 hover:bg-gray-300"}`}  
            onClick={()=>setFilter("borrowed")}
          >
            Borrowed Books
          </button>
          <button 
            className={`relative rounded-none text-center border-2 font-semibold py-2 w-full sm:w-72 ${filter==="due"? "bg-black text-white border-black":"bg-gray-200 text-black border-gray-200 hover:bg-gray-300"}`}  
            onClick={()=>setFilter("due")}
          >
            Overdue Books
          </button>
          <button 
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:roundede-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 ${filter==="returned"? "bg-black text-white border-black":"bg-gray-200 text-black border-gray-200 hover:bg-gray-300"}`}  
            onClick={()=>setFilter("returned")}
          >
            Returned Books
          </button>
        </header>
        {
            booksToDisplay && booksToDisplay.length>0?(
                 <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left">BOOK TITLE</th>
                      <th className="px-4 py-2 text-left">USERNAME</th>
                      <th className="px-4 py-2 text-left">EMAIL</th>
                      <th className="px-4 py-2 text-left">PRICE</th>
                      <th className="px-4 py-2 text-left">DUE DATE</th>
                      <th className="px-4 py-2 text-left">ISSUE DATE</th>
                      <th className="px-4 py-2 text-left">RETURN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        booksToDisplay.map((book,index)=>(
                          <tr key={index} className={(index+1)%2===0?"bg-gray-50":""}>
                            <td className="px-4 py-2">{getBookTitle(book.book)}</td>
                            <td className="px-4 py-2">{book?.user.name}</td>
                            <td className="px-4 py-2">{book?.user.email}</td>
                            <td className="px-4 py-2">{book.price}</td>
                            <td className="px-4 py-2">{formatDate(book.dueDate)}</td>
                            <td className="px-4 py-2">{formatDateTime(book.createdAt)}</td>
                            <td className="px-4 py-2">
                              {book.returnDate ? (
                                <FaSquareCheck className="h-6 w-6"/>
                              ) : (
                                <PiKeyReturnBold 
                                  onClick={()=>openReturnBookPopup(book.book, book?.user.email)}  
                                  className="h-6 w-6"
                                />
                              )}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                 </div>
            ) : (
              <div className="mt-6 text-center text-gray-500">No books found</div>
            )
        }
     </main>
     {returnBookPopup && <ReturnBookPopup bookId={borrowBookId} email={email}/> }
  </>;
};

export default Catalog;
