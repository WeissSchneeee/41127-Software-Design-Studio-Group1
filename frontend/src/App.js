import React from "react";
import { Routes, Route, HashRouter, Swi, BrowserRouter } from "react-router-dom";
import { NavBar } from "./navbar/component/navbar";
import { SignIn } from "./account/component/SignIn";
import { Profile } from "./account/component/Profile";
import { AccountList } from "./account/component/AccountList";
import { CourseList } from "./course/component/CourseList";
import { CreateCourseForm } from "./course/component/CreateCourseForm";
import { CourseDetail } from "./course/component/CourseDetail";
import { CreateSubjectForm } from "./subject/component/CreateSubjectForm";

export const getUserID = _ => {
  let token;
  if (localStorage.getItem("rememberMe") === "true")
    token = localStorage.getItem("u");
  else
    token = sessionStorage.getItem("u");
  return fetch("/api/authenticatelogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: token
    })
  })
    .then((res) => res.json())
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
    <Routes>
      <Route path="/" element={<NavBar page="signin" />}>
        <Route path="" element={<SignIn />} />
      </Route>
      <Route path="/signin" element={<NavBar page="signin" />}>
        <Route path="" element={<SignIn />} />
      </Route>
      <Route path="/profile" element={<NavBar page="profile" />}>
        <Route path="" element={<Profile />} />
      </Route>
      <Route path="/accountlist" element={<NavBar page="accountlist" />}>
        <Route path="" element={<AccountList />} />
      </Route>
      <Route path="/courselist" element={<NavBar page="courselist" />}>
        <Route path="" element={<CourseList />} />
        <Route path="create" element={<CreateCourseForm />} />
        <Route path="detail/:id" element={<CourseDetail />} />
        <Route path="update/:id" element={<CreateCourseForm />} />
      </Route>
      <Route path="/subjectlist/:course" element={<NavBar page="subjectlist" />}>
        <Route path="add" element={<CreateSubjectForm />} />
      </Route>
      <Route path="*" element={<NavBar />} />
    </Routes>
  );
}

export default App;
