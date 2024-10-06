import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

// function CloseRoute({ children }) {
//   const { data } = useSelector((state) => state.userStorage)
//   console.log("is logged in "+typeof data +" "+data);
  
//   if (data!=null) {
//     return <div className="md:w-[94%] ml-auto">{children}</div>
//   } else {
//     return <Navigate to="/"/>
//   }
// }

// export default CloseRoute

function CloseRoute({children}){
  const {data}=useSelector((state)=>state.userStorage)
  const role = localStorage.getItem('role');
  if (data==null) {
    // If not authenticated, redirect to login
    if(role=="SuperAdmin"){
      return <Navigate to="/superAdminLogin" replace />;
    }else if(role=="Hostel-Authority"){
      return <Navigate to="/adminLogin" replace />;
    }else if(role=="Student"){
      return <Navigate to="/studentLogin" replace />;
    }
  }

  return <div className="md:w-[94%] ml-auto">{children}</div>;
}
export default CloseRoute