import React, { useState, useEffect, useCallback } from 'react';
import { auth } from '../../firebaseConfig';
import firebaseApp from '../../firebaseConfig';
import { collection, addDoc, increment, setDoc, doc, docs, getDocs, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { getFirestore, onSnapshot } from '@firebase/firestore'
import Image from 'next/image';
import Footer from '../footer';
import { MdArrowBackIosNew } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import { FiSave } from 'react-icons/fi';
import { AiOutlineCamera } from 'react-icons/ai';
import profilelogoimg from '../../public/profilelogo.png';
import { async } from '@firebase/util';
import Router from 'next/router';
import Swal from 'sweetalert2';
// import proholderimg from '../../public/proholder.jpg';
// import proimg from '../../public/profile-placeolder.jpg';
const db = getFirestore();



function UserProfile() {


  const [username, setusername] = useState("");
  const [phoneNum, setphoneNum] = useState("");
  const [totalCP, setTotalCP] = useState("");
  const [taskData, setTaskaData] = useState([]);
   const [profileImgDisplay, setprofileImgDisplay] = useState("");
  const [profileDescInput, setprofileDescInput] = useState("");
  const [profileDescDisplay, setprofileDescDisplay] = useState("");
  
  const [isedit, setEdit] = useState(true);

  const [fileName, setfileName] = useState("No file choosen"); //display selected file name



  const handleBackbtn = () => {
    Router.back();
  }
  const handleLogout=()=>{

    Swal.fire({
        title: 'Close!',
        text: "Are you sure you want to logout?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {

          localStorage.removeItem("userdetail"),

          Swal.fire({
            position: 'middle',
            icon: 'success',
            title: 'Logout',
            showConfirmButton: false,
            timer: 1500,

          }) 
          Router.push("/");      
            
         
        }
      },
      
      )
      
      
   
    
}


  // base 64 converter
  const getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object

        console.log("Called", reader);
        baseURL = reader.result;
        // console.log(baseURL);
        resolve(baseURL);
        ``
      };
      console.log(fileInfo);
    });
  };

 

  // while user edit the discription
  const HandleEditDesc = () =>{
    setEdit(false);
}

 // update the discription
 const HandleUpdateDesc=async(e)=>{
  e.preventDefault();

  const isLogin = localStorage.getItem("userdetail");
  const usersDetails = JSON.parse(isLogin);

  const phoneNum=usersDetails.phoneNum;
  const username=usersDetails.username;

  console.log(usersDetails);
  
  const data={
  
      // profileImg:profileImg,
      profileDescInput:profileDescInput,
      createdAt:Timestamp.now(),
  }
    const cityRef = doc(db, "AdminLoginTask", phoneNum);
    updateDoc(cityRef, data)
    console.log("discription update", data);
    // alert("update successfully !")
    setEdit(true); 
} 


