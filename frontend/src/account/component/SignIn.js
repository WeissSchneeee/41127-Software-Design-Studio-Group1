import React from "react";

export const SignIn = _ => {
    return(
        <section className="form-signin">
            {title()}
            <section>
                <div className="form-floating">
                    <input type="text" className="form-control" id="email"placeholder="email"/>
                    <label for="email">Email Address</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="password"placeholder="Password"/>
                    <label for="password">Password</label>
                </div>
            </section>
            <div className="checkbox mb-3">
                <input type="checkbox" value="remember-me"/> Remember me
            </div>
            <button className="w-100 btn-lg" >Sign In</button>
            {signupLink()}
        </section>
    );
};

const title = _ => {
    return(
        <section>
            <h1>Sign In</h1>
        </section>
    );
};

const signupLink = _ => {
    return(
        <a href="/signup">Create new account</a>
    );
};