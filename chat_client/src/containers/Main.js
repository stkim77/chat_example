import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Rooms, Room } from './index';
import { SCENE } from '../common/Enum';

class Main extends React.Component {
    render() {
        return (
            !this.props.isLogged ? <Route render={()=>(<Redirect to="/signin"/>)}/> :
            this.props.scene===SCENE.ROOM ? <Room /> : <Rooms/>
        );
    }
}

Main.propTypes = {
    isLogged : PropTypes.bool.isRequired,
    scene    : PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
    return {
        isLogged : state.user.isLogged,
        scene    : state.scene
    };
};

export default connect(mapStateToProps)(Main);