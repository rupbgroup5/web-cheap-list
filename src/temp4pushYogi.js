import swal from 'sweetalert'

let apiNotifications = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/Notifications/"
if (true) {
    apiNotifications = "http://localhost:56794/api/Notifications/"
}

export const SendPushIDeletedMySelf = (userFrom, admin, GroupName) => {

    //msg to push!
    let msg = {
        to: admin.ExpoToken,
        title: `${userFrom.UserName} יצא מהקבוצה`,

        body: `${userFrom.UserName} מחק את עצמו מהקבוצה ${GroupName}`,
        badge: 1,
    }
    fetch('http://cors-anywhere.herokuapp.com/https://exp.host/--/api/v2/push/send', {
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
                let n = {
                    UserFrom: userFrom.UserID,
                    UserTo: admin.UserID,
                    Title: `${userFrom.UserName} מחק את עצמו מהקבוצה ${GroupName}`,
                    TypeNot: 'RemovedSelf',
                    DataObject: ""
                }
                fetch(apiNotifications, {
                    method: 'POST',
                    headers: new Headers({
                        'Content-type': 'application/json; charset=UTF-8'
                    }),
                    body: JSON.stringify(n)
                }).then(res => { return res.json(); })
                    .then(
                        (result) => {
                            console.log('The ', result, ' was successfully sent!')
                        },
                        (error) => {
                            console.log(error)
                        })
            } else {
                alert('err json');
            }
        });
}

export const SendPushRemovedByAdmin = (admin, userTo, GroupName) => {

    //msg to push!
    let msg = {
        to: userTo.ExpoToken,
        title: `${admin.UserName} הסיר אותך מהקבוצה`,
        body: `${admin.UserName} הסיר אותך מהקבוצה ${GroupName}`,
        badge: 1,
    }
    fetch('http://cors-anywhere.herokuapp.com/https://exp.host/--/api/v2/push/send', {
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
                let n = {
                    UserFrom: admin.UserID,
                    UserTo: userTo.UserID,
                    Title: `${admin.UserName} הסיר אותך מהקבוצה ${GroupName}`,
                    TypeNot: 'RemovedByAdmin',
                    DataObject: ""
                }
                fetch(apiNotifications, {
                    method: 'POST',
                    headers: new Headers({
                        'Content-type': 'application/json; charset=UTF-8'
                    }),
                    body: JSON.stringify(n)
                }).then(res => { return res.json(); })
                    .then(
                        (result) => {
                            console.log('The ', result, ' was successfully sent!')
                        },
                        (error) => {
                            console.log(error)
                        })
            } else {
                alert('err json');
            }
        });
}



