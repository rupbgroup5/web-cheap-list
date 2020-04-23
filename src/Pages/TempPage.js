import React from 'react';
import { withRouter, useParams } from 'react-router-dom';




const TempPage = ({ match }) => {


    let { id } = useParams();



    const TestTheFetch = () => {
        alert('lets go')
        //api/AppUsers/PostUser OR updateUserContacts
        let localUrl = 'http://localhost:56794/api/AppUsers/updateUserContacts';
        let newUser = {
            UserID: 23,
            UserName: 'checkManager',
            UserMail: 'checkManager@gmail.com',
            Contacts: [{ Name: '!!!!!!!!!!!!!!!!!!!!!!', PhoneNumber: '050-5554422' }, { Name: 'הלוואי בריבוע', PhoneNumber: '050-5554422' }]

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


    return (
        <div>
            <h1>temp page</h1>
            <h1>look at this id</h1>
            <h2>{id}</h2>
            <button onClick={TestTheFetch}>test the fetch</button>
        </div>
    );
}

export default withRouter(TempPage);