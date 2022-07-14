import React,{useState,useEffect} from 'react';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress'
import logoimg from '../../public/logo.png';

function SplaceScreen() {

  const Router =useRouter();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
  
    // Wait for 3 seconds
    setTimeout(() => {
      setIsLoading(false);
      Router.push('/user/login');
    }, 3000);
  }, []);


  return(
  <>
      <section className='c-splacescreen background'>
        <div className='container'>
        <Image src={logoimg} placeholder="blur" alt='logo' layout='fixed' />
          <h2>Contribution Mechanisms</h2>
                  </div>


      </section>
    
    </>
  )
}

export default SplaceScreen;
