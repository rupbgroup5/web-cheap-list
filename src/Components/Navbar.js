import React from 'react';
import { Link, withRouter, useHistory } from 'react-router-dom';


const Navbar = ({ id }) => {

    const history = useHistory()

    return (
        <nav>
            {/* <Link to='/'>ראשי</Link> | */}
            <Link to={`/`}>הקבוצות שלי</Link> |
            <Link to={`/TempPage/${id}`}>דף זמני</Link> |
            <br />

        </nav>
    );
}

export default withRouter(Navbar);
