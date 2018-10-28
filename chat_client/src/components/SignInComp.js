import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import './SignInComp.css';

class SignInComp extends React.Component {
    constructor(props) {
        super(props);

        this.nameRef = React.createRef();
        this.onSubmitHandle = this.onSubmitHandle.bind(this);
    }

    render() {
        return (
            <div className='signin'>
                <form onSubmit={this.onSubmitHandle}>
                    <input type='text' ref={this.nameRef} placeholder='닉네임' maxLength='10' />
                    <input type='submit' value='입장'/>
                </form>
                <label>닉네임은 10자까지 사용 가능합니다.</label>
            </div>
        );
    }

    onSubmitHandle = (event) => {
        event.preventDefault();
        const name = this.nameRef.current.value.trim();
        if (!R.isEmpty(name)) {
            this.props.clickLogInBtn(name);
        }
    };
}

SignInComp.propTypes = {
    clickLogInBtn    : PropTypes.func.isRequired
};

export default SignInComp;
