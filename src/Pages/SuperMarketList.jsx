import React, { useState } from 'react' //, { useContext }
import { withRouter } from 'react-router-dom'
import { FixedSizeList as List } from 'react-window'; //https://react-window.now.sh/#/examples/list/fixed-size
import Checkbox from '@material-ui/core/Checkbox';

import Button from '@material-ui/core/Button';



//Context Api:
//import { ProductsCartContext } from "../Contexts/ProductsCartContext";



const SuperMarketList = () => {
  //const  { productCart } = useContext(ProductsCartContext); //SetProductCart
  //temp:
  const [productCart, SetProductCart ] = useState(["גבינה לבנה 5%", "קוטג'", "חומוס", "חלב", "לחם"]);
  const [takenArray, SettakenArray] = useState([]);
  const [unTakenArray, SetUnTakenArray] = useState([]);

  const HandleChecked = (productName, productIndex) => {
    let temp = [];
    for (let i = 0; i < productCart.length; i++){
      if(i !== productIndex){
        temp.push(productCart[i]);
      }
    } 
    SetProductCart(temp);
    takenArray.push(productName);

  }
  const HandleUnChecked = (productName, productIndex) =>{
    let temp = [];
    for (let i = 0; i < takenArray.length; i++){
      if(i !== productIndex){
        temp.push(takenArray[i]);
      }
    } 
    SettakenArray(temp);
    productCart.push(productName);
  }

  const ProductInCart = ({ index, style }) => (
    <div style={style}>
      {productCart[index]}
      <Checkbox
        color="primary"
        onClick={()=>{HandleChecked(productCart[index], index)}}
      />
    </div>
  );

  const ProductInTaken = ({ index, style }) => (
    <div style={style}>
      {takenArray[index]}
      <Checkbox
        color="primary"
        checked={true}
        onClick={()=>{HandleUnChecked(takenArray[index], index)}}
      />
    </div>
  );
  const ProductInUnTaken = ({ index, style }) => (
    <div style={style}>
      {unTakenArray[index]}
      <Checkbox
        color="primary"
      />
    </div>
  );

  return (
    <div id='lists-container'>

      <h3 id="list-header">הרשימה שלי בסופר</h3>
      <List
        height={220}
        itemCount={productCart.length}
        itemSize={30}
        width={300}
      >
        {ProductInCart}
      </List>

      <div id='taken-list'>
        <h5>נכנס לעגלה</h5>
        {takenArray.length === 0 ? <p>העגלה עדיין ריקה</p>: 
        <List
          height={100}
          itemCount={takenArray.length}
          itemSize={30}
          width={200}
        >
         {ProductInTaken}
        </List>
      }
      </div>

      
      <div id='untaken-list'>
        <h5>מוצרים שלא לקחתי</h5>
        {takenArray.length === 0 ? <p>רשימה זו ריקה</p>: 
        <List
          height={100}
          itemCount={unTakenArray.length}
          itemSize={30}
          width={200}
        >
          {ProductInUnTaken}
        </List>
}
      </div>

      <div id='finishBtn'>
        <Button variant="contained" color="primary" >
        סיימתי קנייה
        </Button>
      </div>
          </div>

  )
}

export default withRouter(SuperMarketList);
