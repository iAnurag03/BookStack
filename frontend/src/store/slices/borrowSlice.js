import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const borrowSlice = createSlice({
    name:"borrow",
    initialState:{
        loading:false,
        error:null,
        userBooks:[],
        allBorrowedBooks:[]
    },
    reducers:{
          fetchUserBooksRequest(state){
            state.loading=true;
            state.error=null;
            state.message=null;
          },
          fetchUserBooksSuccess(state,action){
             state.loading=false;
             state.userBooks=action.payload;
          },
          fetchUserBooksFailed(state,action){
            state.loading=false;
            state.error=action.payload;
          },
          recordBookRequest(state){
              state.loading=true;
              state.error=null;
              state.message=null;
          },
          recordBookSuccess(state,action){
              state.loading=false;
              state.message=action.payload;
          },
          recordBookFailed(state,action){
             state.loading=false;
             state.error=action.payload;
             state.message=null;
          },
          fetchAllBorrowedBooksRequest(state){
            state.loading=true;
            state.error=null;
            state.message=null;
          },
          fetchAllBorrowedBooksSuccess(state,action){
             state.loading=false;
             state.allBorrowedBooks=action.payload;
          },
          fetchAllBorrowedBooksFailed(state,action){
            state.loading=false;
            state.error=action.payload;
            state.message=null;
          },
          returnBookRequest(state){
              state.loading=true;
              state.error=null;
              state.message=null;
          },
          returnBookSuccess(state,action){
              state.loading=false;
              state.message=action.payload;
          },
          returnBookFailed(state,action){
             state.loading=false;
             state.error=action.payload;
             state.message=null;
          },
          resetBorrow(state){
            state.loading=false;
            state.error=null;
            state.message=null;
          }
    },
});

export const fetchUserBooks = ()=>async(dispatch)=>{
     dispatch(borrowSlice.actions.fetchUserBooksRequest());
     await axios.get("http://localhost:4000/api/v1/borrow/my-books", {
        withCredentials:true
     }).then((res)=>{
        dispatch(borrowSlice.actions.fetchUserBooksSuccess(res.data.borrowedBooks))
     }).catch((err)=>{
        dispatch(borrowSlice.actions.fetchUserBooksFailed(err.response.data.message))
     });
}

export const fetchAllborroweBooks = ()=>async(dispatch)=>{
     dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
     await axios.get("http://localhost:4000/api/v1/borrow/record-borrowed-books-all", {
        withCredentials:true
     }).then((res)=>{
        dispatch(borrowSlice.actions.fetchAllBorrowedBooksSuccess(res.data.borrowedBooks))
     }).catch((err)=>{
        dispatch(borrowSlice.actions.fetchAllBorrowedBooksFailed(err.response.data.message))
     });
}

export const recordBorrowedBook=(email,id)=>async(dispatch)=>{
      dispatch(borrowSlice.actions.recordBookRequest());
      axios.post(`http://localhost:4000/api/v1/borrow/record-borrowed-books/${id}`,{email},{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json",
        },
      }).then((res)=>{
        dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
      }).catch((err)=>{
        dispatch(borrowSlice.actions.recordBookFailed(err.response.data.message))
      });
}

export const returnBook=(email,id)=>async(dispatch)=>{
     dispatch(borrowSlice.actions.returnBookRequest());
     await axios.put(`http://localhost:4000/api/v1/borrow/return-book/${id}`, {email}, {
        withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
     }).then((res)=>{
        dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));
     }).catch((err)=>{
        dispatch(borrowSlice.actions.returnBookFailed(err.response.data.message));
     });
};

export const resetBorrowSlice =()=>(dispatch)=>{
    dispatch(borrowSlice.actions.resetBorrow());
};

export default borrowSlice.reducer;