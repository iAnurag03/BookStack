import React, { useEffect, useState } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup, toggleReadBookPopup, toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBook, resetBookSlice } from "../store/slices/bookSlice";
import { fetchAllborroweBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import Header from "../layout/Header"
import AddBookPopup from "../popups/AddBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup"
import ReadBookPopup from "../popups/ReadBookPopup"

const BookManagement = () => {
  const dispatch = useDispatch();
  const {loading, error, message, books} = useSelector((state)=>state.book);
  const {isAuthenticated, user} = useSelector((state)=>state.auth);
  const {addBookPopup, readBookPopup, recordBookPopup} = useSelector((state)=>state.popup);
  const {loading : borrowSliceLoading, error:borrowSliceError, message:borrowSliceMessage} = useSelector((state)=>state.borrow);
  
  const [readBook, setReadBook] = useState({});
  const openReadPopup =(id)=>{
    const book = books.find(book=>book._id === id);
    setReadBook(book);
    dispatch(toggleReadBookPopup());
  };

  const [borrowBookId, setBorrowBookId] = useState("");
  const openRecordBookPopup = (bookId)=>{
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  }

  useEffect(()=>{
    if(message|| borrowSliceMessage) {
      toast.success(message|| borrowSliceMessage);
      dispatch(fetchAllBook());
      dispatch(fetchAllborroweBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
   
    if(error || borrowSliceError){
      toast.error(error|| borrowSliceError);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  },[dispatch, message, error, loading, borrowSliceError, borrowSliceLoading, borrowSliceMessage ]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const handleSearch=(e)=>{
    setSearchKeyword(e.target.value.toLowerCase());
  }
  const searchedBooks = books.filter(book=>{
     return book.title.toLowerCase().includes(searchKeyword)
  });
   
  return <>
     <main className="relative flex-1 p-6 pt-28">
      <Header/>
       <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
            {user && user.role==="Admin"?"Book Managment":"Books"}</h2>
             <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          {
            isAuthenticated && user?.role==="Admin" && (
              <button onClick={()=>dispatch(toggleAddBookPopup())} className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800">
                <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">
                  +
                </span>
                Add New Book</button>
            )
          }
            <input type="text" placeholder="search" className="w-full sm:w-52 border p-2 border-gray-300 rounded-md" value={searchKeyword} onChange={handleSearch}/>
             </div>
       </header>
       {
        searchedBooks && searchedBooks.length > 0 ? (
           <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
             <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">AUTHOR</th>
                {
                  isAuthenticated && user?.role==="Admin" && (
                     <th className="px-4 py-2 text-left">QUANTITY</th> 
                  )
                }
                <th className="px-4 py-2 text-left">PRICE</th>
                <th className="px-4 py-2 text-left">AVAILABILITY</th>
                {
                  isAuthenticated && user?.role==="Admin" && (
                     <th className="px-4 py-2 text-center">RECORD</th> 
                  )
                }
              </tr>
             </thead>

             <tbody>
              {
                searchedBooks.map((book,index)=>(
                  <tr key={book._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-2">{index+1}</td>
                    <td className="px-4 py-2">{book.title}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    {
                     isAuthenticated && user?.role==="Admin" && (
                     <td className="px-4 py-2">{book.quantity}</td> 
                     )
                   }
                    <td className="px-4 py-2">{book.price}</td>
                    <td className="px-4 py-2">{book.availability?"Yes":"No"}</td>
                    {
                     isAuthenticated && user?.role==="Admin" && (
                     <td className="px-4 py-2 flex space-x-2 my-3 justify-center ">
                      <BookA onClick={()=>openReadPopup(book._id)}/>
                      <NotebookPen onClick={()=>openRecordBookPopup(book._id)}/>
                     </td> 
                     )
                   }
                  </tr>
                ))
              }
             </tbody>
            </table>
           </div>
        ) : (
          <h3 className="text-3xl mt-5 font-medium">NO BOOKS FOUND</h3>
        )
       }
     </main>
     {addBookPopup && <AddBookPopup/>}
     {recordBookPopup && <RecordBookPopup bookId={borrowBookId}/>}
     {readBookPopup && <ReadBookPopup book={readBook} />}
  </>;
};

export default BookManagement;
