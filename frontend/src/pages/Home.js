
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import Cookies from 'universal-cookie';

import './home.css';

export default function Home() {

  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // redirect when login is successful
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard")
    }
  }, [isLoggedIn, navigate])

  function signUp(e) {
    if(!(
      document.getElementById("s-fName").value === "" ||
      document.getElementById("s-lName").value === "" ||
      document.getElementById("s-studentNo").value === "" ||
      document.getElementById("s-email").value === "" ||
      document.getElementById("s-password").value === "")
    ) {
      if ((!isNaN(parseInt(document.getElementById("s-studentNo").value)) && document.getElementById("s-studentNo").value > 200000000)) {
        if (document.getElementById("s-email").value.includes("@up.edu.ph")) {
          if (document.getElementById("s-password").value.length >= 8) {
            e.preventDefault();

          // form validation goes here 
      
          fetch("http://localhost:3001/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                firstName: document.getElementById("s-fName").value,
                middleName: document.getElementById("s-mName").value,
                lastName: document.getElementById("s-lName").value,
                studentNumber: document.getElementById("s-studentNo").value,
                email: document.getElementById("s-email").value,
                password: document.getElementById("s-password").value
              })
            })
            .then(response => response.json())
            .then(body => {
              if (body.success) {
                alert("Successfully sign up!")
              }
              else { alert("Sign up failed")}
            })
          } else {
            alert("REMINDER: Password must be at least 8 characters")
          }
        } else {
          alert("REMINDER: Input in UP Mail is incorrect")
        }
      } else {
        alert("REMINDER: Input in Student Number is incorrect")
      }
    } else {
      alert("REMINDER: All fields should be filled")
    }
  }

  function logIn(e) {
    e.preventDefault();

    // form validation goes here

    fetch("http://localhost:3001/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: document.getElementById("l-email").value,
          password: document.getElementById("l-password").value
        })
      })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          setIsLoggedIn(true)
          // successful log in. store the token as a cookie
          const cookies = new Cookies()
          cookies.set(
            "authToken",
            body.token,
            {
              path: "localhost:3001/",
              age: 60*60,
              sameSite: false
            });

          localStorage.setItem("username", body.username);
        }
        else { alert("Log in failed")}
      })
  }
  
  return (
    <>
      <div id="main-div">
        <div id="intro-div">
        <img src={process.env.PUBLIC_URL+"authentication-bg.png"} style={{height: "600px"}} />
        </div>
        <div id="credentials-div">
          <div id="student">
            <h1>STUDENT MODE</h1>
          </div>
          <div id="login-div">
            <h2>Login</h2>
              <input id="l-email" placeholder="UP Mail" />
              <input id="l-password" type="password" placeholder="Password" />
            <button id="login" onClick={logIn}>Log In</button>
          </div>
          <div id="question">
          <h5>Don't have account yet? Fill the Sign Up Form</h5>
          </div>
          <div id="signup-div">
            <h2>Sign Up</h2>
              <input id="s-fName" placeholder="First Name" />
              <input id="s-mName" placeholder="Middle Name" />
              <input id="s-lName" placeholder="Last Name" />
              <input id="s-studentNo" placeholder="Student Number (e.g., 202312345)" pattern="[20]{2}[0-9]{2}[0-9]{5}" minLength="9" maxLength="9"/>
              <input id="s-email" placeholder="UP Mail (e.g., jldelacruz@up.edu.ph)" pattern="[a-z0-9]+@[up.edu.ph]{9}"/>
              <input id="s-password" type="password" placeholder="Password" minLength="8"/>
            <button id="signup" onClick={signUp}>Sign Up</button>
          </div>
        </div>
      </div>
    </>
  )
}