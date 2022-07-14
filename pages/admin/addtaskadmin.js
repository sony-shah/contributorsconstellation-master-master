import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import firebaseApp from '../../firebaseConfig';
import { collection, push, addDoc, setDoc, doc, docs, getDocs, deleteDoc, arrayUnion, getDoc, updateDoc, query, Timestamp, orderBy } from "firebase/firestore";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth } from '../../firebaseConfig';
import { MdArrowBackIosNew } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { GrAddCircle } from 'react-icons/gr'
import Swal from 'sweetalert2'
import Router from 'next/router';
import moment from 'moment';
import FileBase64 from 'react-file-base64';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";
const storage = getStorage();
const db = getFirestore();

function AddTaskAdmin(props) {
 // const taskaddid = addtaskid.addtask;
    // console.log("taskid:", addtaskid.addtaskid);
  
  const [phoneNum, setphoneNum] = useState("");
  const [username, setusername] = useState("");
  const [taskName, settaskName] = useState("");
  const [taskDate, settaskDate] = useState("");

   // const [startDate, setStartDate] = useState();
   const [discription, setdiscription] = useState("");
   const [startTime, setstartTime] = useState("");
   const [endTime, setendTime] = useState("");
   const [inputFile, setinputFile] = useState("");
   const [fileName, setfileName] = useState("no file choosen");
   const [points, setpoints] = useState(0);
   const [status, setstatus] = useState(false);
   const [singleUser, setSingleuser] = useState("");
   const [isOpen, setisOpen] = useState(true);
   const [addTaskLoading, setaddTaskLoading] = useState(false);
   const [images, setImages] = useState([]);
    const [imageurls, setImageUrls] = useState([]);
    const [progress, setProgress] = useState(0);

    const [uploadbtnload, setuploadbtnload] = useState(false);

    // error message for all input
    const [nameError, setnameError] = useState(false);
    const [DateError, setDateError] = useState(false);
    const [DiscriptionError, setDiscriptionError] = useState(false);
    const [CategoryError, setCategoryErrorError] = useState(false);
    const [startTimeError, setStartTimeError] = useState(false);
    const [endTimeError, setEndTimeError] = useState(false);
    const [ImgFileError, setImgFileError] = useState(false);
    const [uploadimagestate, setuploadimagestate] = useState("");

    const [LoadingData, setLoadingData] = useState(true);
    const [taskCategory, setTaskCategory] = useState('');
    const [Taskcategorydata, setTaskcategorydata] = useState([]);
   


    
  //   const handleBackbtn = (e,data) => {
  //     // setisOpen(false)
  //     // Router.back();
  //     let randomString = Math.random().toString(36);

  //     props.openBox(data);
  //     settaskName("");
  //     settaskDate("");
  //     setdiscription("");
  //     setstartTime("");
  //     setendTime("");
  //     setfileName("");
  //     setinputFile("");
  //     setImageUrls("");
  //     setTaskCategory("");
  //     setImages(randomString);
  //     setProgress(0);
  //     setaddTaskLoading(false);
  // }

  return (
   <section className={"c-addtaskadmin " + (props.isopen ? 'show' : 'hidden')} >

        <div className='sectionHeading'>
                    <div>
                        {/* <span onClick={() => handleBackbtn(false)} ><MdArrowBackIosNew /></span> */}
                        <h4>Add Task</h4>
                    </div>
        </div>
        <div className='container'>

<form >
    <div className='form-row'>
        <ul className='form-textfield'>

            {/* add task */}

            <li>
                <label>TASK NAME<sup>*</sup>
                    <input type="text"
                        required
                        value={taskName}
                        name="taskname"
                        onChange={(event) => {
                            settaskName(event.target.value)

                        }}
                    />
                    {nameError ? <p>Task Name is required</p> : null}
                </label>
            </li>

             {/* task category */}
             {/* <li>
                <label>TASK CATEGORY<sup>*</sup>
                   <div className='multipleitem'>

                        <select onChange={GetTaskCategory}>
                            <option selected>Select Task Category</option>
                            {
                                Taskcategorydata && Taskcategorydata.map(categoryData => {
                                    //console.log(formUser);
                                    return (

                                        <option  className='option-value' value={categoryData.businessCategory} onClick={(e) => GetTaskCategory(categoryData)}>{categoryData.taskCategory}</option>

                                    )
                                })
                            }
                        </select>

                    </div>     

                    {CategoryError ? <p>Category is required</p> : null}
                </label>
            </li> */}





        </ul>
    </div>


    {/* submit button */}
    <div className="submitTask">
        <button type="submit"  > {addTaskLoading ? "Submitting..." : "SUBMIT"}</button>

    </div>

</form>


</div>

   </section>
  )
}

export default AddTaskAdmin

