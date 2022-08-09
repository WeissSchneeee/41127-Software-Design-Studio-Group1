import React from "react";
import {Routes, Route} from "react-router-dom";
import { SignUp } from "./account/component/SignUp";
import { SignIn } from "./account/component/SignIn";
import { NavBar } from "./navbar/component/navbar";

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
        <Route path = "/signup" element = {<NavBar page="signup"/>}>
          <Route path = "" element = {<SignUp/>}/>
        </Route>
        <Route path="*" element={<NavBar/>}/>
      </Routes>
    </div>
  );
}

export default App;
