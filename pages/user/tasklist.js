import React, { useEffect, useState } from 'react';
import TaskList from '../../component/users/TaskList';
import Router, { useRouter } from 'next/router';
// import { Oval } from 'react-loader-spinner';
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


function Tasklist() {
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
      {isLogin ? <TaskList /> : <div className='loader'> <span className="loader2"></span> </div>
        // {isLogin? <TaskList/> :<div className='loader'> <Oval color="#f0f4fd"  height={50} width={50}  /> </div>

      }

    </>
  )
}

export default Tasklist;
