import React from 'react';

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

export default Temp;
