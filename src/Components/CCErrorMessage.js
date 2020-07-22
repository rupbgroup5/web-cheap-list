import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import ErrorMessage from './ErrorMessage'
//----------------------------------------------------
/** THIS COMPONENT HAS TO BE A CLASS COMPONENT !!! */
//----------------------------------------------------
class CCErrorMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false
        }
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true
        }
    }


    render() {
        if (this.state.hasError) {
            return <ErrorMessage />
        }
        return this.props.children;
    }
}

export default withRouter(CCErrorMessage);
//----------------------------------------------------
/** THIS COMPONENT HAS TO BE A CLASS COMPONENT !!! */
//----------------------------------------------------




