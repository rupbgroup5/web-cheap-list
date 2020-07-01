import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
//import Contacts from '../Components/Contacts'


export default function FormDialog(props) {

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleClickOpen = () => {
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);

  };
  let handleCloseOk = () => {
    setOpen(false);
    //SetEnable(true)
    //SetGroupName(value)
    console.log('dialog',value);
    
    props.getData(value);
  }

  


  return (
    <div>
      <Fab color="primary" aria-label="add">
        <AddIcon onClick={handleClickOpen}/>
      </Fab>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.headLine}</DialogTitle>
        <DialogContent>
          <TextField onChange={e => setValue(e.target.value)}
            autoFocus
            margin="dense"
            id="name"
            label={props.label}
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            בטל
          </Button>
          <Button onClick={handleCloseOk} color="primary">
            אישור
          </Button>


        </DialogActions>
      </Dialog>
    </div>
  );
}

