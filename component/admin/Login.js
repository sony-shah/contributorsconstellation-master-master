import React, { useState } from 'react';
import Image from 'next/image';
import { auth } from '../../firebaseConfig'
import { signInWithPopup, OAuthProvider, getAuth, signOut } from 'firebase/auth';
import { collection, ref, push,addDoc, setDoc, doc, docs, getDocs, arrayUnion,getDoc,updateDoc } from "firebase/firestore";
import { getFirestore ,onSnapshot} from "firebase/firestore";
const db = getFirestore();
import Router from 'next/router';

const authlog = getAuth();
import officeimg from "../../public/office.png";
import ujblogoimg from '../../public/ujblogo.png';
import loginbg from '../../public/bg.png';


const AdminLogin=(props)=> {

    const PhoneNum=props.PhoneNum;    
    const [loginsuccess,setloginsuccess]=useState(true)
    const [successful,setsuccessfull]=useState(false);
    const [currentuser, setcurrentuser] = useState('');
    const [date, setdate] = useState();
    const [currentdate, setCurrentdate] = useState('');
    const [currenttime, setCurrentTime] = useState('');
    let dt = new Date().toLocaleDateString();
    let tm = new Date().toLocaleTimeString();


    const usersCollectionRef = collection(db, "AdminLoginTask");

    const handleMicrosoftLogin = async () => {
        const isLogin = localStorage.getItem("ucoreadmin");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);
        const microsoftProvider = new OAuthProvider('microsoft.com');

        signInWithPopup(auth, microsoftProvider).then((res) => {
            let dt = new Date().toLocaleDateString();
            let tm = new Date().toLocaleTimeString();
            setcurrentuser(res.user.displayName);

                const data = {
                    currentuser: res.user.displayName,
                    currentTime: tm,
                    Date: dt,
                } 

                console.log("response",res );
                console.log(data);
                const usersDetails = JSON.parse(isLogin);
                localStorage.setItem('ucoreadmin', JSON.stringify(data));
                Router.push("/admin/userslist");

            }).catch((err) => {
                console.log(err);
            })
    }

  return (
    <div>
       
        <section className="c-login">
            <div className='loginBG'>
                    <Image src={loginbg}  alt='applogo'  layout='fill' />
            </div>
        <div className="signin-box">
            <Image src={ujblogoimg} width={120} height={120} alt="logo" />
            
            {loginsuccess ?    <div>

                    <h1>Welcome</h1>
                    <button
                        onClick={() => handleMicrosoftLogin()}    >
                        <Image src={officeimg} width={30} height={30} alt="images" />
                        <p>Get In</p>
                    </button>
                </div>:null }{successful ? <p>you have successfully login</p>: null}
                
                
            
        </div>
        </section>
    </div>
  )
}

export default AdminLogin;
