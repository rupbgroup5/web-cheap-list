import React, { useState, useEffect } from 'react';

const HomePage = () => {
const [data, setData] = useState('');

useEffect(() => {
   

  });



return (
<div>
    <h1>this is the app home page</h1>
    <h2>{data.length !== 0 && data}</h2>

</div>
);
}

export default HomePage;