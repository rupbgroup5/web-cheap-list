import React, { useState, useEffect } from 'react';
import { DeleteIcon } from '../Images/icons';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Badge } from '@material-ui/core';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import swal from 'sweetalert';
import { withRouter, useParams, useHistory} from 'react-router-dom';

//Styles
import '../Styles/HomeStyle.css';

//Our Components
import ListItem from '../Components/ListItem';
import ItemContent from '../Components/ItemContent';
import FormDialog from '../Components/FormDialog';


//Pages






const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
  },
  '& > *': {
    marginBottom: theme.spacing(2),
  },
  '& .MuiBadge-root': {
    marginRight: theme.spacing(4),
  }

}));




const HomePage = () => {
  let { id } = useParams();

  useEffect(() => {
    
    console.log('hey this is your id ' + id);
  });
  
  const classes = useStyles();
  const [teams, AddTeam] = useState([]);
  const [, SetData] = useState();
  const [, triggerComplexItemAction] = useState();
  const [swipeProgress, handleSwipeProgress] = useState();
  const history = useHistory();

  const GetTheNewTeam = (n) => {
    AddTeam([...teams, {
      name: n
    }])
  }




  let Delete = index => {
    if (swipeProgress === 100) {
      swal({
        title: "מחיקת קבוצה",
        text: "!כל רשימות הקבוצה ימחקו גם הם",
        buttons: ['בטל', 'מחק'],
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            teams.splice(index, 1);
            SetData(...teams);
            console.log('delete');
            swal("הקבוצה נמחקה ")
          }
        });
    }
  }

  const swipeRightDataComplex = index => ({
    content: (
      <span style={{ background: 'red', width: '100%', direction: 'ltr' }}>
        <ItemContent
          icon={<DeleteIcon />}
          label="Delete"
          side="right"

        />
      </span>

    ),
    action: () =>
      triggerComplexItemAction(Delete(index))
  });

  const handleClickSL = (name) =>{
    console.log('clicked ' + name);
    history.push(`/OnGroup`,{params:name});

    
     
    
    
  }





  return (
    <div className="container">
      <div className="header">
        <h1>הקבוצות שלי</h1>
      </div>
      <div className="Maincontent"  >
        
        {
          teams.map((team, index) => 
          <span key={index}  onClick={() => handleClickSL(team.name)}>
            <SwipeableList key={index} className={classes.root} threshold={0.25} handleClickSL  >
              <SwipeableListItem 
                swipeRight={swipeRightDataComplex(index)}
                onSwipeProgress={handleSwipeProgress}
              >
                <ListItemAvatar style={{ marginRight: '5px' }} >
                  <Badge badgeContent={10} color="secondary"  >
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  </Badge>
                </ListItemAvatar>
                <ListItem 
                  name={team.name}
                  description="שמות הקבוצה יופיעו פה"
                  
                >
                  
                </ListItem>
              </SwipeableListItem>
            </SwipeableList>
            </span>
          
          )
        }
        
        

      </div>
      <div className="footer">
        <FormDialog getData={GetTheNewTeam} headLine={'יצירת קבוצה'} label={'שם הקבוצה'} />
      </div>
     

    </div>
  );

}

export default withRouter(HomePage)

