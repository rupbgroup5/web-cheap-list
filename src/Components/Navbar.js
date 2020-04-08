import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <Link to='/'>הקבוצות שלי</Link> |
            <Link to='/TempPage/:dataFromNativeApp'>דף זמני</Link> |
        </nav>
    );
}

export default withRouter(Navbar);
