import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { collection, ref, push, addDoc, setDoc, doc, docs, getDocs, arrayUnion, getDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { auth } from '../../firebaseConfig';

import { MdArrowBackIosNew } from 'react-icons/md'
import { BiErrorCircle } from 'react-icons/bi'
import { BiTimeFive } from 'react-icons/bi'
import { RiCheckboxCircleLine } from 'react-icons/ri'
import { MdErrorOutline } from 'react-icons/md'
import { MdOutlineDateRange } from 'react-icons/md'

import emptytaskimg from '../../public/emptytask.png';
import { MdAdd } from 'react-icons/md';
// import backgroundimg from '../../public/backgroundfinal.jpeg'
import Footer from '../footer';
import Link from 'next/link'
import Swal from 'sweetalert2';
import AddTask from './AddTask';
import EmptyStatus from './EmptyStatus';
import Router from 'next/router';

const db = getFirestore();

function TaskList() {

    // const [phoneNum, setphoneNum] = useState("");
    const [username, setusername] = useState("");
    const [taskName, settaskName] = useState("");
    const [taskDate, settaskDate] = useState("");
    const [discription, setDiscription] = useState("");
    const [startTime, setstartTime] = useState("");
    const [endTime, setendTime] = useState("");
    const [points, setpoints] = useState(0);
    const [totalCP, setTotalCP] = useState(0)
    const [status, setStatus] = useState(false);
    const [emptyTask, setEmptyTask] = useState(false);
    const [isOpen, setisOpen] = useState(false);
    const [inputFile, setinputFile] = useState([]);
    const [urls, setUrls] = useState([]);
    const [fileName, setfileName] = useState("No file choosen");
    const [LoadingData, setLoadingData] = useState(true);
    const [LoadingImages, setLoadingImages] = useState(true);
    const [loginStatus, setLoginStatus] = useState(true);


    // store data in array for map
    const [tasks, setTasks] = useState([]);
    let dt = new Date().toLocaleDateString();
    let tm = new Date().toLocaleTimeString();
    // const = new Date().toLocaleDateString();

    const HandleopenImage = async (e) => {
        e.preventDefault()

        const isLogin = localStorage.getItem("userdetail");
        const usersDetails = JSON.parse(isLogin);

        const phoneNum = usersDetails.phoneNum;
        const username = usersDetails.username;
        console.log(username);

        const data = {

            username: username,
            taskName: taskName,
            taskDate: taskDate,
            discription: discription,
            TaskStartTime: startTime,
            taskEndTime: endTime,
            imageName: fileName,
            imageUrl: inputFile,
            urls: urls,
            TaskStatus: status,


        }
        const newCityRef = doc(collection(db, phoneNum));
        console.log("task", data);
        await getDoc(newCityRef, data);

    }

    const handleOnclickimg=(url)=>{
    console.log("pop", url);
        Swal.fire({
        // title: 'Sweet!',
        // text: 'Modal with a custom image.',
        imageUrl: url,
        imageWidth: 400,
       
        imageAlt: 'Custom image',
        })
}

    useEffect(() => {
        // setLoadingData(true);
        // //localhost
        const isLogin = localStorage.getItem("userdetail");
        const usersDetails = JSON.parse(isLogin);
        const phoneNum = usersDetails.phoneNum;
        const username = usersDetails.username;
        setusername(usersDetails.username);


        // console.log("test",isLogin);

        // if(!isLogin){
        //     setLoginStatus(true);
        //     // alert("check if you have already logged in!")
        //     Router.push('/user/login');
        // }
        // else{
        //     setLoginStatus(false);   
        // }
        // get all data from firebase
        const getAllDocument = async () => {
            setLoadingData(true);
            setLoadingImages(true);

            const q = query(collection(db, phoneNum), orderBy('createdAt', 'desc'))

            onSnapshot(q, (snapshot) => {
                console.log("Task List", snapshot);
                setTasks(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

                //setTotalCP(snapshot.docs.map((doc) => ({ ...doc.data() , id: doc.id})));

                const totalCPoints = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                const summall = totalCPoints.reduce((total, item) => {
                    return total + item.ContributionPoints;
                }, 0)

                console.log("tottal points", summall);

                setTotalCP(summall);
                setLoadingData(false);
                setLoadingImages(false);
            })

            console.log(tasks);




            // const pricesArray = tasks.map(item=>item.ContributionPoints);
            // console.log(pricesArray.flat().reduce((acc,sum)=>acc+sum));
        }




        getAllDocument();
    }, [])

    return (
        <>
            {/* {loginStatus ? null:<section className='loadingScreen'>
            <div className='loadbg'> */}
            {/* <Image src={loginbg} alt='loadingimg' layout='responsive' /> */}
            {/* <p>checking if you are already loggedIn</p>     
                   
            </div>
           
        </section>
    } */}
            <section className='c-tasklist'>
                <div className='footerbg'> <Image src="/loginScreenBg.jpg" alt='loadingimg' width={30} height={100} layout='responsive' priority="true" /></div>
                <div className='sectionHeading'>
                    <div>

                        <h4>{username}</h4>
                    </div>
                    <h3>{totalCP}</h3>
                </div>

                <div className='container'>
                    {LoadingData ? <div className='loader'> <span className="loader2"></span> </div> :
                        <>
                            {/* { LoadingData ? "Loading Data..." :  */}
                            <h4>Total Number of task: {tasks.length} </h4>
                            {tasks.length < 1 ?
                                <div className='p-taskstatus'>
                                    <div className='emptytTaskimg'>
                                        <Image src={emptytaskimg} alt="images" layout='fixed' />
                                    </div>

                                    <div className='emptydetails'>
                                        <p>It seems there are no task added yet</p>
                                        {/* <button type="submit"
                          ><MdAdd /> Task Add</button> */}
                                    </div>


                                </div> :
                                <ul>

                                    {

                                        tasks && tasks.map(taskdata => {

                                            console.log("taskdata", taskdata);
                                            // const CpArray= taskdata.ContributionPoints.flat().reduce((acc,sum)=>acc+sum)
                                            // const pricesArray = tasks.map(item=>item.ContributionPoints);
                                            // console.log(CpArray.flat().reduce((acc,sum)=>acc+sum));
                                            // console.log(taskdata.ContributionPoints.reduce((acc,sum)=>acc+sum));
                                            // const imageUrl = taskdata.imageUrl;
                                            // console.log(imageUrl);

                                            return (

                                                <li>
                                                    <div className='c-taskCard'>
                                                        <h3>
                                                            {taskdata.TaskStatus ? <span className='approved'>Approved<RiCheckboxCircleLine /></span> : <span className='pending'>Pending<BiErrorCircle /></span>}

                                                            {taskdata.TaskStatus ? <abbr>CP: {taskdata.ContributionPoints}</abbr> : null}

                                                        </h3>
                                                        <h2>{taskdata.taskName}</h2>
                                                        <p>{taskdata.discription}</p>

                                             <div className='cardImg'>
                                           
                                                            <>
                                                            {taskdata.urls && taskdata.urls.map((url, i) => (
                                                                console.log("imageurls", url),
                                                                
                                                                <div  onClick={() => handleOnclickimg(url)} className=''>
                                                              
                                                                    <img
                                                                        key={i}
                                                                        src={url}
                                                                        alt="firebase-image" />
                                                            
                                                                </div>
                                                            ))}
                                                            </>

                                                

                                                        </div>
                                                            


                                                        <ul>
                                                            <li>
                                                                <span><BiTimeFive /></span>
                                                                <p>{taskdata.TaskStartTime}</p>-
                                                                <p>{taskdata.taskEndTime}</p>
                                                            </li>
                                                            <li>
                                                                <span><MdOutlineDateRange /></span>
                                                                <p>{taskdata.taskDate}</p>
                                                            </li>
                                                        </ul>

                                                        <Link href={"taskdetails/[eid]"} as={"taskdetails/" + taskdata.id}>
                                                            <a ></a>

                                                        </Link>

                                                    </div>
                                                </li>

                                            );
                                        })
                                    }
                                </ul>}

                        </>
                    }
                </div>
            </section>
            <Footer />

        </>

    );
}

export default TaskList
