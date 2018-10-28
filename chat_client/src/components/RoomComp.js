import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import './RoomComp.css';

class RoomComp extends React.Component {
    constructor(props) {
        super(props);

        this.displayRef     = React.createRef();
        this.textRef        = React.createRef();
        this.imageRef       = React.createRef();
       
        this.onSubmitHandle         = this.onSubmitHandle.bind(this);
        this.createChatMessgaeDiv   = this.createChatMessgaeDiv.bind(this);
        this.selectImageFile        = this.selectImageFile.bind(this);
    }

    componentDidUpdate = () => {
        this.displayRef.current.scrollTop = this.displayRef.current.scrollHeight;
    };

    render = () => {
        return (
            <div className='room'>
                <div className='room_title'>
                    <div className='room_name'>{this.props.selectRoom.name}</div>
                    <div className='user_list_btn' onClick={this.props.clickGetUserListBtn}>초대하기</div>
                    <div className='exit_btn' onClick={this.props.clickExitRoomBtn}>나가기</div>
                </div>
                <div className='chat_display' ref={this.displayRef}>
                    <div>
                        {R.addIndex(R.map)(this.createChatMessgaeDiv, this.props.history)}
                    </div>
                </div>
                <div>
                <form className='textForm' onSubmit={this.onSubmitHandle}>
                        <input type='text' ref={this.textRef} />
                        <input type='submit' value='보내기'/>
                    </form>
                    <div className='imageForm'>
                        <input id='fileSelect' type='file' ref={this.imageRef} accept='image/*' onChange={this.selectImageFile}/>
                        <label htmlFor='fileSelect'>이미지전송하기</label>
                    </div>
                </div>
            </div>
        );
    };

    createChatMessgaeDiv = (chat, index) => {
        const username = chat.owner==='mine' ? 'me' : chat.username;
        return (
            <div key={index} className={chat.owner}>
                {
                    (chat.type==='text' || chat.type==='image') &&
                    <div className='username'>
                        {username}
                    </div>
                }
                {
                    chat.type==='text' &&
                    <div className='message'>
                        {chat.contents}
                    </div>
                }
                {
                    chat.type==='image' &&
                    <img src={chat.contents} alt='send file' />
                }
                {
                    chat.type==='announce' &&
                    <div className='announce'>
                        {chat.contents}
                    </div>
                }
            </div>
        );
    };

    onSubmitHandle = (event) => {
        event.preventDefault();
        const chatText = this.textRef.current.value.trim();
        if (R.length(chatText)>200) {
            window.alert(`200글자 이상은 입력하실 수 없습니다. 현재 ${R.length(chatText)}글자 입력하셨습니다.`);
        } else {
            if (!R.isEmpty(chatText)) {
                this.textRef.current.value = '';
                this.props.clickSendTextBtn(chatText);
            }                
        }
    };

    selectImageFile = (event) => {
        const imageFile = R.compose(R.defaultTo(null), R.head)(this.imageRef.current.files);
        const imageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        console.log(imageFile);
        if (!R.isNil(imageFile)) {
            // check file type
            if ( R.compose(R.not, R.contains(R.__, imageTypes), R.defaultTo(''), R.prop('type'))(imageFile)) {
                window.alert('image 파일만 업로드 가능합니다.');
                return;
            }
            
            // size check
            if (R.compose(R.lt(1048576*2), R.prop('size'))(imageFile)) {
                window.alert('파일 크기는 2M를 넘을 수 없습니다.');
                return;
            }

            let reader = new FileReader();
            reader.onload = (e)=>{
                this.props.clickSendImageBtn(e.target.result);
                this.imageRef.current.value = '';
            };
            reader.readAsDataURL(imageFile);
        }

    };

}

RoomComp.propTypes = {
    history             : PropTypes.array.isRequired,
    selectRoom          : PropTypes.object.isRequired,
    clickSendTextBtn    : PropTypes.func.isRequired,
    clickSendImageBtn   : PropTypes.func.isRequired,
    clickGetUserListBtn : PropTypes.func.isRequired,
    clickExitRoomBtn    : PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        history     : state.chatHistory,
        selectRoom  : state.selectRoom
    };
};

export default connect(mapStateToProps)(RoomComp);