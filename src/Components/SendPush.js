

export const SendPushAddToGroup = (token, AdminName,GroupName) => {
    console.log('token',token,'Admin',AdminName,'Group',GroupName)
    let msg = {
        to: token,
        title: 'הוספת לקבוצה',
        body: `${AdminName} הוסיף אותך ל${GroupName}`,
        badge: 1,
        data: { name: "yogev" }
      }
  
      fetch('http://cors-anywhere.herokuapp.com/https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        body: JSON.stringify(msg),
        headers: {
            'Accept': 'application/json',
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then(response => response.json())
        .then(json => {
          if (json != null) {
            console.log(`returned from server\njson.data= ${JSON.stringify(json.data)}`);
          } else {
            alert('err json');
          }
        });

}
 