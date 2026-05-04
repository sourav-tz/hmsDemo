const intentAccessMap = {

    // ADMIN
    GET_ROOM_STUDENTS: "ADMIN",
    GET_ROOM_OCCUPANCY: "ADMIN",
  
    GET_COMPLAINTS: "ADMIN",
    COUNT_COMPLAINTS: "ADMIN",
  

    GET_STUDENT_INFO: "ADMIN",
  
    // STUDENT
    GET_MY_COMPLAINTS: "STUDENT",
    COUNT_MY_COMPLAINTS: "STUDENT",
    // PUBLIC
    GENERAL_INFO: "PUBLIC",
    GET_NOTICES: "PUBLIC",
  
    // fallback
    UNKNOWN: "PUBLIC"
  };
  
  module.exports = intentAccessMap;