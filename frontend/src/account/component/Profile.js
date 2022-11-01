import React, { useEffect, useState } from "react";
import { getUserID, logOut } from "../../App";
import "../style/account.css";
import { NormalField } from "./NormalField";
import { PasswordField } from "./PasswordField";
import { DateField } from "./DateField";
import { Confirmation } from "./Confirmation";

export const Profile = _ => {
    const [userID, setUserID] = useState();
    const [user, setUser] = useState({
        generalInfo: {},
        specialInfo: {}
    });

    const [buttonClicked, setButtonClicked] = useState(null);

    useEffect(() => {
        try{
            getUserID().then(res => setUserID(res));
        }catch(error){
            console.log(error);
        }
    }, []);

    useEffect(() => {
        try{
            const getUserData = async _ => {
                const res = await fetch("/api/getprofile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userID: userID
                    })
                });
                const data = await res.json();
                if(data.status){
                    const newData = {
                        generalInfo: data.user,
                        specialInfo: data.specialData
                    };
                    setUser(newData);
                }
            };
            if(userID != null && userID !== "none") getUserData();
        }catch(error){
            console.log(error);
        }
    }, [userID]);

    const items = [];
    items.push(NormalField("Email Address", user.generalInfo.email_address, "email_address"));
    items.push(PasswordField("Password", user.generalInfo.password, "password"));
    items.push(NormalField("First Name", user.generalInfo.first_name, "first_name"));
    items.push(NormalField("Last Name (optional)", user.generalInfo.last_name, "last_name"));
    items.push(NormalField("Contact Number", user.generalInfo.contact_number, "contact_number"));
    
    if(user.generalInfo.user_type === "s")
        items.push(DateField("Date of Birth", String(user.specialInfo.date_of_birth).substring(0,10), "dob"));

    // Confirmation Pop Up Window
    const openEditValidation = _ => {
        setButtonClicked("edit");
        openForm();
    };
    const openDeleteValidation = _ => {
        setButtonClicked("delete");
        openForm();
    };
    const openForm = _ => {
        document.getElementById("myForm").style.display = "block";
    }
    const closeForm = _ => {
        document.getElementById("validationPass").value = "";
        document.getElementById("myForm").style.display = "none";
    }
    const accountModification = _ => {
        if(buttonClicked === "edit")
            editPersonalInformation(userID, user, setUser, closeForm);
        else
            deleteAccount(userID);
    };

    if(userID === "none") return window.location.href = "/signin";
    return(
        <section>
            <section className="profile">
                <div className="container">
                    <div className="main-body">
                        <div className="row gutters-sm">
                            {Confirmation(accountModification, closeForm)}
                            {profilePicture(user)}
                            {userData(items, openEditValidation, openDeleteValidation)}
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
};

const editPersonalInformation = (userID, user, setUser, closeForm) => {
    const password = document.getElementById("password").value;
    const validationPass = document.getElementById("validationPass").value;
    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const contactNumber = document.getElementById("contact_number").value;
    const dob = String(user.generalInfo.user_type).toLowerCase() === "s" ? document.getElementById("dob").value : "";
    if(!(password && firstName && contactNumber))
        return alert("Please fill in all of the non-optional data!");
    if(!validationPass)
        return alert("Please input your old password for verification!");
    if(password.length < 8)
        return alert("Password must be at least 8 characters!");
    fetch("/api/updateuser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID: userID,
            password: password,
            validationPass: validationPass,
            firstName: firstName,
            lastName: lastName,
            contactNumber: contactNumber,
            dob: dob
        })
    })
        .then((res) => { return res.json(); } )
        .then((data) => {
            alert(data.message);
            if(data.status){
                const newData = {
                    generalInfo: data.user,
                    specialInfo: String(user.generalInfo.user_type).toLowerCase() === "s" ? data.specialInfo : user.specialInfo
                };
                setUser(newData);
                closeForm();
            }
        });
};
const deleteAccount = (userID) => {
    const validationPass = document.getElementById("validationPass").value;
    if(!validationPass)
        return alert("Please input your old password for verification!");
    fetch("/api/deleteuser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID: userID,
            validationPass: validationPass
        })
    })
        .then((res) => { return res.json(); } )
        .then((data) => {
            alert(data.message);
            if(data.status){
                logOut();
                window.location.href='/signin';
            }
        });
};

const profilePicture = (user) => {
    return (
        <div className="col-md-4 mb-3">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                        <img src="https://i.pinimg.com/564x/89/64/99/8964998576cfac440b3a14df748fc670.jpg" alt="Admin" className="rounded-circle profile-picture" width="200" height="200"/>
                        <div className="mt-3">
                            <h4>{user.generalInfo.first_name + " " + (user.generalInfo.last_name ? user.generalInfo.last_name : "")}</h4>
                            <p className="text-secondary mb-1">ACCOUNT: 
                                {String(user.generalInfo.user_type).toLowerCase()==='s'? " STUDENT":(
                                    String(user.generalInfo.user_type).toLowerCase() === 'a'? " SYSTEM ADMIN" : (
                                        String(user.generalInfo.user_type).toLowerCase() === 'e'? " STAFF" : "" 
                                    )
                                )}
                            </p>
                            {(String(user.generalInfo.user_type).toLowerCase()==='a' || String(user.generalInfo.user_type).toLowerCase()==='e') && <p className="text-secondary mb-1">ROLE: {String(user.specialInfo.role).toUpperCase()}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const userData = (items, openEditValidation, openDeleteValidation) =>{
    return(
        <div className="col-md-8">
            <div className="card mb-3">
                <div className="card-body">
                    {items}
                    <div className="column right-side-button">
                        <button class="btn-lg" onClick={openEditValidation} >Edit</button>
                        <button class="btn-lg" onClick={openDeleteValidation} >Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    );
};