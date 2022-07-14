
import React from 'react'
import { AiOutlineHome } from "react-icons/ai";
import { MdEventAvailable } from "react-icons/md";

import { MdOutlineContentPaste } from "react-icons/md";
import { RiListSettingsLine } from "react-icons/ri";
import { RiSettings4Line } from "react-icons/ri";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CgUserList } from "react-icons/cg";
import { FaTasks } from "react-icons/fa";
import Link from 'next/link'
import { useRouter } from "next/router";

const Navbar = (props) => {
    console.log("nav props",props.expand);

    const router = useRouter();

    return (
         <>
            <nav className={props.expand ? 'm-navbar expand' : 'm-navbar unexpand' }>
        
                <ul>
                   
                    <li>
                        <Link href="/admin/userslist">
                            <a>
                                <span className="icons"><CgUserList /></span>
                                <span className="linklabel">User List</span>

                                {/* <span className='submenuIcon'><MdOutlineKeyboardArrowDown/></span> */}
                            </a>
                          
                        </Link >

                            {/* <ul>
                                <li>
                                    <Link href="/admin/contributionpoint">
                                        <a> Add Points </a>
                                    </Link>
                                   
                                </li>
                                <li>
                                    <Link  href="/admin/userlisting">
                                        <a> user Listing</a>
                                    </Link>
                                  
                                </li>
                            

                            </ul> */}
      
                    </li>

                    <li>
                                               
                        <Link href="">
                                <a>
                                    <span className="icons"><FaTasks /></span>
                                    <span className="linklabel">Category</span>
                                    <span className='submenuIcon'><MdOutlineKeyboardArrowDown/></span>
                                </a>
    
                        </Link>  
                            
                            <ul>
                                <Link href="/admin/taskcategory">
                                    <li>
                                        <a> Add Task Category</a>                                   
                                    </li>
                                </Link>
                            
                               

                            </ul>
                                
                    </li>

                    <li>
                        <Link href="/">
                            <a>
                                <span className="icons"><RiSettings4Line /></span>
                                <span className="linklabel">Setting</span> </a>
                        </Link>
                    </li>  


                    {/* for Content */}
                    {/* <li>
                        <Link href="/">
                            <a>
                                <span className="icons"><MdOutlineContentPaste /></span>
                                <span className="linklabel">Content</span>
                                <span className='submenuIcon'><MdOutlineKeyboardArrowDown/></span>
                             </a>
                         
                        </Link>
                            <ul>
                                <li>
                                    Add Content
                                </li>
                                <li>
                                    Content Listing
                                </li>
                            

                            </ul>

                    </li> */}

               


                </ul>
            </nav>
        </>
    )
}

export default Navbar
