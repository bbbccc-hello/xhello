import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { Icon ,message, Popover, List } from 'antd';
import cookieUtil from "../libs/cookieUtil";
import HeaderLeft from "../components/HeaderLeft";
import { send } from '../static/webSocket';
import store, {CONSTANT} from "../reducer/reducer";
let state = store.getState();
store.subscribe(function () {
    state = store.getState()
});

import Skin from './Skin';

class HeaderTop extends React.Component{
    constructor(){
        super();
        this.state = {
            menuVisible:false
        }
    }
    loginOut=()=>{
        // location.reload();
        message.success('退出成功！');
        cookieUtil.unset('userName');
        cookieUtil.unset('password');
        cookieUtil.unset('userData');
        let localUri = location.href;
        if(localUri.indexOf('?')){
            location.replace(localUri.split('?')[0]);//针对QQ登录这种场景
        }else{
            location.reload();
        }
    };
    vodPlay(e){
        console.log(e.target.innerText);
        // let roomInfo = state.homeState.currentRoomInfo ;
        if(e.target.innerText === '播放网络视频'){
            let roomInfo = state.homeState.currentRoomInfo;
            if(roomInfo.mode === 1){
                message('已开启直播模式，不能点播');
                return;
            }
            if(roomInfo.mode === 2){
                message('已开启点播模式，不用重复点播');
                return;
            }
            roomInfo.mode = 2;
            roomInfo.player = state.homeState.userInfo.id;
            // store.dispatch({type:CONSTANT.CURRENTROOMINFO,val:roomInfo});
            //切换房间模式，mode
            let sendMsg = {
                type:'msg',
                typeString:'changeRoomMode',
                roomId:roomInfo.roomId,
                roomName:roomInfo.roomName,
                user:state.homeState.userInfo,
                mode:2
            };
            send(JSON.stringify(sendMsg),function () {
                console.log('发送改变房间模式消息成功');
                //http请求改变数据库mode=2
                //ws 发送set_room_info
                let setRoomMsg = {
                    type:'set_room_info',
                    roomId: roomInfo.roomId,		//房间唯一标识符
                    roomName: roomInfo.roomName,
                    user:state.homeState.userInfo,
                    data:roomInfo
                };
                send(JSON.stringify(setRoomMsg),function(){
                    console.log('更新房间mode信息');
                });
            })
        }
    }
    render(){
        const data = ['播放网络视频'];
        const content = (<div className={'vodMenu'} style={{width:'200px',cursor:'pointer'}} onClick={(e)=>this.vodPlay(e)}>
            <List dataSource={data}
                  size="small"
                  bordered
                  renderItem={item => (<List.Item>{item}</List.Item>)}
            >
            </List>
        </div>);
        return (<div>
            <div className="logo">
                <HeaderLeft></HeaderLeft>
            </div>
            <h2>
                中华人民共和国商务部直销查询信息管理系统
            </h2>
            <span style={{cursor:'pointer',position:'absolute',width:80,fontSize:16,right:60,top:3,display:'flex',justifyContent:'space-around',alignItems:'center'}}>
                <span style={{display:state.homeState.userInfo.level < 4?'block':'none'}}>
                    <Popover placement="bottomLeft"
                               content={content}
                               trigger="click">
                        <span><Icon style={{color:'#fff',display:'block',marginTop:'3px'}} type="appstore-o" /></span>
                    </Popover>
                </span>
                <span><Skin></Skin></span>
                    </span>
            <Link to='/'
                  onClick={this.loginOut}
                  style={{position:'absolute',top:5,right:30,cursor:'pointer'}}
            >
                <Icon type="poweroff" style={{fontSize:16,color:'red'}}/>
            </Link>

        </div>)
    }
}

export default HeaderTop;