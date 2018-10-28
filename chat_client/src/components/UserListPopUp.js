import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { setPopUp, receiveUserList } from '../actions';
import { POPUP } from '../common/Enum';
import './UserListPopUp.css';

class UserListPopUp extends React.Component {
    constructor(props) {
        super(props);

        this.closePopUp     = this.closePopUp.bind(this);
        this.createUserDiv  = this.createUserDiv.bind(this);
    }

    render = () => {
        return (
            <div className='users' onClick={this.closePopUp}>
                <div className='users_dim'/>
                <div className='users_div' onClick={(event)=>event.stopPropagation()}>
                    <div className='user_list_title'>
                        <div>초대 가능 사용자</div>
                        <div className='close_btn' onClick={this.closePopUp}>X</div>
                    </div>
                    <div className='user_list_div'>
                    {
                        R.isEmpty(this.props.users) ?
                        <div>초대 가능한 사람이 없습니다.</div>
                        :
                        R.addIndex(R.map)((user, index)=>this.createUserDiv(user, index), this.props.users)
                    }
                    </div>
                </div>
            </div>
        );
    };

    closePopUp = () => {
        this.props.setPopUp(POPUP.NONE);
        this.props.resetUserList();
    }

    createUserDiv = (user, index) => {
        const {id, username} = user;

        return (
            <div key={index} className='user_div'>
                <div className='user_name'>{username}</div>
                <div className='invite_btn' onClick={()=>{this.props.clickInviteBtn(id);this.props.setPopUp(POPUP.NONE);}} >초대하기</div>
            </div>
        );
    };
}

UserListPopUp.propTypes = {
    users           : PropTypes.array.isRequired,
    setPopUp        : PropTypes.func.isRequired,
    clickInviteBtn  : PropTypes.func.isRequired,
    resetUserList   : PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        users : state.users
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPopUp        : (popup) => dispatch(setPopUp(popup)),
        resetUserList   : () => dispatch(receiveUserList({users:[]})),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserListPopUp);