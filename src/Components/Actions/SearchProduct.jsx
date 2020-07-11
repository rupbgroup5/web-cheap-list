import React, { useState, forwardRef, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Card from 'react-bootstrap/Card'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { css } from "@emotion/core";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";


//ContextApi
import { ProductsCartContext } from "../../Contexts/ProductsCartContext";
import { UserIDContext } from '../../Contexts/UserIDContext';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: 'darkgray',
    textAlign: 'center'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = forwardRef((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});




export default function SearchProduct(props) {
  const classes = useStyles();



  //ContextApi
  const { productCart, SetProductCart } = useContext(ProductsCartContext);


  const [loading,SetLoading] = useState(false)
  const [product,SetProduct] = useState([]) //temp until api is coming back

  const [open, setOpen] = useState(true);

  const [numItem, SetNumItem] = useState({
    '0': 1,
    '1': 1,
    '2': 1,
    '3': 1,
    '4': 1,
    '5': 1,
    '6': 1,
    '7': 1,
    '8': 1
  })

  const override = css`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  width: 100px;
  height: 100px;
  
 ;`;



  const AddItem = (index) => {
    numItem[index] += 1;
    SetNumItem({ ...numItem })
  }

  const RemoveItem = (index) => {
    if (numItem[index] !== 1) {
      numItem[index] -= 1;
      SetNumItem({ ...numItem })
    }
  }



  const handleClose = () => {
    setOpen(false);
    props.CloseDialog()
  };

  const handleClickSearch = () => {
  SetLoading(true);
  setTimeout(() => {
    SetProduct(productCart)
    SetLoading(false)
  }, 5000);
  
  }

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}  >
      {console.log(loading)}
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            חפש מוצר
            </Typography>
        </Toolbar>
      </AppBar>

      <ClimbingBoxLoader
        css={override}
        size={20}
        color={'#36d7af'}
        loading={loading}
      />
      <div className="container">
        <div className="header">
          <input placeholder='הקלד מוצר לחיפש' dir='rtl' /> <br />
          <button onClick={ handleClickSearch}>חפש מוצר</button>
        </div>
        <div className="Maincontent">

          {!loading && <div className='productSerarch'>
            {
              product.map((p, index) =>
                <Card key={index}    >
                  <Card.Img variant="top" src={p.product_image} style={{ width: '50%' }} />
                  <Card.Body>
                    <Card.Title className='product-text'>{p.product_description}</Card.Title>
                    <Card.Text className='product-text'>
                      מחיר: ₪{p.estimatedProductPrice}
                    </Card.Text>
                    <AddIcon style={{ height: '0.7em' }} onClick={() => AddItem(index)} />
                    <label style={{ margin: 20, fontSize: '20px' }}>{numItem[index]}</label>
                    <RemoveIcon style={{ height: '0.7em' }} onClick={() => RemoveItem(index)} />
                    <br />

                    <Button ovariant="primary" color='primary' >הוסף מוצר</Button>
                  </Card.Body>
                  <br />
                </Card>

              )
            }
          </div>}

        </div>
      </div>
    </Dialog>
  )
}
