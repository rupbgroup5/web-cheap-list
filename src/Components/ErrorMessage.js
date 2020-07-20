import React from 'react';
import { withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';



const useStyles = makeStyles((theme) => ({
    root: {
        margin: '12vh 0 auto 0',
        width: '100vw',
        height: '50vh',
        background: '#313131',
    },
    errImg: {
        borderRadius: '50%',
        height: '38vh',
        width: '66vw',
        margin: '3vh 15vw'
    },
    errP: {
        fontFamily: 'Roboto',
        textAlign: 'right',
        fontSize: '1.3em',
        fontWeight: 'bold',
    }

}));

const ErrorMessage = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <SnackbarContent
                message={
                    <p className={classes.errP}>נראה שארעה תקלה אנא נסו שוב מאוחר יותר
                    < img src="https://as2.ftcdn.net/jpg/03/04/67/27/500_F_304672710_8DWlfHoh8T9zNFbx7rRZPmUzteYfcBVa.jpg" className={classes.errImg} />
                    </p>
                }
                action={
                    <Button color="secondary" size="small">חזרה לדף הבית</Button>
                }
            />
        </div>
    );
}

export default withRouter(ErrorMessage);
