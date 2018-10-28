import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Main, NoMatch, SignIn } from './index';
import { receiveRoomList, receiveUserList, receiveInvite, resetStoreInfo } from '../actions';
import * as Socket from '../common/connect';

class Root extends React.Component {
    componentDidMount = ()=>{
        Socket.addHandlerForRooms(this.props.receiveRoomList);
        Socket.addHandlerForUsers(this.props.receiveUserList);
        Socket.addHandlerForInvite(this.props.receiveInvite);
        Socket.addHandlerForNotEnter(this.props.resetStoreInfo);
    }

    componentWillUnmount = () => {
        Socket.removeHandlerForRooms();
        Socket.removeHandlerForUsers();
        Socket.removeHandlerForInvite();
        Socket.removeHandlerForNotEnter();
    };

    render() {
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" render={()=>(<Redirect to="/main"/>)}/>
                        <Route path="/main" component={Main}/>
                        <Route path="/signin" component={SignIn}/>
                        <Route component={NoMatch}/>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

Root.propTypes = {
    receiveRoomList : PropTypes.func.isRequired,
    receiveUserList : PropTypes.func.isRequired,
    receiveInvite   : PropTypes.func.isRequired,
    resetStoreInfo  : PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
    return {
        receiveRoomList : (rooms)=>dispatch(receiveRoomList(rooms)),
        receiveUserList : (users)=>dispatch(receiveUserList(users)),
        receiveInvite   : (data) => dispatch(receiveInvite(data)),
        resetStoreInfo  : () => dispatch(resetStoreInfo())
    };
};

export default connect(null, mapDispatchToProps)(Root);