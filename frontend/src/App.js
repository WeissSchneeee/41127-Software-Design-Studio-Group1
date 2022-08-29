import React from "react";
import {Routes, Route} from "react-router-dom";
import { NavBar } from "./navbar/component/navbar";
import { SignIn } from "./account/component/SignIn";
import { Profile } from "./account/component/Profile";
import { AccountList } from "./account/component/AccountList";

export const getUserID = _ => {
  let token;
  if(localStorage.getItem("rememberMe") === "true")
    token = localStorage.getItem("u");
  else
    token  = sessionStorage.getItem("u");
  return fetch("/api/authenticatelogin", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: token
    })
  })
    .then((res) => res.json() )
    .then((data) => {
      return String(data.userID);
    })
    .catch(error => {
      console.log(error);
      return "none";
    });
};
export const logOut = _ => {
  sessionStorage.removeItem("u");
  localStorage.removeItem("u");
  localStorage.removeItem("rememberMe");
};

function App() {
  return (
    <div>
      <Routes>
        <Route path = "/" element = {<NavBar page="signin"/>}>
          <Route path = "" element = {<SignIn/>}/>
        </Route>
        <Route path = "/signin" element = {<NavBar page="signin"/>}>
          <Route path = "" element = {<SignIn/>}/>
        </Route>
        <Route path = "/profile" element = {<NavBar page="profile"/>}>
          <Route path = "" element = {<Profile/>}/>
        </Route>
        <Route path = "/accountlist" element = {<NavBar page="accountlist"/>}>
          <Route path = "" element = {<AccountList/>}/>
        </Route>
        <Route path="*" element={<NavBar/>}/>
      </Routes>
    </div>
  );
}

export default App;
