import React,{useState, useEffect } from 'react';
import UserList from '../../component/admin/UserList';
import Router from 'next/router';

function Userslist() {
  const [isLogin, setisLogin] = useState(false);

  useEffect(() => {

    const adminlogin=localStorage.getItem("ucoreadmin");

     //   get admin login data
     const getLoginData=async()=>{
      console.log("admin login",adminlogin);

      if(!adminlogin){
        setisLogin(false);
          Router.push('/admin/login');
      }
      else{
        setisLogin(true);
      }
  }

  getLoginData();
  
  }, [])
  
  return(
      <>
      {isLogin ? <UserList/> : <div className='loader'> <span className="loader2"></span> </div>
        // {isLogin? <TaskList/> :<div className='loader'> <Oval color="#f0f4fd"  height={50} width={50}  /> </div>

      }
          
      </>
         
    
  )
}

export default Userslist;
