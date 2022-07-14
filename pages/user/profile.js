import React, { useEffect, useState } from 'react';
import UserProfile from '../../component/users/UserProfile'
// import { Oval } from 'react-loader-spinner';
import Router from 'next/router';
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function Profile() {
  const [isLogin, setisLogin] = useState(false);

  useEffect(() => {
    // first
    const userlogin = localStorage.getItem("userdetail");
    if (!userlogin) {
      setisLogin(false);
      Router.push("/");

    }
    else {
      setisLogin(true);
    }
  }, [])

  return (
    <>
      {isLogin ? <UserProfile /> : <div className='loader'> <span className="loader2"></span> </div>
        // {isLogin? <UserProfile /> :<div className='loader'> <Oval color="#f0f4fd"  height={50} width={50}  /> </div>

      }
    </>
  )
}

export default Profile;
