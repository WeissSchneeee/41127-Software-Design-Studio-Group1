import React from "react";
import '../style/account.css';

export const PasswordField = (title, data, id) => {
    return(
        <secion>
            <div className="row">
                <div className="col-sm-3">
                    <h6 className="mb-0">{title}</h6>
                </div>
                <input className="col-sm-9 text-secondary" id={id} type="password" defaultValue={data} />
            </div>
            <hr/>
        </secion>
    );
}