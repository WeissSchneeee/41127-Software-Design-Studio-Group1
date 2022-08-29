import React, { useState } from "react";
import { getUserID } from "../../App";

export const SignIn = _ => {
    const [userID, setUserID] = useState("none");
    let rememberMe = false;

    getUserID().then(res => setUserID(res));

    const handleChange = (e) => {
        rememberMe = e.target.checked;
    };
    const signIn = _ => {
        try{
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            if(!email || !password)
                return alert("Please fill in all fields!");
            fetch("/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    rememberMe: rememberMe
                })
            })
                .then((res) => {return res.json(); })
                .then((data) => {
                    if(!data.status){
                        alert(data.message);
                    }else{
                        localStorage.setItem("rememberMe", rememberMe);
                        if(rememberMe)
                            localStorage.setItem("u", data.loginToken);
                        else
                            sessionStorage.setItem("u", data.loginToken);
                        window.location.href = '/profile';
                    }
                });
        }catch(error){
            alert(error);
        }
    };
    const handleKeypress = e => {
        if(e.key === "Enter"){
            signIn();
        }
    }

    if(userID !== "none") return window.location.href = "/profile";
    return(
        <section className="form-signin">
            <h1>SIGN IN</h1>
            <section>
                <div className="form-floating">
                    <input type="email" className="form-control" id="email" placeholder="email" onKeyPress={handleKeypress} />
                    <label for="email">Email Address</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="password"placeholder="Password" onKeyPress={handleKeypress} />
                    <label for="password">Password</label>
                </div>
            </section>
            <div className="checkbox mb-3">
                <input type="checkbox" value="remember-me" onChange={handleChange}/> Remember me for the next 7 days <br/>
                <button style={{backgroundColor: "transparent"}} onClick={forgetPassword} >Forget Password</button>
            </div>
            <button className="w-100 btn-lg" onClick={signIn} >Sign In</button>
        </section>
    );
};

const forgetPassword = _ => {
    try{
        const email = document.getElementById("email").value;
        fetch("/api/forgetpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then((res) => {return res.json(); })
            .then((data) => {
                alert(data.message);
            });
    }catch(error){
        console.log(error);
    }
};