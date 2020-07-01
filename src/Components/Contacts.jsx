/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function Contacts(props) {
  const [contacts, SetContacts] = useState([])
  const fixedOptions = [];
  const [members, SetMembers] = useState([...fixedOptions,]);


  useEffect(() => {
    (async function fetchMyAPI() {
      const res = await fetch(`http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppUsers/GetUserContacts/${props.userID}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
        }),
      })
      let data = await res.json();
      console.log('data', data)
      SetContacts(data)
    }());

  }, [props.userID])

  const CloseContacts = () => {
    console.log('value', members)
    if (members.length !== 0) {
      props.close(members)
    }
    else { alert('לא בחרת משתתפים עדיין') }

  }

  return (
    <span>
      <h5>בחר אנשי קשר לקבוצת {props.groupName}</h5>
      <Autocomplete
      noOptionsText='אין תוצאות'
        multiple
        id="fixed-tags-demo"
        value={members}
        onChange={(event, newValue) => {
          SetMembers([
            ...fixedOptions,
            ...newValue.filter((option) => fixedOptions.indexOf(option) === -1),
          ]);
        }}
        options={contacts}
        getOptionLabel={(option) => option.Name}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.Name}
              {...getTagProps({ index })}
              disabled={fixedOptions.indexOf(option) !== -1}
            />
          ))
        }

        style={{ width: '100%' }}
        renderInput={(params) => (
          <TextField  {...params} label="אנשי קשר" variant="outlined" placeholder="חפש" />
        )}
      />
      <button onClick={CloseContacts}>הוסף אנשי קשר </button>
    </span>
  );
}

