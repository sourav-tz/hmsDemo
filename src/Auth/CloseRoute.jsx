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
  // console.log("role"+role);
  //   console.log(JSON.stringify(data));
  //   console.log(children);

  if (data==null) {
    // If not authenticated, redirect to login
    if(role=="SuperAdmin"){
      return <Navigate to="/superAdminLogin" replace />;
    }else if(role=="Hostel-Authority"){
      return <Navigate to="/adminLogin" replace />;
    }else if(role=="Student"){
      return <Navigate to="/studentLogin" replace />;
    }else if(role=="TempStudent"){
      return <Navigate to="/studentLogin" replace />;
    }
    // return <Navigate to="/" replace/>;
  }

  // Special handling for TempStudent - restrict access to only self-profiling page
  if (data?.roleType === 'TempStudent' || role === 'TempStudent') {
    const currentPath = window.location.pathname;
    if (currentPath !== '/studentDashboard/main/selfProfiling') {
      console.log('TempStudent trying to access restricted page:', currentPath);
      return <Navigate to="/studentDashboard/main/selfProfiling" replace />;
    }
  }

  return <div className="md:w-[94%] ml-auto">{children}</div>;
}
export default CloseRoute