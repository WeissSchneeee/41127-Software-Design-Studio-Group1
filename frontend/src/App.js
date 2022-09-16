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
import { SubjectDetail } from "./subject/component/SubjectDetail";
import { SubjectList } from "./subject/component/SubjectList";
import { AnnouncementList } from "./announcement/component/AnnouncementList";
import { CreateAnAnnouncement } from "./announcement/component/CreateAnAnnouncement";
import { CreateEnrolmentForm } from "./enrolment/component/CreateEnrolmentForm";
import {EnrolmentHomePage} from "./enrolment/component/EnrolmentHomePage";

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
        <Route path="create" element={<CreateSubjectForm />} />
        <Route path="delete/:id" element={<SubjectDetail />} />
        <Route path="detail/:id" element = {<SubjectDetail/>}  />
        <Route path="update/:id" element={<CreateCourseForm />} />
        <Route path="" element = {<SubjectList/>}  />
      </Route>
      <Route path="/announcementlist" element ={<NavBar page="announcementlist"/>}>
        <Route path="" element = {<AnnouncementList/>} />
        <Route path="create" element = {<CreateAnAnnouncement/>} />
      </Route>
      <Route path="/enrolment" element ={<NavBar page="enrolment"/>}>
        <Route path="" element = {<EnrolmentHomePage/>} />
        <Route path="create" element = {<CreateEnrolmentForm/>} />
      </Route>
      <Route path="*" element={<NavBar />} />
    </Routes>
  );
}

export default App;
