import React,{ useState, useEffect } from 'react';
import AdminLogin from '../../component/admin/Login';
import Router from 'next/router';

function Login() {
  const [loginStatus, setLoginStatus] = useState(true);

  
  useEffect(()=>{

    const Adminlogin = localStorage.getItem("ucoreadmin");
        
    const getData=async()=>{
        console.log("admin login",Adminlogin);

        if(Adminlogin != null){
            setLoginStatus(false);
            Router.push('/admin/userslist');
        }
        else{
            setLoginStatus(true);
        }
    }
    getData();

}, [])

  return(   
      <div>
        {loginStatus ? <AdminLogin/>:<div className='loaderAdmin'> <span className="loader2"></span> </div>
            
        }
         
      </div>

  
  ) 
}

export default Login;
