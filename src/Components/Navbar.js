import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div>
            <Link to='/'>הקבוצות שלי</Link> |
            <Link to='/tempPage'>דף זמני</Link> |
        </div>
    );
}

export default Navbar;
