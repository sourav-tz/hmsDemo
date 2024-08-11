import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function CloseRoute({ children }) {
  const { data } = useSelector((state) => state.userStorage)
  console.log("is logged in "+typeof data +" "+data);
  
  if (data!=null) {
    return children
  } else {
    return <Navigate to="/"/>
  }
}

export default CloseRoute