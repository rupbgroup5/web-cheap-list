//import  { useContext } from 'react'

//Context Api
//import { IsLocalContext } from "../Contexts/IsLocalContext";

import Swal from 'sweetalert2/dist/sweetalert2.js'

const AuthenticateContact = async (user, requsetSenderName) => {
    //const  { isLocal } = useContext(IsLocalContext); //not working, probably because breaking the Rules of Hooks.
    let apiAppUser = 'http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppUsers/'

    if (true) {
        apiAppUser = 'http://localhost:56794/api/AppUsers/'
    }
    let newUser = {
        UserName: user.PhoneNumber,//The defulat userName is the PhoneNumber until the user will change his name
        PhoneNumber: user.PhoneNumber
    }

    const res = await fetch(`${apiAppUser}AuthenticateContact/${user.PhoneNumber}`, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
        }),
    })
    let member = await res.json();

    if (member.UserID === 0) {
        console.log('id =0')
        const { value: email } = await Swal.fire({
            title: `${user.Name} אינו רשום באפליקציה`,
            text: 'הקלד מייל כדי לשלוח לו הזמנה',
            input: 'email',
            inputPlaceholder: 'הקלד מייל חוקי',
            showCancelButton: 'true',
            confirmButtonText: 'שלח',
            cancelButtonText: 'ביטול'
        })

        if (email) {
            newUser = {
                ...newUser,
                UserMail: email
            }
        }
        console.log(newUser)
        await fetch(`${apiAppUser}SystemPostUser/${requsetSenderName}`, {
            method: 'POST',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            }),
            body: JSON.stringify(newUser)
        }).then(res => { return res.json(); })
            .then(
                (result) => {
                    console.log('The ', result, ' was successfully added!')
                    member = result
                },
                (error) => {
                    console.log(error)
                })

    }
    return member

}

export default AuthenticateContact



