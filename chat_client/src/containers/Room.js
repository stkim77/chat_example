import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { RoomComp, UserListPopUp } from '../components';
import { addHistory, setPopUp, exitRoom } from '../actions';
import { POPUP } from '../common/Enum';
import * as Socket from '../common/connect';

class Room extends React.Component {
    constructor(props) {
        super(props);

        this.clickSendTextBtn       = this.clickSendTextBtn.bind(this);
        this.clickSendImageBtn      = this.clickSendImageBtn.bind(this);
        this.clickGetUserListBtn    = this.clickGetUserListBtn.bind(this);
        this.clickExitRoomBtn       = this.clickExitRoomBtn.bind(this);
        this.clickInviteBtn         = this.clickInviteBtn.bind(this);
    }
    
    componentDidMount = ()=>{
        Socket.addHandlerForChat(this.props.addHistory);
    }

    componentWillUnmount = () => {
        Socket.removeHandlerForChat();
    };

    render = () => {
        return (
            <div>
                <RoomComp clickSendTextBtn={this.clickSendTextBtn} 
                          clickSendImageBtn={this.clickSendImageBtn} 
                          clickExitRoomBtn={this.clickExitRoomBtn} 
                          clickGetUserListBtn={this.clickGetUserListBtn}/>
                {
                    this.props.popup===POPUP.USER_LIST &&
                    <UserListPopUp clickInviteBtn={this.clickInviteBtn}/>
                }
            </div>
        );
    };

    clickSendTextBtn = (contents) => {
        console.log(contents);
        this.props.addHistory({owner:'mine', type:'text', contents});
        Socket.sendChatMessage(contents);
    };

    clickSendImageBtn = (contents) => {
        this.props.addHistory({owner:'mine', type:'image', contents});
        Socket.sendChatImage(contents);
    };

    clickGetUserListBtn = () => {
        this.props.setPopUp(POPUP.USER_LIST);
        Socket.requestUserList();
    };

    clickExitRoomBtn = () => {
        Socket.leaveRoom();
        this.props.exitRoom();
    };

    clickInviteBtn = (userID) => {
        console.log(`Invite User : ${userID}`);
        Socket.inviteUser(userID);
    }
}

Room.propTypes = {
    popup       : PropTypes.string.isRequired,
    addHistory  : PropTypes.func.isRequired,
    setPopUp    : PropTypes.func.isRequired,
    exitRoom    : PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        popup : state.popup
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addHistory  : (chat) => dispatch(addHistory(chat)),
        setPopUp    : (popup) => dispatch(setPopUp(popup)),
        exitRoom    : () => dispatch(exitRoom()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
