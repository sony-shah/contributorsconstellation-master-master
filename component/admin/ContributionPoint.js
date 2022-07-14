import React,{useState, useEffect} from 'react';
import firebaseApp from '../../firebaseConfig';
import { auth } from '../../firebaseConfig';
import { collection, ref, push, addDoc, setDoc, doc, docs, getDocs, deleteDoc, arrayUnion, getDoc, updateDoc, query, Timestamp, orderBy} from "firebase/firestore";
import { getFirestore, onSnapshot } from "firebase/firestore";
import Router from 'next/router';
import Swal from 'sweetalert2'

const db = getFirestore();

function ContributionPoint() {
    const [Point,setPoint]=useState('');
    const [error, seterror] = useState(false);

const handleSubmit=async()=>{
    event.preventDefault();
    let dt = new Date().toLocaleDateString();
    let tm = new Date().toLocaleTimeString();

    const usersCollectionRef = collection(db, "AdminLoginTask");
        const isLogin = localStorage.getItem("ucoreadmin");
        const adminDetails = JSON.parse(isLogin);
        console.log(adminDetails);
        console.log("currentuser",adminDetails.currentuser);

    let data={
        AdminCreatedBy:adminDetails.currentuser,
        point:Point,
        AdminCreateTime:tm,
        AdminCreatedDate:dt,
    }

    const newCityRef = doc(collection(db, phoneNum));
    console.log("task",data);
    await setDoc(newCityRef, data);

    setPoint("");




}
  
  return(
      
        <section className='c-contribution box'>

            <h2>admin dashbaord</h2>

            <ul>
                 <li className='form-row'>
                    <h4 htmlFor="validationCustom01">Contribution Point</h4>
                    <div className='multipleitem'>
                        <input type="number"
                        placeholder='Contribution Point'
                        name="Point"
                        id="validationCustom01" 
                        value={Point}
                        onChange={( event ) => {setPoint(event.target.value)}}
                        required >
                        </input>
                    
                        {/* <span class="valid-feedback">Looks good!</span> */}
                    
                        
                    </div>
                </li>

                <li className='form-row'>
                    <div>
                        <button className='submitbtn' onClick={handleSubmit}>Submit</button>
                    

                        {/* <button className='resetbtn'>Reset</button> */}
                    </div>    
                </li>

            </ul>
         
        </section>

  )
}

export default ContributionPoint;
