import React from 'react' //, { useContext }
import { withRouter } from 'react-router-dom'
import { FixedSizeList as List } from 'react-window'; //https://react-window.now.sh/#/examples/list/fixed-size
import Checkbox from '@material-ui/core/Checkbox';

import Button from '@material-ui/core/Button';



//Context Api:
//import { ProductsCartContext } from "../Contexts/ProductsCartContext";



const SuperMarketList = () => {
  //const  { productCart } = useContext(ProductsCartContext); //SetProductCart
  //temp:
  let productCart = ["גיל", "גבינה לבנה 5%", "קוטג'", "חומוס", "חלב", "לחם", "גיל", "גבינה לבנה 5%", "קוטג'", "חומוס", "חלב", "לחם"];

  const Row = ({ index, style }) => (

    <div style={style}>
      {productCart[index]}
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
        {Row}
      </List>

      <div id='taken-list'>
        <h5>בעגלה</h5>
        <List
          height={130}
          itemCount={productCart.length}
          itemSize={30}
          width={200}
        >
          {Row}
        </List>

      </div>

      
      <div id='untaken-list'>
        <h5>מוצרים שלא לקחתי</h5>
        <List
          height={130}
          itemCount={productCart.length}
          itemSize={30}
          width={200}
        >
          {Row}
        </List>

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
