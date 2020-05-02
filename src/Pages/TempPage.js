import React from 'react';
import { withRouter, useParams } from 'react-router-dom';




const TempPage = () => {


    let { id, name } = useParams();
    //  const list = localStorage.getItem('list')

    const TestTheFetch = () => {
        alert('lets go')
        let localUrl = 'http://localhost:56794/api/AppUsers/updateUserContacts';
        let newUser = {
             UserID: 1,
            Contacts: [{ Name: `ג'לאל ה.עו"ד gam engli`, PhoneNumber: '972526485161123' }, { Name: 'הלוואי בריבוע', PhoneNumber: '+972-50555-4422' }]

        }
        fetch(localUrl, {
            method: 'POST',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            }),
            body: JSON.stringify(newUser)
        }).then(res => { return res.json(); })
            .then(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    console.log(error)
                })

    }


    // let borla = () => {
    //     console.log(JSON.parse(list));

    // }

    return (
        <div>
            <h1>temp page</h1>
            <h1>look at this id</h1>
            <h2>{id}, {name}</h2>
            <button onClick={TestTheFetch}>test the localStorage</button>
        </div>
    );

}
export default withRouter(TempPage);