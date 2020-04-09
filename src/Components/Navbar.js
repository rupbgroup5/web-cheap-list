import React from 'react';
import { Link, withRouter } from 'react-router-dom';

// let query = useQuery();


// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }
const Navbar = () => {
    return (
        <nav>
            <Link to='/11'>הקבוצות שלי</Link> |
            <Link to='/TempPage/1'>דף זמני</Link> |
        </nav>
    );
}

export default withRouter(Navbar);
