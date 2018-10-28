import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import * as Socket from '../common/connect';
import { SignInComp } from '../components';
import { login } from '../actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class SignIn extends React.Component {
    constructor(props) {
        super(props);

        this.clickLogInBtn = this.clickLogInBtn.bind(this);
    }

    render() {
        return (
            this.props.isLogged ? 
            <Route render={()=>(<Redirect to="/main"/>)}/>
            :
            <SignInComp clickLogInBtn={this.clickLogInBtn}/>
        );
    }

    clickLogInBtn = (userName) => {
        Socket.addUser(userName);
        this.props.login({userName});
    };
}

SignIn.propTypes = {
    isLogged    : PropTypes.bool.isRequired,
    login       : PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        isLogged   : state.user.isLogged
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login   : (user) => dispatch(login(user))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
