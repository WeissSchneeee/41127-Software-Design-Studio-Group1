import React from "react";
import "../style/account.css";

export const CreateUserForm = (users, setUsers) => {
    const handleKeypress = e => {
        if(e.key === "Enter"){
            createUser();
        }
    }
    const createUser = _ => {
        try{
            const accountType = document.getElementById("accountTypeSelection").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const contactNumber = document.getElementById("contactNumber").value;
            const role = document.getElementById("role").value;
            const dob = document.getElementById("dob").value;
            if(!(email && password && firstName && contactNumber) || ((accountType === "a" || accountType === "e") && !role) || (accountType === "s" && !dob))
                return alert("Please fill in all of the non-optional data!");
            if(password.length < 8)
                return alert("Password must be at least 8 characters!");
            fetch("/api/createuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    accountType: accountType,
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    contactNumber: contactNumber,
                    role: role,
                    dob: dob
                })
            })
                .then((res) => { return res.json(); } )
                .then((data) => {
                    alert(data.message);
                    if(data.status){
                        const newList = [...users];
                        newList.push(data.user);
                        setUsers(newList);
                        closeForm();
                    }
                });
        }catch(error){
            console.log(error);
        }
    };
    return(
        <section id="createAccountForm" className="form-popup center form-container">
            <h2>CREATE NEW ACCOUNT</h2>
            <div className="form-floating">
                <select id="accountTypeSelection" onChange={event => setSpecialInfoField(event.target.value) } >
                    <optgroup label="Account Types">
                        <option value="a">System Admin</option>
                        <option value="e">Staff</option>
                        <option value="s">Student</option>
                    </optgroup>
                </select>
            </div>
            <div id="roleField" className="form-floating">
                <input type="text" id="role" className="form-control" placeholder="Role" onKeyPress={handleKeypress} />
                <label >Role</label>
            </div>
            <div className="form-floating">
                <input type="email" id="email" className="form-control" placeholder="Email" required onKeyPress={handleKeypress} />
                <label >Email</label>
            </div>
            <div className="form-floating">
                <input type="password" id="password" className="form-control" placeholder="Password" required onKeyPress={handleKeypress} />
                <label >Password</label>
            </div>
            <div>
                <div className="form-floating left-field">
                    <input type="text" id="firstName" className="form-control" placeholder="First Name" required onKeyPress={handleKeypress} />
                    <label >First Name</label>
                </div>
                <div className="form-floating right-field">
                    <input type="text" id="lastName" className="form-control" placeholder="Last Name" onKeyPress={handleKeypress} />
                    <label >Last Name (optional)</label>
                </div>
            </div>
            <div className="form-floating">
                <input type="text" id="contactNumber" className="form-control" placeholder="Contact Number" required onKeyPress={handleKeypress} />
                <label >Contact Number</label>
            </div>
            <div id="dobField" className="form-floating" style={{display: "none"}}>
                <input type="date" id="dob" className="form-control" />
                <label >Date of Birth</label>
            </div>
            <div className="center-side-button" style={{float: "right"}} >
                <button type="button" className="btn-lg" onClick={createUser}>Create</button>
                <button type="button" className="btn-lg" onClick={closeForm} >Cancel</button>
            </div>
        </section>
    );
};

const setSpecialInfoField = (type) => {
    if(type === "a" || type === "e"){
        document.getElementById("roleField").style.display = "block";
        document.getElementById("dobField").style.display = "none";
    }else{
        document.getElementById("roleField").style.display = "none";
        document.getElementById("dobField").style.display = "block";
    }
};

const closeForm = _ => {
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("contactNumber").value = "";
    document.getElementById("role").value = "";
    document.getElementById("createAccountForm").style.display = "none";
};