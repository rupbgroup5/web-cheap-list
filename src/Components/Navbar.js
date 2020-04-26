import React from 'react'
import { Link, withRouter } from 'react-router-dom'


const Navbar = ({ id }) => {

    // const history = useHistory()

    return (
        <nav>
            <Link to={`/HomePage/${id}`}>הקבוצות שלי</Link> |
            <Link to={`/TempPage/${id}/${null}`}>דף זמני</Link> | {/**must have the null property */}
            <br />

        </nav>
    );
}

export default withRouter(Navbar);
