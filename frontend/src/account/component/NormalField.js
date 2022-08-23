import React from "react";
import '../style/account.css';

export const NormalField = (title, data, id) => {
    return(
        <secion>
            <div className="row">
                <div className="col-sm-3">
                    <h6 className="mb-0">{title}</h6>
                </div>
                <input className="col-sm-9 text-secondary" readOnly={id==="email_address"} id={id} type="text" defaultValue={data} />
            </div>
            <hr/>
        </secion>
    );
};