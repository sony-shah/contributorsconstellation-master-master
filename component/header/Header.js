import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { BiLogOutCircle } from 'react-icons/bi'
import { IoMdLogIn } from 'react-icons/io'
import Link from 'next/link'
import Router from 'next/router'
  import Swal from 'sweetalert2';



const Header = () => {
    const [isOpen, setisOpen] = useState(false);

    const handleLogout=()=>{

        Swal.fire({
            title: 'Logout!',
            text: "Are you sure you want to logout?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                position: 'middle',
                icon: 'success',
                title: 'Logout',
                showConfirmButton: false,
                timer: 1500

              }) 
              
              localStorage.removeItem("ucoreadmin");
              Router.push("/admin/login");      
                
             
            }
          },
          
          )
          
          
       
        
    }

    return (
        <header className="wrapper m-header">      {/* header */}
        <div className="headerLeft"> 
                   
        </div>
        <div className="headerRight">
            
            {/* <button className="profile">
                <span>Logout</span>
            </button> */}

            <div>
                <button onClick={handleLogout}><span className='icon-rotate-90'><BiLogOutCircle /></span>Logout</button>
            </div>

             {/* <div>
                <span className='icon-rotate-90'><BiLogOutCircle /></span>
                <Link href="/admin/login">
                     <a>Logout</a>
                </Link>
            </div> */}
           
            
          
        </div>
     </header>
     
    )
}

export default Header
