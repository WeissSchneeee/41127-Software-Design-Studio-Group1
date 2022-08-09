import React from "react";

export const SignUp = _ => {
    return(
        <section className="form-signup">
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
            <button className="w-100 btn-lg" >Sign Up</button>
            {loginLink()}
        </section>
    );
};

const title = _ => {
    return(
        <section>
            <h1>Sign Up</h1>
        </section>
    );
};

const loginLink = _ => {
    return(
        <a href="/signin">Already have an account</a>
    );
};