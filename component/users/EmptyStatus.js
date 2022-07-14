import React,{ useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md'
import Image from 'next/image'
import taskstatus from '../../pages/user/taskstatus';
import profilelogoimg from '../../public/profilelogo.png';
import emptytaskimg from '../../public/emptytask.png';
// import { IoAddOutline } from 'react-icons/io';
import { MdAdd } from 'react-icons/md';
import Router from 'next/router';
import AddTask from './AddTask';


function EmptyStatus(props) {
    const [isOpen, setisOpen] = useState(false);

    // const handleAddTask=()=>{
    //     setisOpen(true);
    //     // Router.push("/user/addtask");
    // }

   
  return(
    <>
       
   
      <div className='p-taskstatus'>
        <div className='emptytTaskimg'>
          <Image src={emptytaskimg} alt="images" layout='fixed' />     
        </div>

        <div className='emptydetails'>
          <p>It seems there are no task added yet</p>
          {/* <button type="submit"
          ><MdAdd /> Task Add</button> */}
        </div>    
      
        
      </div>  
        
     
      </>
  )
}

export default EmptyStatus;
