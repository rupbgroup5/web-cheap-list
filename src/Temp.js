import React from 'react'
import { withRouter } from 'react-router-dom'


const Temp = ({ heroName }) => {
    if (heroName === 'Joker') {
        throw new Error('Joker is no hero !');
    }

    return (
        <div>
            {heroName}
        </div>
    );
}

export default withRouter(Temp);
