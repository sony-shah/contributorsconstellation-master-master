// import React from 'react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { IoIosAddCircleOutline } from "react-icons/io"
import { MdDashboard } from "react-icons/md"
import { FaUserCircle } from "react-icons/fa"
import { BiUserCircle } from "react-icons/bi"
import { MdOutlineAddCircleOutline } from "react-icons/md"
import { FaRegUser } from "react-icons/fa"
import { IoIosAddCircle } from "react-icons/io"
import { VscHome } from "react-icons/vsc"
import AddTask from './users/AddTask';
import loginbg from '../public/loginScreenBg.jpg';
import Image from 'next/image';
import { useRouter } from "next/router";


function Footer() {
  const [isOpen, setisOpen] = useState(false);
  const router = useRouter();

  function openbox(item) {
    setisOpen(item)
  }

  
  return (
    <>
      <section className='m-footer con-row'>
        <div className='footerbg'> <Image src="/loginScreenBg.jpg" alt='loadingimg'width={30} height={100} layout='responsive' /></div>
     
        <div className='container'>
          <ul>
            <li>
              <Link href="/user/tasklist">
                <a className={router.pathname == "/user/tasklist" ? "active" : ""}>
                  <span className="icons"><MdDashboard /></span>
                </a>
              </Link>
            </li>

            <li onClick={() => setisOpen(true)}>
                  <span className="icons"><IoIosAddCircle /></span>

            </li>

            <li>
              <Link href="/user/profile" >
                <a className={router.pathname == "/user/profile" ? "active" : ""}>
                  <span className="icons"><BiUserCircle /></span>

                </a>
              </Link>
            </li>
          </ul>

        </div>


      </section>
      <AddTask openBox={openbox} isopen={isOpen} />
    </>
  )
}

export default Footer;
