import React from 'react'
import { Link, withRouter, useParams } from 'react-router-dom'


const Navbar = () => {

    let { id } = useParams();

    return (
        <nav>
            {/* <Link to={`/HomePage/${id}`}>הקבוצות שלי</Link> | */}
            {/* <Link to={`/SuperMarketList`}>temp list</Link> | */}
            <br />

        </nav>
    );
}

export default withRouter(Navbar);
