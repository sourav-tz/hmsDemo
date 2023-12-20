import { useEffect } from 'react';
import Routing from './Routes/Routing';
import { useNavigate } from 'react-router-dom';

function App() {

  const Navigator = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('role')!==undefined && localStorage.getItem('role') === 'Admin'){
      Navigator('/Adminlogin');
    }
  },[])

  return (
    <>
    <Routing />
    </>
  )
}

export default App
