import React,{useState,useEffect} from 'react';
import Image from 'next/image';
import firebaseApp from '../../../firebaseConfig';
import { MdArrowBackIosNew, MdSignalWifiStatusbarNull } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { FiSave } from 'react-icons/fi';
import { BiErrorCircle } from 'react-icons/bi'
import { RiCheckboxCircleLine } from 'react-icons/ri'
import { MdErrorOutline } from 'react-icons/md'
import Swal from 'sweetalert2';
import { collection, push, addDoc, setDoc, doc,docs, getDocs, getDoc,arrayUnion, updateDoc,query,Timestamp,orderBy, deleteDoc} from 'firebase/firestore';
import {getFirestore, onSnapshot} from 'firebase/firestore';
import {getStorage, getDownloadURL, ref, uploadBytesResumable, uploadString } from "firebase/storage";
import { async } from '@firebase/util';
import Footer from '../../../component/footer';
import Router from 'next/router';
import moment from 'moment';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar } from "react-icons/fi";


const db=getFirestore();
const storage = getStorage();

function TaskEdit({ taskid }) {
    const TaskId = taskid.eid;
    // console.log("taskid:",TaskId);

    const [tasks, setTasks] = useState([]);
    const [isedit, setEdit] = useState(true);
    const [taskName, settaskName] = useState("");
    const [taskDate, settaskDate] = useState("");
    const [discription, setdiscription] = useState("");
    const [startTime, setstartTime] = useState("");
    const [endTime, setendTime] = useState("");
    const [inputFile, setinputFile] = useState("");
    const [points, setpoints] = useState(0);
    const [status, setStatus] = useState(false);   
    const [singleUser,setSingleuser]=useState("");
    const [images, setImages] = useState([]);
    const [imageurls, setImageUrls] = useState([]);
    const [progress, setProgress] = useState(0);
    const [uploadimagestate, setuploadimagestate] = useState(true);
    const [uploadbtnload, setuploadbtnload] = useState(false);

    const [taskCategory, setTaskCategory] = useState('');
    const [Taskcategorydata, setTaskcategorydata] = useState([]);
    const [taskcategorydetails, settaskcategorydetails] = useState(false);
    const [isEdit, setisEdit] = useState(true);
    // error message for all input
    const [formInputError,setformInputError]=useState(false);

    const [CategoryError, setCategoryErrorError] = useState(false);

   

    const HandleEdit = () =>{
        setEdit(false)
    }

    // task add
    const HandleUpdateDoc=async(e)=>{
        e.preventDefault();

        const isLogin = localStorage.getItem("userdetail");
        const usersDetails = JSON.parse(isLogin);
        const phoneNum=usersDetails.phoneNum;
        const username=usersDetails.username;
        console.log(usersDetails);

        const data={
        
            taskName:taskName,
            taskDate:taskDate,
            discription:discription,
            TaskStartTime:startTime,
            taskEndTime:endTime,
            urls:imageurls,
            taskCategory:taskCategory,
            ContributionPoints:points,
            TaskStatus:status,
            UpdateTaskTime:Timestamp.now(),
        }
             
        if (uploadimagestate === true) {
            if(taskName==="" || taskDate==="" || discription==="" || startTime==="" || endTime==="" || taskCategory===""){
                // console.log("task name errod");
                setformInputError(true);
            }
            else{
                setEdit(true);
                console.log("true");
                const newCityRef = doc(db, phoneNum,TaskId);
                // console.log("edit task",data);
                // alert("data update succesffuly");
                await updateDoc(newCityRef, data);  
                Swal.fire({  
                    position: 'center',  
                    icon: 'success',  
                    title: 'Your task has been updated',  
                    showConfirmButton: false,  
                    timer: 2000  
                }).then(function() {      
                   console.log("data update succesffuly")
                        Router.push("/user/tasklist");         
                    });
    
    
            } 
            
        } 
        if(uploadimagestate === false){
            alert("upload image")
        }
    }

  const HandletaskDelete=async(e)=>{
      e.preventDefault();
    const isLogin = localStorage.getItem("userdetail");
    const usersDetails = JSON.parse(isLogin);

    const phoneNum=usersDetails.phoneNum;
    const username=usersDetails.username;

    // const newCityRef = doc(db, phoneNum,TaskId);
    // deleteDoc(newCityRef);
    // console.log("task",data);

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            const newCityRef = doc(db, phoneNum,TaskId);
            deleteDoc(newCityRef);
          Swal.fire(
            'Deleted!',
            'Your task has been deleted.',
            'success',
           
            Router.push('/user/tasklist'),
         
        )}
        
       
      });
    //   alert("delete task successfully") ;
    //    Router.push('/user/tasklist');
 
  }



