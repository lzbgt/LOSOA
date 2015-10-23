//全局消息队列
window.__MY_QUEUE__ = "__MY_QUEUE__V6"; //我的所有队列
window.gen__MY_QUEUE__key=function(uid){return __MY_QUEUE__+":"+uid;};

//文件相关的
window.__APP_TYPE_FILE__ = "____APP_TYPE_FILE____";  // 资源 appid;
window.__APP_TYPE_CHECK_IN__ = "____APP_TYPE_CHECK_IN____";  // 资源 appid;

window.__MY_FILE_LIST__ = "__MY_FILE_LIST__V6"; // field = file:uid:timestamp
window.__MY_FILE_QUEUE__ = "__MY_FILE_QUEUE__V6"; // key = __MY_FILE_QUEUE__  {file:uid:timestamp,timestamp}
window.__FILE_ACTION_INFO__ = "__FILE_ACTION_INFO__V7"; //field = file:uid:timestamp;
window.gen__MY_FILE_QUEUE__key=function(uid){return __MY_FILE_QUEUE__+":"+uid;};
window.gen__MY_FILE_LIST__key=function(uid,time){return __MY_FILE_LIST__+":"+uid+":"+time;};

//general message struct for all SMS message type
function OAMessage()
{
	this.appid = null;		//根据appid，获得消息类型
	this.brif = null;		//
	this.contentId = null;		//
	this.createTime = null;	//time message received or sent

	//todo: 先兼容
	this.msgType = null;
	this.timestamp = null;
	this.user = null;
	this.receivers = null;
}

//system message struct, a partial view
function Message() {
	this.from = null;
	this.to = null;
	this.msg = null;
	this.data = null;		//body of the message, required
}

function FileActionInfo(){
  this.viewDateTimes = [];
  this.downloadDateTimes = [];
  this.shareDateTimes = [];
}

// JavaScript Document
var initAction = function(){
};
