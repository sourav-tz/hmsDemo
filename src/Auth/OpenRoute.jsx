import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
const OpenRoute = ({ children }) => {
    const {data}=useSelector((state)=>state.userStorage)
    const role = localStorage.getItem('role');
    if (data!=null) {
      // If authenticated, redirect to home (or any other role-based page)
      if(role=="SuperAdmin"){
        return <div className="md:w-[94%] ml-auto"><Navigate to="/superAdminDashboard/main/home" replace /></div>;
    }else if(role=="Hostel-Authority"){
        return <div className="md:w-[94%] ml-auto"><Navigate to="/adminDashboard/main/home" replace /></div>;
    }else if(role=="Student"){
          return <div className="md:w-[94%] ml-auto"><Navigate to="/studentDashboard/main/home" replace /></div>;
      }
    }  
    return children;
  };

export default OpenRoute