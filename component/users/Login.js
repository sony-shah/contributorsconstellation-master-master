import React, { useState, useEffect } from 'react';
import { auth } from '../../firebaseConfig'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from '@firebase/auth'
import { collection, addDoc, increment, setDoc, doc, docs, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { getFirestore, onSnapshot } from '@firebase/firestore'
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import axios from "axios";
import Swal from 'sweetalert2';
const db = getFirestore();


// import logoimg from '../../public/umeet-logo.png';
import logoimg from '../../public/logobg.png';
// import spaceimg from '../../public/space.png';
import loginMobBg from '../../public/loginScreenBg.jpg';


function Login() {
    // const phoneNum=props.phoneNum;

    const [loginStatus, setLoginStatus] = useState(true);
    const [LoadingData, setLoadingData]=useState(true);

    // for input 
    const [phoneNum, setphoneNum] = useState("");
    const [username, setusername] = useState("");
    const [otp, setotp] = useState("");

    // throw error message
    const [mobilenumerror, setmobilenumerror] = useState(false);
    const [otpvaliderror, setotpvaliderror] = useState(false);
    const [nameerror, setnameerror] = useState(false);
    const [firsterror, setfirst] = useState("");

    const [verifynumber, setVerifynumber] = useState(false);

    // for input condition
    const [sendOtp, setsendOtp] = useState(true);
    const [verifyOtp, setverifyOtp] = useState(false);
    const [verifyName, setverifyName] = useState(false);

    // to store the data in array
    const [users, setUsers] = useState([]);
    const [date, setdate] = useState();
    const [currentdate, setCurrentdate] = useState('');
    const [currenttime, setCurrentTime] = useState('');


    //for recaptcha
    const configureCaptcha = () => {


        window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                console.log('It works!');
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                handleSendOtp();
                console.log("recaptcha varified");

            },
            defaultCountry: "IN"
        }, auth);

    }

    //for send otp on registered mobile number
    const handleSendOtp = async (e) => {
        configureCaptcha();

        if (!phoneNum) {
            // alert('Enter the number please')
            setmobilenumerror(true);
            // Swal.fire({
            //     title: 'enter your register number ',
            //     customClass: {
            //         validationMessage: 'my-validation-message',
            //         title: "Swal-title",
            //     },
            // })


        } else {

            setVerifynumber(true);

            //varify mob number 
            axios.post('https://api.ujustbe.com/mobile-check', {

                "MobileNo": phoneNum
            })
                //if number exists
                .then(function (response) {

                    //sent otp on mob number
                    const phoneNumber = "+91" + phoneNum;
                    const appVerifier = window.recaptchaVerifier;
                    console.log(phoneNumber);

                    //sign with number
                    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                        .then((confirmationResult) => {

                            // SMS sent. Prompt user to type the code from the message, then sign the
                            // user in with confirmationResult.confirm(code).
                            // confirmationResult.confirm(otp)
                            window.confirmationResult = confirmationResult;
                            console.log("otp has been sent");
                            setsendOtp(false);
                            setmobilenumerror(false);
                            setverifyOtp(true);
                            setVerifynumber(false);

                        })
                        .catch((error) => {
                            // Error; SMS not sent
                            // console.log(error);
                            console.log("otp has been not sent");

                        });

                    //get data after otp get
                    console.log(response);
                    console.log("This Number is exists");

                })
                //if number is not exists
                .catch(function (error) {
                    // console.log("kindly enter your register number");

                    // alert("kindly enter your register number ");
                    setmobilenumerror(true);
                    setVerifynumber(false);
                    setphoneNum("");
                });
        }

    }

    
    // const handleKeyPress = (event) => {
    //     if (event.key === 'Enter') {
    //         console.log('enter press here! ')
           
    //     }
    // }

    // varification the otp
    const handleConfirmCode = async () => {
        const code = otp;
        console.log(code);
        setVerifynumber(true);
        window.confirmationResult.confirm(otp).then((result) => {
            // User signed in successfully.
            //alert("varification successful")
            // Swal.fire({
            //     position: 'middle',
            //     icon: 'success',
            //     title: 'otp has been varified Successful!',
            //     showConfirmButton: true,
            //     timer: 1500
            // })
            setotp("");
            
            const user = result.user;
            console.log("user", user);
            setotp("");
            setverifyOtp(false);
            setVerifynumber(false);
            setotpvaliderror(false);
            setverifyName(true);


        }).catch((error) => {
            // alert("Enter valid code");
            setotpvaliderror(true);
            setVerifynumber(false);
            // User couldn't sign in (bad verification code?)
            console.log(error);

        });

        //  setverifyNumber(false);
        //  otpVerify(true);
    }
    const handlekeychange = (event) => {
        if (event.key === 'Enter') {
            console.log('enter press here! ')
            handleConfirmCode();
           
        }
    }
    

    //submit all data 
    const SubmitLogData = async (e) => {
    
        const isLogin = localStorage.getItem("userdetail");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);

        let dt = new Date().toLocaleDateString();
        let tm = new Date().toLocaleTimeString();
        event.preventDefault();

        
        setVerifynumber(true);
        let data = {
            username: username,
            phoneNum: phoneNum,
            loginTime: tm,
            logindate: dt,
        };

        
        if (!username) {
            // alert("Enter your Name please");
            setnameerror(true);
            setVerifynumber(false);

          

        } else {

            //add data to firebase
           
            console.log("data added to firebase", data);
            const cityRef = doc(db, "AdminLoginTask", phoneNum);
            setDoc(cityRef, data, { merge: true });

            //localhost
            const usersDetails = JSON.parse(isLogin);
            localStorage.setItem('userdetail', JSON.stringify(data));
            setphoneNum("");

            //redirect to next page


 
            // Router.push('/user/tasklist');
    
            // alert("you have successfully login");
            setusername("");
            // setVerifynumber(false);

            setnameerror(false);
            setverifyName(false);
            
            Router.push('/user/tasklist');
            // setLoadingData(false)
        }

    }
    const handlekeysubmit = (event) => {
        if (event.key === 'Enter') {
            console.log('enter press here! ')
            SubmitLogData();
           
        }
    }

    function allowOnlyNumericsOrDigits(e) {
        // console.log(e.target.value.length);
        const charCode = e.which ? e.which : e.keyCode;

        // return (event.charCode >= 48 && event.charCode <= 57)

        if ((charCode < 48 || charCode > 57)) {
            // return (event.charCode >= 48 && event.charCode <= 57)
            setfirst('OOPs! Only numeric values or digits allowed');
        }
        else {
            setfirst('')
        }

        if (e.target.value.length < 1) {
            setfirst('')
           
        }
        if (e.key === 'Enter') {
            console.log('enter press here! ')
            handleSendOtp();

           
        }
    }

    useEffect(() => {
        //get all document from firebase
        const userlogin = localStorage.getItem("userdetail");
     
        const getAllData = async () => {

            console.log("test",userlogin);
            if(userlogin != null){
                setLoginStatus(false);
                // alert("check if you have already logged in!")
                Router.push('/user/tasklist');
            }
            else{
                setLoginStatus(true);   
            }

            // onSnapshot(collection(db, "AdminLoginTask", phoneNum), (snapshot) => {
            //     console.log("MM", snapshot);
            //     setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            //     setUsers(localStorage.getItem('ucore'));

            // })
        }
        getAllData();
    }, [])

    return (
        <>
        {loginStatus? null :<section className='loadingScreen'>
               <div className='loginBackground'>
                    <Image src={loginMobBg}  alt='applogo'  layout='responsive' />
                </div>
                  {/* <Image src={loginbg} alt='loadingimg' layout='responsive' /> */}
                    <p>checking if you are already loggedIn...</p>
                {/* {LoadingData ? <div className='loader'> <span className="loader2"></span> </div>: null}     */}
         
           
        </section>
         

        }
            <div id="sign-in-button"> </div>
            <section className="c-login">
                <div className='loginbg'>
                    <Image src={loginMobBg}  alt='applogo'  layout='responsive' />
                </div>
                <div className="signinContainer">
                    <Image src={logoimg} width={400} height={500} placeholder="blur" alt='applogo' layout='fixed' />
                    <h2>Contributors' Constellation</h2>

                    {/* send otp on mob number */}
                    {sendOtp ? <div className='loginInput'>
                        <ul>
                         <li className={mobilenumerror ? 'error':null }>
                                <input type="text"
                                    name='PhoneNum'
                                    value={phoneNum}
                                    maxLength={10}
                                    placeholder="Enter register mobile number"
                                    onKeyPress={(e) => allowOnlyNumericsOrDigits(e)}
                                    onChange={(e) => {
                                        setphoneNum(e.target.value)

                                        if (e.target.value.length >= 11) {
                                            setmobilenumerror(true);
                                        }
                                    }}
                                    size={25} />
                            </li> 

                            {mobilenumerror ? <li><p>enter your register Mobile number</p></li> : null}
                                {/* {firsterror?<li><p>Enter Valid input</p></li>:null } */}
                            

                            <li>
                                <button type="submit" disabled={verifynumber} onClick={handleSendOtp}>{verifynumber ? "Verifying Number...":"GET OTP"}</button>
                            </li>
                        </ul>

                    </div> : null}


                    {/* varify otp here */}
                    {verifyOtp ? <div className='loginInput'>
                        <ul>
                            <li className={otpvaliderror ? 'error':null }>
                                <input type="password"
                                    name='otp'
                                    value={otp}
                                    placeholder="Enter OTP here"
                                    maxLength={6}
                                    onChange={(e) => setotp(e.target.value)}
                                    onKeyPress={(e) => handlekeychange(e)}
                                    size={25} />
                            </li>
                                 {otpvaliderror ?<li> <p>Enter Valid OTP</p></li> : null}
                                 {/* {firsterror?<li><p>Enter Valid input</p></li>:null } */}
                            <li>
                                <button type="submit" disabled={verifynumber} onClick={() => handleConfirmCode()}>{verifynumber ? "Verifying OTP..." : "VERIFY"}</button>
                            </li>
                        </ul>

                    </div> : null} 


                    {/*   input for username   */}
                    {verifyName ? <div className='loginInput'>
                        <ul>
                            <li  className={nameerror ? 'error':null } >
                                <input type="text"
                                    name="username"
                                    value={username}
                                    placeholder="Enter your name"
                                    onChange={(e) => setusername(e.target.value)}
                                    onKeyPress={(e) => handlekeysubmit(e)}
                                    
                                    size={25} />
                            </li>

                            {nameerror ?<li><p>kindly enter your name</p></li>  : null}
                            {/* {firsterror?<li><p>Enter Valid input</p></li>: null } */}

                            <li>
                                <button type="submit" disabled={verifynumber} onClick={() => SubmitLogData()}>{verifynumber ? "Redirecting Home..." : "LOGIN"}</button>
                            </li>
                            {/* {LoadingData ? <div className='loader'> <span className="loader2"></span> </div> :null} */}

                        </ul>
                                      


                    </div> : null} 
                </div>
                

            </section>

        </>
    )

}

export default Login;
