import React, { useEffect, useState } from 'react';
import AddTask from '../../component/users/AddTask';
import Router, { useRouter } from 'next/router';
// import { Oval } from 'react-loader-spinner';
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


function AddTasks() {
  const [isLogin, setisLogin] = useState(false);

  useEffect(() => {
    // first
    const userlogin = localStorage.getItem("userdetail");
    if (!userlogin) {
      setisLogin(false);
      Router.push("/");

    }
    else{
      setisLogin(true);
    }
  }, [isLogin])
  
  return (
    <>
    {/* <span class="loader2"></span> */}
  
      {isLogin? <AddTask /> :<div className='loader'> <span className="loader2"></span> </div>

}
    </>
    
      
  
  );
}
// import React from 'react'

// function AddTask() {
//   return (
//     <div><span class="loader2"></span></div>
//   )
// }

// export default AddTask

export default AddTasks;
