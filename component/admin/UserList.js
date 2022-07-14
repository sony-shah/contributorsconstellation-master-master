import React,{useState, useEffect} from 'react';
import firebaseApp from '../../firebaseConfig'
import { auth } from '../../firebaseConfig';
import { collection, ref, push, addDoc, setDoc, doc, docs, getDocs, deleteDoc, arrayUnion, getDoc, updateDoc, query, Timestamp, orderBy} from "firebase/firestore";
import { getFirestore, onSnapshot } from "firebase/firestore";
import Router from 'next/router';
import Layout from '../Layout';
import Link from 'next/link'
import { FiEdit } from 'react-icons/fi';


const db = getFirestore();

function UserList() {
  const [userdetail, setUserdetail] = useState('');
  const [userData, setUserdata] = useState([]);



  useEffect(() => {

    // //localhost
    const isLogin = localStorage.getItem("userdetail");
    const usersDetails = JSON.parse(isLogin);
//     const phoneNum = usersDetails.phoneNum;

  

      // get all data from firebase
      const getAllDocument = async () => {
          onSnapshot(collection(db,"AdminLoginTask"), (snapshot) => {
              console.log("UserData", snapshot);
              setUserdata(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));     
            
          })
      }
   getAllDocument();
   
   // const q = query(collection(db,phoneNum), orderBy('created', 'desc'))
   // onSnapshot(q, (querySnapshot) => {
   //   setTasks(querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data()})))    
   // })
   // console.log();
}, [])
  return(
     <>
      <Layout>
        <section className='c-userlist box'>
            
        <table className='table-class'>
                            <thead>
                                <tr>
                                    <th>Sr No.</th>
                                    <th>Username</th>
                                  
                                    <th>Phone Number</th>
                                    <th>Action</th>


                                </tr>
                            </thead>

                    <tbody>

                    {/* // map the function */}
                {
                    userData && userData.map((userdetail, key=i) => {
                        console.log("user all data", userData);
                        return (

                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>{userdetail.username}</td>
                                        <td>{userdetail.phoneNum}</td>
                                        <td>
                                            <Link  href={"usertaskdetails/[tid]"} as={"usertaskdetails/" + userdetail.id}>
                                                <a className='editaction'><FiEdit/>Edit</a>
                                            </Link>
                                        </td>
                                        
                                       
                                    </tr>                           
                        )

                    })
                }

                </tbody>
                </table>

        </section>
      </Layout>
     </>
  )
}

export default UserList;
