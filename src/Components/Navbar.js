import React from 'react';
import { Link, withRouter } from 'react-router-dom';


const Navbar = ({ id }) => {

    // const history = useHistory()

    return (
        <nav>
            {/* <Link to='/'>ראשי</Link> | */}
            <Link to={`/HomePage/${id}`}>הקבוצות שלי</Link> |
            <Link to={`/TempPage/${id}`}>דף זמני</Link> |
            <br />

        </nav>
    );
}

export default withRouter(Navbar);
