import swal from 'sweetalert'

let apiNotifications = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/Notifications/"
let api4informGroupDelte = `http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/Notifications/PostNot2MultipleParticipants`;
if (true) {
    apiNotifications = "http://localhost:56794/api/Notifications/";
    api4informGroupDelte = `http://localhost:56794/api/Notifications/PostNot2MultipleParticipants`;

}

export const AsyncSendPush_GroupDeletedByAdmin = async (admin, exposOfUsers2, idsOfUsersTo, GroupName) => {

    let msg = {
        to: "yet to be implemnted",
        title: `${GroupName} נמחקה`,
        body: `${admin.UserName} מחק את הקבוצה ${GroupName}`,
        badge: 1,
    }
    for (let i = 0; i < exposOfUsers2.length; i++) { //string[]

        msg.to = exposOfUsers2[i];
        await fetch('http://cors-anywhere.herokuapp.com/https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            body: JSON.stringify(msg),
            headers: {
                'Accept': 'application/json',
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json(),)
            .then(json => {
                if (json.data.status === "ok") {
                    console.log(`returned from server\njson.data= ${JSON.stringify(msg.data)}`);
                } else {
                    alert('err json');
                }
            });

    }


    let n = {
        UserFrom: admin.UserID,
        UsersTo: idsOfUsersTo, // int[]
        Title: `${admin.UserName} מחק את הקבוצה ${GroupName}`,
        TypeNot: 'groupDeletedByAdmin',
    }
    fetch(api4informGroupDelte, {
        method: 'POST',
        headers: new Headers({
            'Content-type': 'application/json; charset=UTF-8'
        }),
        body: JSON.stringify(n)
    }).then(res => { return res.json(); })
        .then(
            (result) => {
                console.log("result: ", result)
            },
            (error) => {
                console.log(error)
            })


}

