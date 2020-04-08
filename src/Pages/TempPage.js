import React from 'react';
import { withRouter } from 'react-router-dom';



const tempPage = (props) => {
    return (
        <div>
            <h1>temp page</h1>
    נתונים שנשלחו מהניטיב: <h3>{props.match.params.dataFromNativeApp}</h3>

        </div>
    );
}

export default withRouter(tempPage);
