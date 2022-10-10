import React from "react";
import { Routes, Route } from "react-router-dom";
import { NavBar } from "./navbar/component/navbar";
import { SignIn } from "./account/component/SignIn";
import { Profile } from "./account/component/Profile";
import { AccountList } from "./account/component/AccountList";
import { CourseList } from "./course/component/CourseList";
import { CreateCourseForm } from "./course/component/CreateCourseForm";
import { CourseDetail } from "./course/component/CourseDetail";
import { CreateSubjectForm } from "./subject/component/CreateSubjectForm";
import { CourseListStudent } from "./student/course/CourseListStudent";
import { CourseDetailStudent } from "./student/course/CourseDetailStudent";
import { SubjectList } from "./subject/component/SubjectList";
import { SubjectDetail } from "./subject/component/SubjectDetail";
import { Dashboard } from "./student/dashboard/Dashboard";
import { DashboardHowToUse } from "./student/dashboard/DashboardHowToUse";
import { SubjectListStudent } from "./student/subject/SubjectListStudent";
import { SubjectDetailStudent } from "./student/subject/SubjectDetailStudent";
import { AnnouncementList } from "./announcement/component/AnnouncementList";
import { CreateAnAnnouncement } from "./announcement/component/CreateAnAnnouncement";
import { AnnouncementDetails } from "./announcement/component/AnnouncementDetails";
import { StudentAnnouncementList } from "./student/announcement/StudentAnnouncementList"
import { StudentAnnouncementDetails } from "./student/announcement/StudentAnnouncementDetails"
import { StudentEnrollment } from "./student/enrollment/StudentEnrollment";
import { SysLogList } from "./syslog/SysLogList";
import { ErequestStudentForm } from "./student/erequest/ErequestStudentForm";
import { ErequestStudent } from "./student/erequest/ErequestStudent";
import { RecommendationForm } from "./student/recommendation/RecommendationForm";
import { SessionList } from "./session/component/SessionList";

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
      <Route path="/subjectlist/" element={<NavBar page="subjectlist" />}>
        <Route path="" element={<SubjectList />} />
        <Route path="create" element={<CreateSubjectForm />} />
        <Route path="update/:id" element={<CreateSubjectForm />} />
        <Route path="detail/:id" element={<SubjectDetail />} />
      </Route>
      <Route path="/announcementlist" element={<NavBar page="announcementlist" />}>
        <Route path="" element={<AnnouncementList />} />
        <Route path="create" element={<CreateAnAnnouncement />} />
        <Route path="detail/:id" element={<AnnouncementDetails />} />
        <Route path="update/:id" element={<CreateAnAnnouncement />} />
      </Route>
      <Route path="/student/courselist" element={<NavBar page="student/courselist" />}>
        <Route path="" element={<CourseListStudent />} />
        <Route path="detail/:id" element={<CourseDetailStudent />} />
      </Route>
      <Route path="/student/subjectlist" element={<NavBar page="student/subjectlist" />}>
        <Route path="detail/:id" element={<SubjectDetailStudent />} />
        <Route path="" element={<SubjectListStudent />} />
      </Route>
      <Route path="/student/courselist" element={<NavBar page="student/courselist" />}>
        <Route path="" element={<CourseListStudent />} />
        <Route path="detail/:id" element={<CourseDetailStudent />} />
      </Route>
      <Route path="/student/announcementlist" element={<NavBar page="student/announcementlist" />}>
        <Route path="" element={<StudentAnnouncementList />} />
        <Route path="detail/:id" element={<StudentAnnouncementDetails />} />
      </Route>
      <Route path="/student/dashboard" element={<NavBar page="student/dashboard" />}>
        <Route path="howtouse" element={<DashboardHowToUse />} />
        <Route path="" element={<Dashboard />} />
      </Route>
      <Route path="/student/enrollment" element={<NavBar page="student/enrollment" />}>
        <Route path="" element={<StudentEnrollment />} />
      </Route>
      <Route path="/student/erequest" element={<NavBar page="student/erequest" />}>
        <Route path="create" element={<ErequestStudentForm />} />
        <Route path="" element={<ErequestStudent />} />
      </Route>
      <Route path="/student/recommendation" element={<NavBar page="student/recommendation" />}>
        <Route path="" element={<RecommendationForm />} />
      </Route>      
      <Route path="/syslog/" element={<NavBar page="syslog" />}>
        <Route path="" element={<SysLogList />} />
      </Route>
      <Route path="/session/" element={<NavBar page="sessionlist" />}>
        <Route path="" element={<SessionList />} />
      </Route>
      <Route path="*" element={<NavBar />} />
    </Routes>
  );
}

export default App;
