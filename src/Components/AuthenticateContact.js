
  const AuthenticateContact = async (PhoneNumber) => {

   const res = await fetch(`http://localhost:56794/api/AppUsers/AuthenticateContact/${PhoneNumber}`, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
        }),
    })
    let member = await res.json();
    console.log('member', member)
    console.log(PhoneNumber)

    if (member.UserID === 0) {
        const newUser = {
            UserName: PhoneNumber,
            PhoneNumber: PhoneNumber //The defulat userName is the PhoneNumber until the user will change his name
        }
        console.log('into if')
        await fetch("http://localhost:56794/api/AppUsers/SystemPostUser", {
            method: 'POST',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            }),
            body: JSON.stringify(newUser)
        }).then(res => { return res.json(); })
            .then(
                (result) => {
                    console.log('The ', result, ' was successfully added!')
                    member =  result;
                },
                (error) => {
                    console.log(error)
                })
    } 
    return member
    

}

export default AuthenticateContact



