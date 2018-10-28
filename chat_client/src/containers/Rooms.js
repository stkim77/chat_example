import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { RoomsComp } from '../components';
import { enterRoom } from '../actions';
import * as Socket from '../common/connect';

class Rooms extends React.Component {
    constructor(props) {
        super(props);

        this.clickRoom = this.clickRoom.bind(this);
    }

    render() {
        return (
            <RoomsComp clickRoom={this.clickRoom} />
        );
    }

    clickRoom = (roomName) => {
        // console.log(`clickRoom : ${roomName}`);
        Socket.joinRoom(roomName);
        this.props.enterRoom(roomName);
    };
}

Rooms.propTypes = {
    rooms       : PropTypes.array.isRequired,
    enterRoom   : PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        rooms   : state.rooms
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        enterRoom   : (name) => dispatch(enterRoom(name)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);