/* eslint-disable no-use-before-define */
import React,{useEffect,useState} from 'react';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function Contacts(props) {
  const [contacts,SetContacts] = useState([])
  const fixedOptions = [];
  const [value, setValue] = useState([...fixedOptions,]);


  useEffect(() => {
    (async function fetchMyAPI() {
      const res = await fetch(`http://localhost:56794/api/AppUsers/GetUserContacts/${props.userID}`, {
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

  return (
    <Autocomplete
      multiple
      id="fixed-tags-demo"
      value={value}
      onChange={(event, newValue) => {
        setValue([
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
      style={{ width: 400, paddingBottom:200}}
      
      renderInput={(params) => (
        <TextField  {...params} label="Contacts" variant="outlined" placeholder="חפש" />
      )}
    />
  );
}

