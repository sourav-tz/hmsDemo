import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  modalState: false,
  searchQuery:{firstName:'',lastName:'',rollNo:'',courseId:'',state:''},
  modalData:{
    "rollNo": 4,
    "firstName": "Emily",
    "lastName": "Williams",
    "year": 3,
    "email": "emily.williams@email.com",
    "lastUpdatedBy": "your_last_updated_by_value",
    "createdAt": "2024-01-13T09:26:26.000Z",
    "last_updated_at": "2024-01-13T09:26:26.000Z",
    "courseId": null,
    "hostelNo": 11,
    "roomId": null,
    "profile": {
        "rollNo": 4,
        "bloodGroup": "B",
        "identificationMark": "no",
        "gender": "female",
        "pEmail": "parent4@email.com",
        "subAddress": "Red Street",
        "city": "Bangalore",
        "state": "Karnataka",
        "pinCode": 560001,
        "contactNumber": "6543210987",
        "secondaryContact": "6666666666",
        "fatherName": "David",
        "fatherContact": "6543210987",
        "fatherOccupation": "Scientist",
        "motherName": null,
        "motherContact": "6543210988",
        "motherOccupation": "Engineer",
        "dob": "1988-04-05",
        "addharNumber": null,
        "photoLink": null,
        "lastUpdatedBy": "your_last_updated_by_value",
        "createdAt": "2024-01-13T09:26:26.000Z",
        "last_updated_at": "2024-01-13T09:26:26.000Z"
    }
},
}

export const viewInfoSlice = createSlice({
  name: 'viewInfoStates',
  initialState,
  reducers: {
    changeModalState:(state,action)=>{
        state.modalState = action.payload;
    },
    setSearchQuery:(state,action)=>{
        state.searchQuery = action.payload;
        console.log(state.searchQuery);
    },
    setModalData:(state,action)=>{
      state.modalData = action.payload;
    },
    resetQuery:(state)=>{
      state.searchQuery = {firstName:null,lastName:null,rollNo:null,courseId:null,state:null};
    }
  },
})

// Action creators are generated for each case reducer function
export const { changeModalState,setSearchQuery,setModalData,resetQuery } = viewInfoSlice.actions

export default viewInfoSlice.reducer