//Profile image change 
  const handleProfileChange = (e) => {
    e.preventDefault();
    console.log(e.target.files[0]);
    // const file = e.target.files[0];
    const file = e.target.files[0];
    const fileName = e.target.files[0].name;
    setfileName(fileName);
    console.log(fileName);

    const isLogin = localStorage.getItem("userdetail");
    const usersDetails = JSON.parse(isLogin);
    const phoneNum=usersDetails.phoneNum;
    const username=usersDetails.username;

    getBase64(file)
      .then(result => {
        file["base64"] = result;
        console.log("profile image", file);
        setprofileImgDisplay(result)
        const data={
          profileImgDisplay:result,
          // createdAt:Timestamp.now(),
      }
        const cityRef = doc(db, "AdminLoginTask", phoneNum);
        updateDoc(cityRef, data)
        console.log("image update", data);
      })
      .catch(err => {
        console.log(err);
      });

    //   const data={
  
    //     profileImg:profileImgDisplay,
    //     createdAt:Timestamp.now(),
    // }
    // const cityRef = doc(db, "AdminLoginTask", phoneNum);
    // updateDoc(cityRef, data)
    // console.log("update profile image", data);
    // // // alert("update successfully !")
    // setEdit(true); 
  }

 
  useEffect(() => {

    // localhost
    const isLogin = localStorage.getItem("userdetail");
    const usersDetails = JSON.parse(isLogin);
    const phoneNum = usersDetails.phoneNum;
    const username = usersDetails.username;

    console.log(username);

    setusername(usersDetails.username);

    // get all data from firebase
    const getAllDocument = async () => {
      onSnapshot(collection(db, phoneNum), (snapshot) => {
        console.log("Task List", snapshot);
        setTaskaData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        //  total cp point
        const totalCPoints = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        const sumCPoint = totalCPoints.reduce((total, item) => {
          return total + item.ContributionPoints;
        }, 0)

        console.log("total CP points", sumCPoint);

        setTotalCP(sumCPoint);
      })
    }

    // get singledocument

    const getSingleDoc= async()=>{
      const docRef = doc(db,"AdminLoginTask",phoneNum);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data());

            if(docSnap.exists()){            
              setprofileImgDisplay(docSnap.data().profileImgDisplay);
              setprofileDescInput(docSnap.data().profileDescInput);
         
          }
          else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
          // console.log(profileImgDisplay);
              // console.log(profileDescDisplay);


    }
    getSingleDoc();

    getAllDocument();


    // const q = query(collection(db,phoneNum), orderBy('created', 'desc'))
    // onSnapshot(q, (querySnapshot) => {
    //   setTasks(querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data()})))    
    // })
    // console.log();
  }, [])

  return (
    <>

      {/* profile html structure */}
      <section className='c-profile'>
      <div className='footerbg'> <Image src="/loginScreenBg.jpg" alt='loadingimg' width={30} height={100} layout='responsive' priority="true" /></div>
        <div className='sectionHeading'>
          <div>
            <span onClick={handleBackbtn}><MdArrowBackIosNew /></span>
            <h4>Profile</h4>
            {/* <span className='Logout' onClick={handleLogout}><RiLogoutCircleRLine /></span> */}
          </div>

        </div>

        <div className='container'>
          <div className='profiledetails'>


            <div className='profilePic'>
              {
                profileImgDisplay?<img src={profileImgDisplay} alt="profile" />: <Image src="/profileplaceholer.jpg" lt="profile_placeholder"  width={120} height={120} layout='responsive' priority="true" />
              }

              <input id="file-upload"
                type="file"
                name="profileimg"
                onChange={handleProfileChange}
              />
              <label htmlFor='file-upload' className='custom-file-upload'>
                <span htmlFor="file-upload"><AiOutlineCamera /></span>
              </label>
            </div>

            {/* <span id="file-upload"></span>  */}


            {/* <Image src={profilelogoimg} alt="images" layout='fixed' /> */}
            <h2>{username}</h2>
            {/* <p>{profileDescInput}<span id="" onClick={HandlePoupProfile} > <MdKeyboardArrowRight /></span></p> */}
            <div className='profileDesc'>

             <input type="text"  name="profileDescInput"
                  value={profileDescInput}
                    placeholder="Designation"
                    disabled={isedit}
                    onChange={(event) => {
                      setprofileDescInput(event.target.value)
                    }} />

               {isedit ?  <button className='editDesc' onClick={HandleEditDesc}><FiEdit/></button> : <button className='updateDesc' onClick={HandleUpdateDesc}><FiSave/></button>} 
               {/* {isedit? null: <button onClick={HandleUpdateDesc}><FiSave/></button> } */}
            </div>
            

          </div>
          <div className='points'>
            <h2> Your Contribution Point</h2>
            {/* <h1>{totalCP}</h1> */}
            <h1>{totalCP}</h1>
            <button onClick={handleLogout} className='Logoutbtn'><a>Logout</a></button>
          </div>


        </div>
      </section>
      <Footer />


      {/* popup update the profile discription */}
      {/* {isOpen &&
        <div className='profileDescPopup' >

          <input type="text"
            name="profileDescInput"
            value={profileDescInput}
            placeholder="discription"
            onChange={(event) => {
              setprofileDescInput(event.target.value)
            }} />

          <div className='profileDescBtn'> <button className='cancelbtn'> CANCEL </button> <button className='updatebtn' onClick={HandleDescUpdate}>UPDATE</button> </div>
        </div>

      } */}





    </>

  );

}
export default UserProfile;

// export async function getServerSideProps({ query }) {
//   console.log("query", query);
//   return {
//     props: {

//       profileid: query
//     }
//   }
// }
