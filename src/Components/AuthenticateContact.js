 //import  { useContext } from 'react'

 //Context Api
 //import { IsLocalContext } from "../Contexts/IsLocalContext";



const AuthenticateContact = async (PhoneNumber) => {
    //const  { isLocal } = useContext(IsLocalContext); //not working, probably because breaking the Rules of Hooks.
     let apiAppUser = 'http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppUsers/'
    
     if (false) {
      apiAppUser = 'http://localhost:56794/api/AppUsers/'
     }
     
    const res = await fetch(`${apiAppUser}AuthenticateContact/${PhoneNumber}`, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
        }),
    })
    let member = await res.json();

    if (member.UserID === 0) {
        const newUser = {
            UserName: PhoneNumber,
            PhoneNumber: PhoneNumber //The defulat userName is the PhoneNumber until the user will change his name
        }
        console.log('into if')
        await fetch(`${apiAppUser}SystemPostUser`, {
            method: 'POST',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            }),
            body: JSON.stringify(newUser)
        }).then(res => { return res.json(); })
            .then(
                (result) => {
                    console.log('The ', result, ' was successfully added!')
                    member = result;
                },
                (error) => {
                    console.log(error)
                })
    }
    return member
}

export default AuthenticateContact



