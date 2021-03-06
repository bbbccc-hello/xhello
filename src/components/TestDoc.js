import React,{ Component } from 'react';
import store from '../reducer/reducer';
import { Button, Popover, message } from 'antd';
import {send} from '../static/webSocket';
import {remaininglogsSendToserver} from '../static/comFunctions';
let state = store.getState();
store.subscribe(function () {
    state = store.getState();
});
const testClick = function () {
    let content, fileName, saveBtn;
    let year,month,day,hour,minute,second;
    let date =new Date();
    year = date.getFullYear();
    month = date.getMonth()+1;
    day = date.getDate();
    hour = date.getHours();
    minute = date.getMinutes();
    second = date.getSeconds();
    content = window.localStorage.getItem(state.homeState.userInfo.name);
    fileName = state.homeState.userInfo.name+'_'+year+month+day+hour+minute+second+'.txt';
    saveBtn = document.querySelector( '#test-doc' );
    // content.addEventListener( 'change', function self(){
    //     saveBtn.setAttribute( 'href', 'data:text/paint; utf-8,' + content.value );
    //     return self;
    // }() );
    saveBtn.setAttribute( 'href', 'data:text/paint; utf-8,' + content );
    saveBtn.setAttribute( 'download', fileName);
    remaininglogsSendToserver();
};
const getMeshForConnected = function () {
    let msg = {
        type:'get_room_users',
        roomId:state.homeState.currentRoomInfo.roomId,
        action:'getMesh'
    };
    send(JSON.stringify(msg),function () {
        console.log('getMesh');
    });
};
class TestDoc extends Component{
    constructor(props){
        super(props);
        this.state = {popVisible:false,serverDataVisible:false,interval:null};
        this.serverDataClick = this.serverDataClick.bind(this);
    }
    testBtnClick(){
        this.setState({popVisible:!this.state.popVisible});
    }
    testMasterAV(){
        if(window.localStorage.getItem('audio') === 'ok'){
            if(window.localStorage.getItem('video') === 'ok'){
                message.success('音频流（声音）与视频流（画面）均已获取到',10);
            }else{
                message.error('音频流（声音）已获取到，视频流（画面）未获取到',10);
            }
        }else{
            if(window.localStorage.getItem('video') === 'ok'){
                message.error('音频流（声音）未获取到，视频流（画面）已获取到',10);
            }else{
                message.error('音频流（声音）与视频流（画面）均未获取到',10);
            }
        }
    }
    getContent(){
        return  (<div style={{width:'150px'}}>
            <a id={'test-doc'} onClick={testClick}><Button style={{zIndex:1000}}>下载测试数据</Button></a>
            <br/>
            <a href={'./testTools/mesh.html'} target={'_blank'} onClick={getMeshForConnected}><Button style={{zIndex:1000}}>获取连接状态</Button></a>
            <br/>
            <a href={'./testTools/facetracking/facetRacking.html'} target={'_blank'}><Button style={{zIndex:1000}}>检测摄像头</Button></a>
            <br/>
            <a href={'./testTools/audioTest.html'} target={'_blank'}><Button style={{zIndex:1000}}>检测麦克风</Button></a>
            <br/>
            <a href={'javascript:void(0)'}><Button style={{zIndex:1000}} onClick={()=>this.testMasterAV()}>检测直播音视频</Button></a>
            <br/>
            <a href={'./testTools/serverData.html'} target={'_blank'}><Button style={{zIndex:1000}} onClick={()=>this.serverDataClick()}>服务器通讯量</Button></a>
            <br/>
            <a href={'javascript:void(0)'}><Button style={{zIndex:1000}} onClick={()=>this.serverDelayClick()}>通信延时</Button></a>
            <br/>
            <a href={'./testTools/browserEnv.html'}><Button style={{zIndex:1000}} onClick={()=>this.serverDelayClick()}>检测功能支持</Button></a>
        </div>);
    }
    serverDataClick(){
        console.log('serverDataClick');
        const _this = this;
        // this.setState({serverDataVisible:!this.state.serverDataVisible});
        this.intervalSendCounts();
        setInterval(function () {
            _this.intervalSendCounts();
        },5000);
    }
    intervalSendCounts(){
        let msg = {
            type:'get_count',
            user:state.homeState.userInfo,
            data:''
        };
        send(JSON.stringify(msg),function () {
        });
    }
    serverDelayClick(){
        console.log('serverDelayClick');
        let sdMsg = {
            type:'msg',
            typeString:'serverDelay',
            roomId:state.homeState.currentRoomInfo.roomId,
            ToUserOnly:state.homeState.userInfo.id,
            timestamp:new Date().getTime()
        };
        send(JSON.stringify(sdMsg),function () {
            console.log('已发送serverDelay消息');
        });
    }
    render(){
        return (<div>
        <Popover placement='top'
                 title={'测试工具'}
                 content={this.getContent()}
                 visible={this.state.popVisible}
                 trigger='click'>
            <Button onClick={()=>this.testBtnClick()} style={{position:'absolute',right:'20px',bottom:'10px',zIndex:1000}}>测试工具</Button>
        </Popover>
           {/* <div id={'serverData'} style={{display:this.state.serverDataVisible?'block':'none',position:'absolute',border:'1px solid red',width:'238px',height:'80px',top:'90px',right:'300px',backgroundColor:'white'}}>
                <p>服务器发送:<span id={'send'} style={{color:'blue'}}>0</span></p>
                <p>服务器接收:<span id={'recive'} style={{color:'blue'}}>0</span></p>
            </div>*/}
    </div>);
    }
}

export default TestDoc;