const handleBackbtn = () => {
    // setisOpen(false)
    Router.back();
}

    //upload multi
    const handleUpload = () => {
        const promises = [];
        setImageUrls("")
        setuploadbtnload(true);
      
    images.map((image)=>{
        // const storageRef = ref(storage, 'images/rivers.jpg');
        const storageRef = ref(storage,`/${image.name}`)

        // const storageRef = ref(storage,`images/${image.name}`).put(image);
        const uploadTask = uploadBytesResumable(storageRef, image );   
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
                setImageUrls((imageurls) => [...imageurls, urls]);
        
                });
               
            
            },
            
        //    async () => {
        //      await storage
        //         // .ref("images")
        //         // .child(image.name)
        //         .getDownloadURL()
        //         .then((urls) => {
        //           setUrls((prevState) => [...prevState, urls]);
        //         });
        //     }
        );
       

        //   
    });
 

    Promise.all(promises)
        .then(() => { setuploadimagestate(true);
            setuploadbtnload(false);
        })
        .catch((err) => console.log(err));  
    }; 
  

    console.log("image: ", images);
    console.log("urls", imageurls);


    const handleChange = (e,number) => {
        setImages("");
        setuploadimagestate(false)
        // if(number < 1024) {
        //     return number + 'bytes';
        //   } else if(number >= 1024 && number < 1048576) {
        //     return (number/1024).toFixed(1) + 'KB';
        //   } else if(number >= 1048576) {
        //     return (number/1048576).toFixed(1) + 'MB';
        //   }
        for (let i = 0; i < e.target.files.length; i++){
            const newImage = e.target.files[i];
            console.log(newImage);
            newImage["id"] = Math.random();
            // setImages((prevState) => [...prevState, newImage]);
            setImages((images) => [...images, newImage]);
        
        }

    };

    // image view as popup
    const handleImageView=(imgesd)=>{
        console.log("pop", imgesd);
            Swal.fire({
            // title: 'Sweet!',
            // text: 'Modal with a custom image.',
            imageUrl: imgesd,
            // className:swal2-image,
            imageWidth: 400,
            imageHeight:400,
           
            imageAlt: 'task image',
            })
    }

    // const ExampleCustomInput = ({ value, onClick }) => (
    //     <button className="example-custom-input" onClick={onClick}>
    //       {value}
    //     </button>
    //   );

       // get taskcategory data function
    const GetTaskCategory = (e) => {
    const target = event.target.value;
    setTaskCategory(target);
    console.log(taskCategory);
    }
    const HandleEditcategory = () =>{
        setisEdit(false);
        settaskcategorydetails(true);
    }

       useEffect(() => {
        const getContent = async () => {
            const data = await getDocs(collection(db, "TaskCategory"));
            setTaskcategorydata(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            console.log("TaskData:", data);
        };
        getContent();
    }, []);

  useEffect(()=>{
       // localhost
       const isLogin = localStorage.getItem("userdetail");
       const usersDetails = JSON.parse(isLogin);
       const phoneNum=usersDetails.phoneNum;
       const username=usersDetails.username;

        // get all data from firebase
        const getAllDocument = async () => {
        onSnapshot(collection(db,phoneNum), (snapshot) => {
          console.log("Task List", snapshot);
          setTasks(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        })
      }

        // get single task from database
        const getSingleDoc=async()=>{
            const docRef = doc(db,phoneNum,TaskId);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data());
            if(docSnap.exists()){            
                settaskName(docSnap.data().taskName);
                settaskDate(docSnap.data().taskDate);
                setdiscription(docSnap.data().discription);
                setstartTime(docSnap.data().TaskStartTime);
                setendTime(docSnap.data().taskEndTime);
                setImageUrls(docSnap.data().urls);
                setTaskCategory(docSnap.data().taskCategory);
                // setfileName(docSnap.data().imageName);
                setpoints(docSnap.data().ContributionPoints);
                setStatus(docSnap.data().TaskStatus);
        
            }else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }
      getSingleDoc();
      getAllDocument();
      console.log(inputFile);
  },[])

  return(
    <>
        <section className='p-taskdetails'>
        <div className='footerbg'> <Image src="/loginScreenBg.jpg" alt='loadingimg' width={30} height={100} layout='responsive' priority="true" /></div>
            <div className='sectionHeading'>
                <div>
                <span onClick={handleBackbtn}><MdArrowBackIosNew/></span>
                   <h4>Task Detail</h4>
                </div>
            </div>

           <div className='container'>
       
              <form>
                    <div className='form-row'>
                    <div className='status'>
                        {status ?<h4 className='approved'>approved<RiCheckboxCircleLine/></h4> :<h4 className='pending'>pending<BiErrorCircle/></h4> }    
                         {status ? <h2>{"CP:"+points}</h2> :null } 

                    </div>
                     
                        <ul className='form-textfield'>
                        
                        {/* add task */}
                        <li>
                            <label>TASK NAME<sup>*</sup>
                                <input type="text"
                                    value={taskName}
                                    name="taskname"
                                    required
                                    disabled={isedit} 
                                    onChange={(event) => {
                                    settaskName(event.target.value);
                                    if(taskName===""){
                                        setformInputError(true);
                                    }
                                 }}   /> 
                                  
                            </label>    
                        </li>
                        {formInputError ?<li> <p>input field is required</p></li> : null}

                            {/* task category */}
                            <li >
                                    <label>TASK CATEGORY<sup>*</sup>
                                     {taskcategorydetails ? <div className='multipleitem'>

                                            <select   onChange={GetTaskCategory}>
                                                <option selected>Select Task Category</option>
                                                {
                                                    Taskcategorydata && Taskcategorydata.map((categoryData,i) => {
                                                        //console.log(formUser);
                                                        return (

                                                            <option key={i}  className='option-value' value={categoryData.taskCategory} onClick={(e) => GetTaskCategory(categoryData)}>{categoryData.taskCategory}</option>

                                                        )
                                                    })
                                                }
                                            </select>

                                                 </div>:
                                         <div className='businessc' > {taskCategory}  <button disabled={isedit} onClick={HandleEditcategory}><FiEdit/></button> </div>
                                     }

                                        {CategoryError ? <p>Category is required</p> : null}
                                    </label>
                                </li>          


                        {/* discription */}

                        <li>
                            <label>DESCRIPTION<sup>*</sup>
                                <input type="text"
                                    value={discription}
                                    name="discription"
                                    required    
                                    disabled={isedit} 
                                    onChange={(event) => {
                                    setdiscription(event.target.value)
                                    if(discription===""){
                                        setformInputError(true);
                                    }
                                     }} />      
                            </label>
                        </li>

                        {/* date */}
                        <li>
                            <label>DATE<sup>*</sup>
                                   <DatePicker
                                                selected={taskDate ? new Date(taskDate) : null}
                                                // onChange={(value)=> {
                                                //     // value here is javascript date object
                                                //      settaskDate({date: moment(value)})
                                                //       }}
                                                value={taskDate}
                                                required
                                                // defaultValue={taskDate} 
                                                name="taskDate"                                             
                                                onChange={date => settaskDate(date)}
                                                disabled={isedit} 
                                                timeIntervals={15}
                                                timeCaption="time"
                                                dateFormat="d-MMMM-yy"
                                     
                                                // customInput={<ExampleCustomInput />}
                                                maxDate={moment().toDate()}
                                               
                                                /> 
                                {/* <input type="text"
                                    value={taskDate}
                                    name="date"
                                    required
                                    
                                    max={moment().format("YYYY-MM-DD")}  //future date cannot be selected by user
                                    disabled={isedit} 
                                    onChange={(event) => {
                                        settaskDate(event.target.value)
                                        if(taskDate===""){
                                            setformInputError(true);
                                        }
                                }} /> */}
                        

                            </label>
                        </li>                        

  
                    
                        {/* start-end time */}
                        <li>
                            <div className='time'>
                                <label>START TIME<sup>*</sup>
                                    <input type="time"
                                        value={startTime}
                                        name="starttime"
                                        required
                                        disabled={isedit} 
                                        onChange={(event) => {
                                        setstartTime(event.target.value)
                                        if(startTime===""){
                                            setformInputError(true);
                                        }}} />
                                     
                                </label>
                            </div>


                            {/* end time */}
                            <div>
                                <label>END TIME<sup>*</sup>
                                    <input type="time"
                                        value={endTime}
                                        name="endtime"
                                        required
                                        disabled={isedit} 
                                        onChange={(event) => {
                                        setendTime(event.target.value)
                                        if(endTime===""){
                                            setformInputError(true);
                                        }
                                    }} />
                                   

                                </label>    
                            </div>
                            
                        </li>

                          
                      {/* upload file */}
                        <li className="custom-upload" htmlFor="file-upload">

                                <label>TASK IMAGE</label>
                                {isedit?  null  :

                                    <div className="upload-multi-file">
                                        {/* <label htmlFor="file-upload" className='custom-file-upload'>Select File</label> */}
                                        
                                   
                                        <input type="file"
                                                id="file-upload"
                                                // multiple 
                                                // required
                                                disabled={isedit}
                                                onChange={handleChange}
                                              
                                                // accept="image/png,image/jpg,image/jpeg,.pdf,doc"
                                        
                                               />
                                        {images.length > 0 ? <span className="images-btn" onClick={handleUpload}> {uploadbtnload ?   "Uploading...":"Upload" }</span> :  <label>(only png, jpeg, jpg, pdf, doc) </label>  }                                                    
                                    
                                    </div>    
                                                         
                                }
                               
                                    {/* <progress value={progress} /> */}
                                          
                              </li>                                           
                    
                       <li className='imag'> 
                            {imageurls && imageurls.map((imgesd,i) =>
                                        // console.log(img),
                                            <div onClick={() => handleImageView(imgesd)} key={i} className='imgDesc'>
                                                <img src={imgesd}
                                                alt="task_img"  />
                                            </div>

                              )}
                              
                        </li>

                        </ul>
                    </div>
                            
                {/* submit button */}
                {status ? null :  <div className="submitTask">
                        {isedit ? null:<button
                        type="submit"
                        onClick={HandleUpdateDoc}><FiSave />Save
                        </button>}
                        
                        {
                            isedit ? <button
                            type="submit"
                            onClick={HandleEdit}><FiEdit/>Edit
                            </button>:null
                        }
                        <button
                        type="submit"
                        onClick={HandletaskDelete}><AiOutlineDelete/>Delete
                        </button>
                    </div> }
                </form>
         

            </div>

       </section>
       <Footer/>
    </>
  )
}

export default TaskEdit;

export async function getServerSideProps({ query }) {
    console.log("query", query);
    return {
      props: {
  
        taskid: query
      }
    }
  }