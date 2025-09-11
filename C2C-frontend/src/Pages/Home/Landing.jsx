import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Page1 from './Page1'
import { LoginPopUp } from '@/components/LoginPopUp'

function Landing() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleOpenLogin = () => {
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <>
      <Navbar onLoginClick={handleOpenLogin} />  
      <Page1 />
      <LoginPopUp isOpen={isLoginOpen} onClose={handleCloseLogin} />
    </>
  )
}

export default Landing;
