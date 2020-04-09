import  React from 'react';
import { withRouter, useLocation} from 'react-router-dom';

function MyGroup() {
    const location = useLocation();
    const groupName = location.state.params
    return (
        <div>
            <h1>הרשימות שלי </h1>
            <h2>{groupName}</h2>         
        </div>
    );
};

export default withRouter(MyGroup);