import React, { useState, useEffect } from 'react'
import LoginComp from "../../components/RegistrationComponents/Login/Login"
import Splash from '../../components/UI/Splash';

function Login() {
    const [showSplash, setShowSplash] = useState(true);
    const isSplashSeen = localStorage.getItem('isSplashSeen');
    useEffect(() => {
        // Check if the splash screen has been seen before

        if (isSplashSeen === 'yes') {
            // If the splash screen has been seen, skip showing it
            setShowSplash(false);
        } else {
            // Otherwise, show the splash screen and set a timer
            const timer = setTimeout(() => {
                setShowSplash(false);
                // Set localStorage flag to prevent splash screen from showing again
                localStorage.setItem('isSplashSeen', 'yes');
            }, 2000); // Adjust timeout as needed

            // Cleanup the timer when component unmounts
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        showSplash ? <Splash /> : <LoginComp />
    )
}

export default Login
