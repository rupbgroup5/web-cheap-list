
import swal from 'sweetalert'



let apiNotifications = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/Notifications/"
if (true) {
  apiNotifications = "http://localhost:56794/api/Notifications/"
}

export const SendPushAddToGroup = (token, AdminName, GroupName) => {
  // console.log('token', token, 'Admin', AdminName, 'Group', GroupName)
  let msg = {
    to: token,
    title: 'הוספת לקבוצה',
    body: `${AdminName} הוסיף אותך ל${GroupName}`,
    badge: 1,
    data: { "name": "yogev" },
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
      } else {
        alert('err json');
      }
    });
}

export const SendPushAskForProduct = (userFrom, userTo, group, list, p) => {
  console.log('userFrom', userFrom, 'userTo', userTo, 'Group', group, 'ListName', list, 'product', p)
  //msg to push!
  let msg = {
    to: userTo.ExpoToken,
    title: `${userFrom.UserName} מבקש מוצר`,
    body: `מרשימת הקניות "${list.ListName}" הנמצאת ב"${group.GroupName}"`,
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
          UserTo: userTo.UserID,
          Title: `${userFrom.UserName} מבקש להוסיף ${p.Quantity} יח של ${p.product_description}`,
          Body: `במחיר של ₪${p.estimatedProductPrice * p.Quantity}`,
          TypeNot: 'AskProduct',
          GroupID: group.GroupID,
          ListID: list.ListID,
          DataObject: JSON.stringify(p)
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
              swal('הבקשה נשלחה בהצלחה')
            },
            (error) => {
              console.log(error)
            })
      } else {
        console.log('err json');
      }
    });
}

export const ApproveRequest = (userFrom, userTo, group, list, p) => {
  console.log('userFrom', userFrom, 'userTo', userTo, 'Group', group, 'ListName', list, 'product', p)
  //msg to push!
  let msg = {
    to: userTo.ExpoToken,
    title: `${userFrom.UserName} אישר את בקשתך`,
    body: `${p.product_description} התווסף לרשימת ${list.ListName}`,
    badge: 1,
  }
  console.log('pppp', p.product_description)
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
        console.log(`returned from server\njson.data= ${(json.data)}`);

        let n = {
          UserFrom: userFrom.UserID,
          UserTo: userTo.UserID,
          Title: 'בקשתך אושרה', // text on React 
          Body: `${userFrom.UserName} הוסיף ${p.Quantity} יח של ${p.product_description} לסל הקניות`,
          TypeNot: 'ApproveRequest',
          GroupID: group.GroupID,
          ListID: list.ListID
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
        console.log('err json');
      }
    });
}

export const DeclineRequest = (userFrom, userTo, group, list, p) => {
  console.log('userFrom', userFrom, 'userTo', userTo, 'Group', group, 'ListName', list, 'product', p)
  //msg to push!
  let msg = {
    to: userTo.ExpoToken,
    title: `${userFrom.UserName} סירב לבקשתך`,
    body: `להוסיף את ${p.product_description} לרשימת ${list.ListName}`,
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
        console.log(`returned from server= ${(JSON.stringify(json.data.status))}`);

        let n = {
          UserFrom: userFrom.UserID,
          UserTo: userTo.UserID,
          Title: 'בקשתך סורבה', // text on React 
          Body: `${userFrom.UserName} סירב להוסיף את  ${p.product_description} לסל הקניות`,
          TypeNot: 'DeclineRequest',
          GroupID: group.GroupID,
          ListID: list.ListID
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
        console.log('err json');
      }
    });
}

export const SendPushIDeletedMySelf = (userFrom, admin, GroupRef) => {

  //msg to push!
  let msg = {
    to: admin.ExpoToken,
    title: `${userFrom.UserName} יצא מהקבוצה`,
    body: `${userFrom.UserName} מחק את עצמו מהקבוצה ${GroupRef.GroupName}`,
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
          Title: `${userFrom.UserName} מחק את עצמו מהקבוצה ${GroupRef.GroupName}`,
          GroupID: GroupRef.GroupID,
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
        console.log('err json');
      }
    });
}

export const SendPushRemovedByAdmin = (admin, userTo, GroupRef) => {

  //msg to push!
  let msg = {
    to: userTo.ExpoToken,
    title: `${admin.UserName} הסיר אותך מהקבוצה`,
    body: `${admin.UserName} הסיר אותך מהקבוצה ${GroupRef.GroupName}`,
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
          Title: `${admin.UserName} הסיר אותך מהקבוצה ${GroupRef.GroupName}`,
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
        console.log('err json');
      }
    });
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
  fetch(apiNotifications + 'PostNot2MultipleParticipants', {
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

export const ChangeGroupNamePush = async (userFrom, usersTo, oldGroupName, newGroupName) => {

  let msg = {
    to: "yet to be implemnted",
    title: `שם הקבוצה של "${oldGroupName}" השתנה`,
    badge: 1,
  }
  for (let i = 0; i < usersTo.length; i++) { //string[]
    msg.to = usersTo[i].ExpoToken;
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
  let ArrUserToID = [];
  usersTo.forEach(element => {
    ArrUserToID.push(element.UserID)
  });

  console.log(ArrUserToID)

  let n = {
    UserFrom: userFrom.UserID,
    UsersTo: ArrUserToID, // int[]
    Title: `שם הקבוצה של "${oldGroupName}" שונה`,
    Body: `${userFrom.UserName} החליף את שם הקבוצה ל ${newGroupName}`,
    TypeNot: 'ChangeGroupName',
  }
  fetch(apiNotifications + 'PostNot2MultipleParticipants', {
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

export const ChangeListNamePush = async (userFrom, usersTo, oldListName, newListName, groupID) => {

  let msg = {
    to: "yet to be implemnted",
    title: `שם הרשימה של "${oldListName}" השתנה`,
    badge: 1,
  }
  for (let i = 0; i < usersTo.length; i++) { //string[]
    msg.to = usersTo[i].ExpoToken;
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
  let ArrUserToID = [];
  usersTo.forEach(element => {
    ArrUserToID.push(element.UserID)
  });



  let n = {
    UserFrom: userFrom.UserID,
    UsersTo: ArrUserToID, // int[]
    Title: `שם הרשימה של ${oldListName}`,
    Body: `${userFrom.UserName} החליף את שם הקבוצה ל "${newListName}"`,
    GroupID: groupID,
    TypeNot: 'ChangeListName',
  }
  fetch(apiNotifications + 'PostNot2MultipleParticipants', {
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





