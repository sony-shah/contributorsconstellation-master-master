
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { auth } from '../../firebaseConfig'
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import { collection, ref, push,addDoc, setDoc, doc, docs, getDocs, arrayUnion,getDoc,updateDoc,Timestamp } from "firebase/firestore";
import { getFirestore ,onSnapshot} from "firebase/firestore";
import Router from 'next/router';
const authlog = getAuth();
const db = getFirestore();


const TaskCategory = () => {


    const [taskCategory,setTaskCategory]=useState("");
    const [listCategory,setlistcategory]=useState("");
    const [Ccategorydata, setCcategorydata] = useState([]);
    const usersCollectionRef = collection(db, "TaskCategory");


    // add business category in database 
    const HandleAddTaskCategory=async(e)=>{
        const data={
            taskCategory:taskCategory,
        }

        await addDoc(usersCollectionRef,data);
        alert("Task created successfully!");
        console.log("TaskCategory data:", data);  
        setTaskCategory("");

    }

    useEffect(() => {
        const getContent = async () => {
          const data = await getDocs(usersCollectionRef);
          // onSnapshot(collection(db, "dewdropusers3"), (snapshot) => {
          //   console.log("Suraj", snapshot);
          //   setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          // })
          setCcategorydata(data.docs.map((doc) => ({ ...doc.data(), id:doc.id })));
          console.log(data);
        };
    
        getContent();
      }, []);
    
  return (
    <section className='c-form  box'>
    <h1> Add Task Category</h1>
        <ul>

            {/* Task category Name */}
            <li className='form-row'>
                <h4 htmlFor="b1">Task Category</h4>
                <div className='multipleitem'>
                    <input type="text"
                    placeholder='Add Task Category eg. IT, Finance, Carpenter, Wholesaler'
                    name="taskcategory"
                    id="b1" 
                    value={taskCategory}
                    onChange={( event ) => {setTaskCategory(event.target.value)}}
                    required >
                    </input> 
                
                    {/* <span class="valid-feedback">Looks good!</span> */}        
                </div>
            </li>
            
        {/* submit and reset btn */}  {/* submit & reset button  */}
        <li className='form-row'>   
            <div>
                <button className='submitbtn' onClick={HandleAddTaskCategory}>Submit</button>
            
        
                <button className='resetbtn'>Reset</button>
            </div>    
            </li>
        </ul>




    

    </section>
  )
}

export default TaskCategory