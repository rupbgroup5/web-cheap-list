import React from 'react';
import { Link, withRouter, useParams } from 'react-router-dom';

// let query = useQuery();


// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }
const Navbar = () => {
    let { id } = useParams();


    return (
        <nav>
            <Link to={`/${id}`}>הקבוצות שלי</Link> |
            <Link to={`/TempPage/${id}`}>דף זמני</Link> |
        </nav>
    );
}

export default withRouter(Navbar);
