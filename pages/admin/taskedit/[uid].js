import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import firebaseApp from '../../../firebaseConfig';
import { auth } from '../../../firebaseConfig';
import Swal from 'sweetalert2';
import { collection, ref, push, addDoc, setDoc, doc, docs, getDocs, getDoc, arrayUnion, updateDoc, query, Timestamp, orderBy, deleteDoc } from 'firebase/firestore';
import { getFirestore, onSnapshot } from 'firebase/firestore';
import Layout from '../../../component/Layout';
import Router from 'next/router';
import { useRouter } from "next/router";
import { MdUpload } from 'react-icons/md'
import { FiEdit } from 'react-icons/fi';
// import Link from 'next/link';

const db = getFirestore();

function UserTaskEdit({ taskEditid }) {

  const editId = taskEditid.uid;
  console.log("taskid:", editId);

  const [userTasks, seUserTasks] = useState([]);
  const [isedit, setEdit] = useState(true);
  const [taskName, settaskName] = useState("");
  const [taskDate, settaskDate] = useState("");
  const [discription, setdiscription] = useState("");
  const [startTime, setstartTime] = useState("");
  const [endTime, setendTime] = useState("");
  const [inputFile, setinputFile] = useState([]);
  // const [urls, setinputFile] = useState([]);
  const [fileName, setfileName] = useState("No file choosen");
  const [points, setpoints] = useState(0);
  const [pointInput, setpointInput] = useState(0);
  const [FinalPoints, setFinalPoints] = useState("");
  const [status, setStatus] = useState(false);
  const [pointsError, setpointsError] = useState(false);
  const [phoneNumber, setphoneNumber] = useState("");
  const router = useRouter();
  const data = router.query.vid;

  const [taskCategory, setTaskCategory] = useState('');
  const [Taskcategorydata, setTaskcategorydata] = useState([]);
  const [taskcategorydetails, settaskcategorydetails] = useState(false);
  const [isEdit, setisEdit] = useState(true);

  const handleChange = (e) => {
    //console.log("new value", evt.target.value);
    setpointInput(+e.target.value);

  }


     // get taskcategory data function
     const GetTaskCategory = (e) => {
      const target = event.target.value;
      setTaskCategory(target);
      console.log(taskCategory);
  }

  const HandleEdit = () =>{
      setisEdit(false);
      settaskcategorydetails(true);
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // localhost
    const isLogin = localStorage.getItem("userdetail");
    const usersDetails = JSON.parse(isLogin);
    // const phoneNum=usersDetails.phoneNum;
    // const username=usersDetails.username;
    // console.log(usersDetails);



    const data = {

      ContributionPoints: pointInput,
      taskCategory:taskCategory,
      TaskStatus: true,

    }

    if (!pointInput) {
      setpointsError(true);

    }
    else {
      const newCityRef = doc(db, phoneNumber, editId);
      console.log("task", data);
      await updateDoc(newCityRef, data, { merge: true });
      setpointsError(false);

      Swal.fire({
        position: 'top-middle',
        icon: 'success',
        title: 'Your task has been updated successfully',
        showConfirmButton: false,
        timer: 2000
      });

      setTaskCategory("");
    }
  }

  const handleImageView = (textimg) => {

    Swal.fire({
      // title: ,  
      imageUrl: textimg,
      imageWidth: 400,
      className: "styleTitle",
      imageAlt: 'Custom image',
    })
  }

  const getSingleDoc = async (data) => {

    const unsub = onSnapshot(doc(db, data, editId), (doc) => {
      console.log("admin single data: ", doc.data());
      settaskName(doc.data().taskName);
      settaskDate(doc.data().taskDate);
      setdiscription(doc.data().discription);
      setstartTime(doc.data().TaskStartTime);
      setendTime(doc.data().taskEndTime);
      setinputFile(doc.data().urls);
      setfileName(doc.data().imageName);
      setpoints(doc.data().ContributionPoints);
      setTaskCategory(doc.data().taskCategory);
      setStatus(doc.data().TaskStatus);
      setinputFile(doc.data().urls);
      setphoneNumber(doc.data().phoneNum);
      // console.log(doc.data().imageUrl);
      // console.log(points);

    });



  }

  // useEffect(() => {

  //   //localhost
  //   const isLogin = localStorage.getItem("userdetail");
 

  //   getSingleDoc();

  // }, [])

  
  useEffect(() => {

    // get business category details
    const getContent = async () => {
        const data = await getDocs(collection(db, "TaskCategory"));
        // onSnapshot(collection(db, "dewdropusers3"), (snapshot) => {
        //   console.log("Suraj", snapshot);
        //   setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        // })
        setTaskcategorydata(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        console.log("taskcategory:", data);
    };

    
   

   
    getContent();
}, []);


  useEffect(() => {
    if (!router.isReady) return;
    console.log('DATA')
    console.log("DATA", data)
    if (data === undefined) {
      return
      console.log('UNDEFINE')
    }
    else {
      // HandlePoupDewdrop(data, data1);
      getSingleDoc(data);
    }

  }, [router.isReady])

  return (
    <>
      <Layout>
        <section className='c-contribution box'>

          <h2>admin dashbaord</h2>
          <form onSubmit={handleEditSubmit}>
            <ul>
              <li className='form-row'>
                <h4 htmlFor="validationCustom01">Contribution Point</h4>
                <div className='multipleitem'>
                  <input type="number"
                    placeholder='Contribution Point'
                    name="point"
                    id="validationCustom01"
                    value={points > 0 ? points : null}
                    onChange={handleChange}
                    required >
                  </input>
                </div>

                <div>{pointsError ? <p> Contribution Points is required </p> : null}</div>


              </li>

              <li className='form-row businessCategory'>
                        <h4>Task Category</h4>
                    { taskcategorydetails ?   <div className='multipleitem '>

                       <select onChange={GetTaskCategory}>
                                <option selected>Select Task Category</option>
                                {
                                    Taskcategorydata && Taskcategorydata.map((categorydata, l) => {
                                        //console.log(formUser);
                                        return (

                                            <option key={l} value={categorydata.taskCategory} onClick={(e) => GetTaskCategory(categorydata)}>{categorydata.taskCategory}</option>

                                        )
                                    })
                                }
                            </select>
                        </div>  :
                      <div className='businessc' > {taskCategory}  <button onClick={HandleEdit}><FiEdit/></button> </div>
                   }
            
                       
                </li>

              <li className='form-row'>
                <div>
                  <button className='submitbtn' type='submit' >Submit</button>

                  {/* <button className='resetbtn'>Reset</button> */}
                </div>
              </li>

            </ul>
          </form>

        </section>

        {/*  map the function */}

        <section className='c-userlist box'>
          <table className='table-class'>
            <thead>
              <tr >

                <th>Task Name</th>
                <th>Task Date</th>
                <th>Task Category</th>
                <th>Discription</th>
                {/* <th>File Name</th> */}
                <th>task images</th>
                <th>Contribution Points</th>
                <th>Task Status</th>
                <th>Task Time</th>
              </tr>
            </thead>

            <tbody>

              {/* // map the function */}

              <tr>
                {/* <td>{key + 1}</td> */}
                <td>{taskName}</td>
                <td>{taskDate}</td>
                <td>{taskCategory}</td>
                <td>{discription}</td>
                <td className='task-img'>{inputFile && inputFile.map((textimg, i) => <div key={i} onClick={() => handleImageView(textimg)} className='admin-imgfile'><img src={textimg} /></div>)}</td>
                <td>{points}</td>
                <td>{status ? "approved" : "Pending"}</td>
                <td>
                  <span>{startTime}</span> - <span>{endTime}</span>
                </td>

              </tr>

            </tbody>
          </table>
        </section>




      </Layout>
    </>

  )
}

export default UserTaskEdit;

export async function getServerSideProps({ query }) {
  console.log("query", query);
  return {
    props: {
      taskEditid: query
    }
  }
}
