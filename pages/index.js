import Head from 'next/head'
import Image from 'next/image'
import SplaceScreen from '../component/users/SplaceScreen'
import Login from '../component/users/Login'
import styles from '../styles/Home.module.css';
import Script from 'next/script';

export default function Home() {
  return (

    <div>
      {/* <SplaceScreen/> */}
      <Login/>
    </div>
    //   <Script>
       
    //   if ("serviceWorker" in navigator) {
    //     navigator.serviceWorker
    //       .register("../service-worker.js")
    //       .then(function (registration) {
    //         console.log("service worker registered");
    //       })
    //       .catch(function (err) {
    //         console.log("error: ",err);
    //       });
    //   }
    
      
    // </Script>
  //   <section className="background">
  //   <div className='youtube-video'>
  //     <iframe src="https://www.youtube.com/embed/-RQKQeJEC9g" title="YouTube video player" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
  //   </div>
  // </section>
  )
}
