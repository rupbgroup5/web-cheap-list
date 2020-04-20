import React from 'react';
import { withRouter, useParams } from 'react-router-dom';




const TempPage = ({ match }) => {


    let { id } = useParams();

    return (
        <div>
            <h1>temp page</h1>
            <h1>look at this id</h1>
            <h2>{id}</h2>
        </div>
    );
}

export default withRouter(TempPage);