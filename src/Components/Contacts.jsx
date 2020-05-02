import React,{useState, useEffect, useRef} from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';
import {FormControlLabel,FormGroup} from '@material-ui/core';



function Contacts(props) {
  //const { onClose, value: valueProp, open, ...other } = props;
  const [enabled, SetEnabled] = useState(true);
  const [check, setCheck] = useState([]) 
  const radioGroupRef = useRef(null);
  const [contacts, SetContacts] = useState([]);
  const [displayedContacts, SetDisplayContacts] = useState([])


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
      SetDisplayContacts(data)
    }());

  }, [props.userID])

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    SetEnabled(false);
    props.close(false)
  };

  const handleOk = () => {
    let arr = []
    for(var item in check) {
      if (check[item]) {
        arr.push(contacts[item])     
      }
    }
    console.log('arr',arr)
    SetEnabled(false);
    props.close(false,arr)

  };


  const handleChange = (event,index) => {
    let ContactName = displayedContacts[index].Name
    console.log(ContactName)
     setCheck({...check, [ContactName]:event.target.checked} )
     console.log(check)
    }  
    
    
  const searchHandler = (event) => {
    let searchQuery = event.target.value,
    displayedContacts = contacts.filter((el)=>{
      let searchValue = el.Name;
      return searchValue.indexOf(searchQuery) !== -1;
    });
    SetDisplayContacts(displayedContacts)
  }

  return (
    
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={enabled}
    >
      <DialogTitle id="confirmation-dialog-title">
        <input type="text" placeholder="חפש איש קשר" onChange={searchHandler}/>
         </DialogTitle>
      <DialogContent dividers>
          {displayedContacts.map((c,index) => (
            <FormGroup key={index}>
             <FormControlLabel
             control={<Checkbox key={index} onChange={e=>handleChange(e,index)} value={index}  />}
             label={c.Name} 
           />
           </FormGroup>
          ))}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          בטל
        </Button>
        <Button onClick={handleOk} color="primary">
          אישור
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Contacts