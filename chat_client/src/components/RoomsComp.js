import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import './RoomsComp.css';

class RoomsComp extends React.Component {
    render = () => {
        return (
            <div className='rooms'>
                {R.addIndex(R.map)((room, index)=>(<div key={index} onClick={()=>{this.props.clickRoom(room)}}>{room}</div>), this.props.rooms)}
            </div>
        );
    };
}

RoomsComp.propTypes = {
    rooms       : PropTypes.array.isRequired,
    clickRoom   : PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        rooms : state.rooms
    };
};

export default connect(mapStateToProps)(RoomsComp);