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


function AddTask(props) {
    // console.log("is Open status", props);

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

    // const DatePickerCustomInput = (onClick) => <div className="calendar_icon"><FiCalendar onClick={onClick} /></div>);



    const handleBackbtn = (e,data) => {
        // setisOpen(false)
        // Router.back();
        let randomString = Math.random().toString(36);

        props.openBox(data);
        settaskName("");
        settaskDate("");
        setdiscription("");
        setstartTime("");
        setendTime("");
        setfileName("");
        setinputFile("");
        setImageUrls("");
        setTaskCategory("");
        setImages(randomString);
        setProgress(0);
        setaddTaskLoading(false);
    }

    //upload multi
    const handleUpload = () => {
        const promises = [];
        setImageUrls("");
        setuploadbtnload(true);

        images.map((image) => {
            // const storageRef = ref(storage, 'images/rivers.jpg');
            const storageRef = ref(storage, `/${image.name}`)

            // const storageRef = ref(storage,`images/${image.name}`).put(image);
            const uploadTask = uploadBytesResumable(storageRef, image);
            promises.push(uploadTask);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);

                },
                (error) => {
                    console.log(error);
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    //   console.log('File available at', downloadURL);
                    getDownloadURL(uploadTask.snapshot.ref).then((urls) => {
                        //   setUrls((prevState) => [...prevState, urls]);
                        setImageUrls((imagesurls) => [...imagesurls, urls]);
                        //   setUrls( [...urls, urls]);


                    });

                },


            );

        });

        Promise.all(promises)
            .then(() => {
                setuploadimagestate(true);
                setuploadbtnload(false);
            })
            // {
            // if(urls===""){
            //     setImgFileError(true);
            // }else{
            //    ;
            // }
            // })
            .catch((err) => console.log(err));

    };

    const handleChange = (e) => {
        setImages("");
        setuploadimagestate(false);
        // setImages(event.target.files[0])
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            
            newImage["id"] = Math.random();
            setImages((images) => [...images, newImage]);
        }

        // handleUpload()

    };
    console.log("image: ", images);
    console.log("urls", imageurls);
    // const getFiles = (files) => {
    //     const onlybaseimage = files.map((bseed)=>bseed.base64)
    //     setinputFile(onlybaseimage);
    //     // console.log("files");
    // }

    // task add 
    const HandletaskAdd = async (e) => {
        e.preventDefault()
        const isLogin = localStorage.getItem("userdetail");
        const usersDetails = JSON.parse(isLogin);
        const phoneNum = usersDetails.phoneNum;
        const username = usersDetails.username;
        // handleUpload()
        // const taskDate=new Date();
        //   const taskDate = moment(Date(), 'DD-MM-YYYY');
        let newDate = new Date();
        
        const ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(newDate);
        const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(newDate);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(newDate);

        const taskDate =`${da}-${mo}-${ye}`;

        const data = {
            username: username,
            phoneNum: phoneNum,
            taskName: taskName,
            taskDate: taskDate,
            discription: discription,
            TaskStartTime: startTime,
            taskEndTime: endTime,
            taskCategory: taskCategory,
            urls: imageurls,
            ContributionPoints: points,
            TaskStatus: status,
            createdAt: Timestamp.now(),
        }

        if (uploadimagestate === true) {
            setaddTaskLoading(true);

            const newCityRef = doc(collection(db, phoneNum));
            console.log("task", data);
            await setDoc(newCityRef, data);

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your task has been added successfully',
                showConfirmButton: false,
                timer: 2000
            }).then(function () {
                //alert('done');
                props.openBox(false);
            });

            settaskName("");
            settaskDate("");
            setdiscription("");
            setstartTime("");
            setendTime("");
            setImageUrls("");
            setTaskCategory("");
            setImages("");
            setProgress(0);
            setaddTaskLoading(false);
        }

        if (uploadimagestate === false) {

            Swal.fire({
                position: 'center',
                icon: 'warning',
                text: "Kindly upload image first",
                showConfirmButton: false,
                timer: 3000
            })
            // alert("image not upload")
        }


        // }
        // setisOpen(false);
        // props.openBox(false);
        // // Router.push("/user/tasklist");
    }
    // const ExampleCustomInput = ({ value, onClick }) => (
    //     <button className="example-custom-input" onClick={onClick}>
    //       {value}
    //     </button>
    //   );

     // get businesscategory data function
     const GetTaskCategory = (e) => {
        const target = event.target.value;
        setTaskCategory(target);
        console.log(taskCategory);
    }

    useEffect(() => {
        const getContent = async () => {
            const data = await getDocs(collection(db, "TaskCategory"));
            setTaskcategorydata(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            console.log("TaskData:", data);
        };
        getContent();
    }, []);

    useEffect(() => {
        // localhost
        const isLogin = localStorage.getItem("userdetail");
        const usersDetails = JSON.parse(isLogin);
        const phoneNum = usersDetails.phoneNum;
        const username = usersDetails.username;

        // get all data from firebase
        const getAllDoc = async () => {
            const querySnapshot = await getDocs(collection(db, phoneNum));
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
            });
        }

        getAllDoc();

    }, [])

    return (
        <>
            <section className={"c-addtask " + (props.isopen ? 'show' : "hidden")}>
                {/* <div className='footerbg'> <Image src="/loginScreenBg.jpg" alt='loadingimg' width={30} height={100} layout='responsive' /></div> */}
                <div className='sectionHeading'>
                    <div>
                        <span onClick={() => handleBackbtn(false)} ><MdArrowBackIosNew /></span>
                        <h4>Add Task</h4>
                    </div>
                </div>

                <div className='container'>

                    <form onSubmit={HandletaskAdd}>
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
                                 <li>
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
                                </li>



                                {/* discription */}
                                <li>
                                    <label>DESCRIPTION<sup>*</sup>
                                        <textarea type="text"
                                            required
                                            value={discription}
                                            name="discription"
                                            onChange={(event) => {
                                                setdiscription(event.target.value)
                                            }} />

                                        {DiscriptionError ? <p>Discription is required</p> : null}
                                    </label>
                                </li>

                                  {/* date */}
                                <li>
                                    <label>DATE<sup>*</sup>
                                 
                                    <DatePicker
                                                selected={taskDate}
                                                value={taskDate}                               
                                                onChange={(date) => settaskDate(date)}
                                                timeIntervals={15}
                                                defaultValue =""
                                                required
                                                dateFormat="d-MMMM-yy"
                                                placeholderText="Click to select a date"
                                                maxDate={moment().toDate()}
                                                isClearable
                                                
                                                // customInput={<DatePickerCustomInput ref={ref}/>}
                                                />

                                        {/* <input type="date"
                                            value={taskDate}
                                            required
                                            name="date"
                                            max={moment().format("YYYY-MM-DD")}  //future date cannot be selected by user
                                            onChange={(event) => {
                                                settaskDate(event.target.value)

                                            }} /> */}


                                        {DateError ? <p> Date is required</p> : null}
                                    </label>
                                </li>                

                                {/* start-end time */}
                                <li>
                                    <div className='time'>
                                        <label>START TIME<sup>*</sup>
                                            <input type="time"
                                                value={startTime}
                                                required
                                                name="starttime"
                                                onChange={(event) => { setstartTime(event.target.value) }} />
                                            {startTimeError ? <p> Time is required</p> : null}
                                        </label>

                                    </div>


                                    {/* end time */}
                                    <div>
                                        <label>END TIME<sup>*</sup>
                                            <input type="time"
                                                value={endTime}
                                                required
                                                name="endtime"
                                                onChange={(event) => {
                                                    setendTime(event.target.value)
                                                }} />
                                            {endTimeError ? <p> Time is required</p> : null}

                                        </label>

                                    </div>

                                </li>

                              


                                {/* upload task images */}
                                <li className="custom-upload" htmlFor="file-upload">

                                    <label>TASK IMAGE </label>
                                    <div className="upload-multi-file">
                                        {/* <label htmlFor="file-upload" className='custom-file-upload'>Select File</label> */}

                                        <input type="file"
                                            id="file-upload"
                                            // multiple
                                            // required
                                            onClick={e => (e.target.value = null)}
                                            onChange={handleChange}
                                            accept= "image/x-png,image/gif,image/jpeg,application/pdf,application/msword"
                                            key={ images || '' }
                                             />

                                        
                                        { images && images.length > 0 ? <span className="images-btn" onClick={handleUpload}>{uploadbtnload ? "Uploading..." : "Upload"}</span> :  <label>(only png, jpeg, jpg, pdf, doc) </label>  }
                                    </div>
                                     

                                    {/* <progress value={progress} /> */}


                                </li>

                                {/* <span id="file-upload">no file choosen</span> */}
                                <li className='imag'>
                                    {imageurls && imageurls.map((url, i) => (
                                        <div className='imgDesc'>
                                            <img
                                                key={i}
                                                src={url || "http://via.placeholder.com/300"}
                                                alt="firebase-image"
                                            />
                                        </div>
                                    ))}
                                </li>



                                {ImgFileError ? <p> Image File is required</p> : null}

                            </ul>
                        </div>


                        {/* submit button */}
                        <div className="submitTask">
                            <button type="submit"  > {addTaskLoading ? "Submitting..." : "SUBMIT"}</button>

                        </div>

                    </form>


                </div>

            </section>
        </>
    );
}
// disabled={taskName==="" || taskDate==="" || discription==="" || startTime==="" || endTime==="" || inputFile==="" ? true:false}
export default AddTask
