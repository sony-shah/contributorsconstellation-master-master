import React, { useState, useEffect } from 'react';
import firebaseApp from '../../../firebaseConfig'
import { auth } from '../../../firebaseConfig';
import { collection, ref, push, addDoc, setDoc, doc, docs, getDocs, deleteDoc, arrayUnion, getDoc, updateDoc, query, Timestamp, orderBy } from "firebase/firestore";
import { getFirestore, onSnapshot } from "firebase/firestore";
import Router from 'next/router';
import Layout from '../../../component/Layout';
import Link from 'next/link'
import Swal from 'sweetalert2';
import { FiEdit } from 'react-icons/fi';
// import Router from 'next/router';
import { useRouter } from "next/router";
import AddTaskDetail from '../addtaskadmin';

const db = getFirestore();

function UserTaskDetails({ taskDetailsid }) {

    const taskdetailId = taskDetailsid.tid;
    const [userdetail, setUserdetail] = useState('');
    const [userTask, setuserTask] = useState([]);
    const [LoadingData, setLoadingData] = useState(true);
    const [isOpen, setisOpen] = useState(false);
    const router = useRouter();

  
    // const data = router.query.vid;
    // const data1 = router.query.view;
    

    const handleImageView = (textimg) => {

        Swal.fire({
          // title: ,  
          imageUrl: textimg,
          imageWidth: 400,
          className: "styleTitle",
          imageAlt: 'Custom image',
        })
      }

      function openbox(item) {
        setisOpen(item)
      }

     const handleopenaddtask = () => {
        setisOpen(!isOpen)
     }
 
    useEffect(() => {
        setLoadingData(true);


        // get all data from firebase
        const getAllDocument = async () => {
            onSnapshot(collection(db, taskdetailId), (snapshot) => {
                console.log("user Task details", snapshot);
                setuserTask(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                setLoadingData(false)
            })

        }
        getAllDocument();

    }, [])





    return (
        <>

            <Layout>
                <section className='c-userlist box'>
                    <h2 className='admin-heading'>admin dashbaord
                        <button onClick={handleopenaddtask} >Add Task</button>
                    </h2>
                    <table className='table-class'>
                        <thead>
                            <tr>
                                <th>Sr No.</th>
                                <th>Task Name</th>
                                <th>Task Date</th>
                               
                                <th>Discription</th>
                                <th>task images</th>
                                <th>Task Category</th>
                                <th>Contribution Points</th>
                                <th>Task Status</th>
                                <th>Task Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>


                        <tbody>
                            {LoadingData ? <tr><td colSpan="9"><div className='loaderAdmin'> <span className="loader2"></span> </div></td></tr> :

                                //  map the function  
                                <>
                                    {
                                        userTask && userTask.map((userdetail, key = i) => {
                                            console.log("user all data", userTask);
                                            return (

                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{userdetail.taskName}</td>
                                                    <td>{userdetail.taskDate}</td>
                                                  
                                                    <td>{userdetail.discription}</td>
                                                    <td className='task-img'>{userdetail.urls && userdetail.urls.map((textimg, i) => <div key={i} onClick={() => handleImageView(textimg)} className='admin-imgfile'><img src={textimg} /></div>)}</td>
                                                    <td>{userdetail.taskCategory}</td>
                                                    <td>{userdetail.ContributionPoints}</td>
                                                    <td>{userdetail.TaskStatus ? "Approved" : "Pending"}</td>

                                                    <td>
                                                        <span>{userdetail.TaskStartTime}</span> - <span>{userdetail.taskEndTime}</span>
                                                    </td>

                                                    <td>
                                                        <Link href={`/admin/taskedit/[uid]?vid=${userdetail.phoneNum}`} as={"/admin/taskedit/" + userdetail.id +"?vid=" + userdetail.phoneNum}>
                                                            <a className='editaction'><FiEdit />Edit</a>
                                                        </Link>
                                                    </td>

                                                </tr>
                                            )

                                        })
                                    }
                                </>
                            }

                        </tbody>
                    </table>

                </section>

                {
                    isOpen &&

                    <AddTaskDetail    />

                }

             
            </Layout>
        </>


    );
}

export default UserTaskDetails

export async function getServerSideProps({ query }) {
    console.log("query", query);
    return {
        props: {

            taskDetailsid: query
        }
    }
}