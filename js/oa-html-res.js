var mainhtml = `
<div id="loadZone" ng-controller="appController" class="app">
<div class="header">
  <div class="top">
    <div class="top-left fl">
    <div class="logo fl">LOS OA平台</div>
    <div class="fl f20">{{user.fullName}}，{{ampm}}好！</div>
    </div>
    <div class="top-right fl f22"><a href="" ng-click="ToggleNewTask()" class="c-fff built-task"><span class="plus">+</span>发起任务</a></div>
    </div>
    </div>
<div class="main pr">
  <div class="leftnav fl">
    <ul>
    <li><a  ui-sref="home"  id="homepage">首页<span class="hide"></span></a></li>
    <li><a  ui-sref="task"  id="taskpage">任务<span class="hide"></span></a></li>
    <li><a  ui-sref="sign"  id="signpage">考勤<span class="hide"></span></a></li>
	<li><a  ui-sref="file"  id="filepage">资源<span class="hide"></span></a></li>
	<li><a  ui-sref="apps"  id="apps">应用中心<span class="hide"></span></a></li>
	</ul>

	<div>
        <ng-include src="'recentlyFile.html'"></ng-include>
    </div>
  </div>
  <div class="right-info fl">
	<div ui-view></div>
  </div>
  <!--新建任务弹出-->
  <div class="built pa built-alert">
  <div class="f18 c-333">新建任务</div>
  <div class="mt15"><input ng-model="newTask.title" ng-required="true" class="new-built w650"/></div>
  <div class="mt10"><textarea ng-model="newTask.body" ng-required="true" ng-change="" cols="45" rows="5" class="new-area"></textarea></div>
  <div class="built-to mt10">
  <div class="fl">
  <span class="mr60">任务分配给：
  <select name="taskowner" id="taskowner" ng-model="newTask.toUser">
  <option ng-repeat="user in users" value="{{user.uid}}">{{user.fullName}}</option>
  </select></span>
     <div class="mt10">截止时间：<input type="number" ng-model="deadLineDays.value" min="1" max="356" style="width:3em;" required></input>天</div>
     <div class="mt8 ">标记为：<span ng-switch on="newTask.finished">
        <button name="taskstatus" ng-switch-when='true' ng-click='newTask.finished=false'>完成</button>
        <button name="taskstatus" ng-switch-when='false' ng-click='newTask.finished=true'>未完成</button>
    </span>
  </div>
  </div> <div>
  <span>任务相关人：<span ng-dropdown-multiselect="" options="multiSelOAUsers" selected-model="newTask.ccUsers" extra-settings="{enableSearch: true}">
  </span></span></div> </div>

  <div class="mt10"><a href="#" class="alert-btn b-blue" ng-click="CreateTask(null, newTask)">创建</a></div>
  </div>
  <!--打印报表的任务弹出-->
  <div class="form-main pa">
     <div class="f18 c-333 ml30">{{taskFlow[0].title}}</div>
	 <div class="form-list" ng-repeat="task in taskFlow">
        <div class="bor-red">
		   <div class="form-info">
		      <div class="form-name overf">
			     <div class="names fl">{{task.user.fullName[0]}}</div>
				 <div class="form-right fl">
				   <p>发起人 {{task.user.fullName}}</p>
				   <p ng-bind-html="task.body|marked"></p>
				 </div>
			  </div>
			  <div class="c-org mt10">{{TimeFromNow(task.timestamp)}}</div>
			  <div class="mt3">
			    <div class="fl"><span class="mr30">分配给：{{task.receivers[0].fullName}}</span><span>相关人：<span ng-repeat="u in task.receivers.slice(1)">{{u.fullName}}&nbsp;</span></span></div>
				<div class="fr c-org" ng-switch on="task.status==true">
						<div ng-switch-when="true">任务已经完成</div>
						<div ng-switch-when="false">{{TimeFromNow(task.deadline)}}到期</div>
			  </div>
		   </div>
		</div>
	 </div>
   </div>

  <div ng-if="taskFlow[taskFlow.length-1].receivers[0].uid == G.uid && !taskFlow[taskFlow.length-1].status">
	 <div class="mt15"><textarea name="textarea" id="textarea" cols="45" rows="5" class="form-area" ng-model="newTaskRep.body"></textarea></div>
   <div class="built-to mt10"><span class="mr60">任务分配给：<select ng-model="newTaskRep.toUser">
   <option ng-repeat="user in users" value="{{user.uid}}">{{user.fullName}}</option>
   </select></span><span>任务相关人：<span ng-dropdown-multiselect="" options="multiSelOAUsers" selected-model="newTaskRep.ccUsers" extra-settings="{enableSearch: true}">
   </span></span></div>
	 <!-- div class="mt10">截止时间：<span counter value="deadLineDays.value" min="1" max="365" step="1" editable></span>天</div -->
   <div class="mt10">截止时间：<input type="number" ng-model="deadLineDays.value" min="1" max="356" style="width:3em;" required></input>天</div>

   <div class="mt8 ">标记为：<span ng-switch on="newTaskRep.finished">
         <button name="taskstatus" ng-switch-when='true' ng-click='newTaskRep.finished=false'>完成</button>
         <button name="taskstatus" ng-switch-when='false' ng-click='newTaskRep.finished=true'>未完成</button>
     </span>
   </div>
	<div class="mt10"><a href="#" class="alert-btn b-org" ng-click="CreateTask(taskFlow[taskFlow.length-1], newTaskRep)">提交</a></div>
  </div>
  </div>

<!--签到弹出-->

<div class="built pf sign-alert"  ng-controller="signController" >
   <div class="f18 c-333">签到</div>
	 <div class="sign-main" class="mt15" >
	   <dl class="mt15">
	     <dt class="c-999">今天</dt>
		 <dd ng-repeat="sign in todaysign" ng-switch="sign.status">
		 <span ng-switch-when="签到" >@{{sign.name}}<span class="ml10">{{sign.signtime | formatTime }}</span><span class="ml10">在<i class="tb location"></i>{{sign.address}}</span><span class="ml10 c-zi">{{sign.status}}</span></span>
		 <span ng-switch-when="签退" >@{{sign.name}}<span class="ml10">{{sign.workofftime | formatTime }}</span><span class="ml10">在<i class="tb location"></i>{{sign.address}}</span><span class="ml10 c-zi">{{sign.status}}</span></span>
		 </dd>
		</dl>
	   <dl class="mt45">
	     <dt class="c-999">昨天</dt>
		 <dd ng-repeat="sign in yesterdaysign" ng-switch="sign.status">
		 <span ng-switch-when="签到" >@{{sign.name}}<span class="ml10">{{sign.signtime | formatTime }}</span><span class="ml10">在<i class="tb location"></i>{{sign.address}}</span><span class="ml10 c-zi">{{sign.status}}</span></span>
		 <span ng-switch-when="签退" >@{{sign.name}}<span class="ml10">{{sign.workofftime | formatTime }}</span><span class="ml10">在<i class="tb location"></i>{{sign.address}}</span><span class="ml10 c-zi">{{sign.status}}</span></span>
		 </dd>
		</dl>
	 </div>
</div>

</div>
</div>



<script type="text/ng-template" id="alert.html">
<div class="alert"  role="alert">
  <div ng-transclude></div>
</div>
</script>

<script type="text/ng-template" id="home.html">
<div class="right-info fl">
  <div class="task-left fl">
      <alert class="notice mb10" ng-click="MsgAlertOnClick()" template-url="alert.html" ng-if="messageAlert.count" > <i class="tb notice-tb mr15"></i> 收到来自{{messageAlert.users[0].fullName}} <span ng-repeat="u in messageAlert.users.slice(1,2)">
      ,{{u.fullName}}</span>的 <span class="c-orgm">{{messageAlert.count}}</span> 条消息 <a href="#" class="c-orgm ml10">查看</a></alert>
      <div class="task-list" ng-class="MsgTypeToCssClass(msg)" ng-click="msgclick(msg)" ng-repeat="msg in messagesList.slice().reverse().slice(homeItemsPerPage*(homeCurrentPage-1), homeItemsPerPage*homeCurrentPage)">
        <div ng-if="msg.msgType == GetTaskMsgType()">
          <div class="names fl">{{msg.user.fullName[0]}}</div>
          <div class="task-info fl">
            <div class="task-alert" ng-click="ToggleFlow(msg.uid)"}>
              <div class="overf"><div class="fl f16">{{msg.user.fullName}}</div><div class="fr c-999">{{TimeFromNow(msg.timestamp)}}</div></div>
              <div class="leave-out mt3"><p ng-if="!msg.rootTask">{{msg.title}}</p><div ng-bind-html="msg.body|marked"></div></div>
            </div>
            <div class="task-up" ng-if="msg.rootTask">
              <div class="task-title leave-out">{{msg.rootTask.user.fullName}}: {{msg.rootTask.title}}</div>
              <div class="tc mt10 tb-down" ng-click="ToggleRootTask($event)">&#x25BE</div>
              <div class="task-down mt5" ng-click="ToggleRootTask($event)" >
                <p class="lh22" ng-bind-html="msg.rootTask.body|marked"></p>
                <p class="c-999 mt5"><span class="mr20">发起人: {{msg.rootTask.user.fullName}}</span><span class="mr20">
                  分配给： {{msg.rootTask.receivers[0].fullName}}</span><span>相关人：
                  <span ng-if="msg.rootTask.receivers.length > 1" ng-repeat="u in msg.rootTask.receivers.slice(1)">{{u.fullName}}&nbsp;</span></span></p>
                  <p class="c-org f12 mt10"><i class="tb time"></i>{{Date(msg.rootTask.deadline).Format("yyyy-MM-dd")}}</p>
                  <div style="text-align:center">&#x25B4;</div>
                </div>

              </div>
              <div class="task-more mt10"><span class="mr20">分配给: {{msg.receivers[0].fullName}}</span><span>相关人：</span><span ng-repeat="u in msg.receivers.slice(1)">{{u.fullName}}&nbsp;</span></div>
            </div>
          </div>
          <div ng-if="msg.msgType == GetFileMsgType()">
			 <div class="names fl">{{GetUserbyUid(msg.fromUid).fullName[0]}}</div>
			 <div class="task-info fl">
			   <div class="access-info">
				 <div class="overf mt5">
					<div class="fl f16">
						<span class="">{{msg.brif}}</span>
					</div>
					<div class="fr c-999">{{TimeFromNow(msg.timestamp)}}</div>
				 </div>
			   </div>
			 </div>
		  </div>
          <div ng-if="msg.msgType == GetCheckInMsgType()">
          <div class="names fl">{{msg.brif.name[0]}}</div>
          <div class="task-info fl">
          <div ng-click="alertsign()" ng-switch="msg.brif.status">
          <div class="overf" >
          <div class="fl f16" ng-switch-when="0">{{msg.brif.name}}<span class="ml15">{{msg.brif.signtime | formatTime}}</span><span class="ml15">在<i class="tb location"></i>{{msg.brif.address}}<span class="c-zi ml10">签到</span></span></div>
          <div class="fl f16" ng-switch-when="1">{{msg.brif.name}}<span class="ml15">{{msg.brif.workofftime | formatTime}}</span><span class="ml15">在<i class="tb location"></i>{{msg.brif.address}}<span class="c-zi ml10">签退</span></span></div>
          <div class="fr c-999">{{TimeFromNow(msg.timestamp)}}</div></div>
          </div>
          </div>
          </div>
        </div>

        <uib-pagination total-items="messagesList.length" ng-model="homeCurrentPage" items-per-page="homeItemsPerPage" max-size="homeNumBtns" rotate="false" ng-change="homeChangePage()" class="pagination-sm" boundary-links="true"></uib-pagination>

      </div>

      <div class="task-right fl">
        <div class="task-no">
          <div class="no-title f18 c-333"><div class="fl">待处理({{tasksTodo.length}})</div><a ui-sref="task" class="fr" >全部</a></div>
          <div class="no-info">
           <ul ng-repeat="task in tasksTodo.slice().reverse().slice(0,4)">
             <li>
               <a href="" ng-click="ToggleFlow(task.uid)">
                <p class="leave-out">任务：{{task.title||task.body}}</p>
                <p class="c-org f12 mt5"><i class="tb time"></i>{{Date(task.timestamp).Format("yyyy-MM-dd")}}</p>
              </a>
            </li>
           </ul>
    </div>
  </div>

  <div class="task-no mt15">
  <div class="no-title f18 c-333"><div class="fl">同事列表</div></div>
	 <div class="classmate pt10 pb10">
	   <ul ng-repeat="u in users" ng-switch="u.status">
	     <li ng-switch-when="active"><span class="mate-name b-zi">{{u.fullName[0]}}</span>{{u.fullName}}
	     <span class="built-task fr" style=" margin-right: 10px; border: 0px solid #C289CE;" ng-click="ToggleNewTask(u.uid)">发起</span>
	     </li>
	     <li ng-switch-when="noactive"><span class="mate-name b-hui">{{u.fullName[0]}}</span>{{u.fullName}}<span class="c-huiq">[离线]</span></li>
	   </ul>
	 </div>
</div>



</div>
</div>
</script>

<script type="text/ng-template" id="task.html">
<div class="right-info fl">
<div class="task-left fl">

<div class="my-nav task-list overf">
<ul>
<li name="tasksTodo" class="my-active" ng-click="SwitchTasksTab($event)">待处理({{tasksTodo.length}})</li>
<li name="tasksToMe" ng-click="SwitchTasksTab($event)">分配给我的({{tasksToMe.length}})</li>
<li name="tasksICreated" ng-click="SwitchTasksTab($event)">我发起的({{tasksICreated.length}})</li>
<li name="tasksCCMe" ng-click="SwitchTasksTab($event)">抄送我的({{tasksCCMe.length}})</li>
</ul>
</div>

<div>

<div id="tasksTodo">
<div class="task-list" ng-repeat="msg in tasksTodo.slice().reverse()">
<div class="names fl">{{msg.user.fullName[0]}}</div>
<div class="task-info fl">
  <div class="task-alert" ng-click="ToggleFlow(msg.uid)"}>
    <div class="overf"><div class="fl f16">{{msg.user.fullName}}</div><div class="fr c-999">{{TimeFromNow(msg.timestamp)}}</div></div>
    <div class="leave-out mt3"><p ng-if="!msg.rootTask">{{msg.title}}</p>
        <div ng-bind-html="msg.body|marked"></div>
  <div class="task-up" ng-if="msg.rootTask">
  <div class="task-title leave-out">{{msg.rootTask.user.fullName}}: {{msg.rootTask.title}}</div>
  <div class="tc mt10 tb-down" ng-click="ToggleRootTask($event)">&#x25BE</div>
  <div class="task-down mt5" ng-click="ToggleRootTask($event)">
    <p class="lh22" ng-bind-html="msg.rootTask.body|marked"></p>
    <p class="c-999 mt5"><span class="mr20">发起人: {{msg.rootTask.user.fullName}}</span><span class="mr20">
    分配给： {{msg.rootTask.receivers[0].fullName}}</span><span>相关人：
    <span ng-if="msg.rootTask.receivers.length > 1" ng-repeat="u in msg.rootTask.receivers.slice(1)">{{u.fullName}}&nbsp;</span></span></p>
    <p class="c-org f12 mt10"><i class="tb time"></i>{{Date(msg.rootTask.timestamp).Format("yyyy-MM-dd")}}</p>
    <div style="text-align:center">&#x25B4;</div>
    </div>
    </div>
    </div>
    </div>
  <div class="task-more mt10"><span class="mr20">分配给: {{msg.receivers[0].fullName}}</span><span>相关人：</span><span ng-repeat="u in msg.receivers.slice(1)">{{u.fullName}}&nbsp;</span></div>
</div>
</div>
</div>

<div id="tasksToMe" style="display:none;">
<div class="task-list" ng-repeat="msg in tasksToMe.slice().reverse()">
<div class="names fl">{{msg.user.fullName[0]}}</div>
<div class="task-info fl">
  <div class="task-alert" ng-click="ToggleFlow(msg.uid)"}>
    <div class="overf"><div class="fl f16">{{msg.user.fullName}}</div><div class="fr c-999">{{TimeFromNow(msg.timestamp)}}</div></div>
    <div class="leave-out mt3"><p ng-if="!msg.rootTask">{{msg.title}}</p>
        <div ng-bind-html="msg.body|marked"></div>
  <div class="task-up" ng-if="msg.rootTask">
  <div class="task-title leave-out">{{msg.rootTask.user.fullName}}: {{msg.rootTask.title}}</div>
  <div class="tc mt10 tb-down" ng-click="ToggleRootTask($event)">&#x25BE</div>
  <div class="task-down mt5" ng-click="ToggleRootTask($event)">
    <p class="lh22" ng-bind-html="msg.rootTask.body|marked"></p>
    <p class="c-999 mt5"><span class="mr20">发起人: {{msg.rootTask.user.fullName}}</span><span class="mr20">
    分配给： {{msg.rootTask.receivers[0].fullName}}</span><span>相关人：
    <span ng-if="msg.rootTask.receivers.length > 1" ng-repeat="u in msg.rootTask.receivers.slice(1)">{{u.fullName}}&nbsp;</span></span></p>
    <p class="c-org f12 mt10"><i class="tb time"></i>{{Date(msg.rootTask.timestamp).Format("yyyy-MM-dd")}}</p>
    <div style="text-align:center">&#x25B4;</div>
    </div>
    </div>
    </div>
    </div>
  <div class="task-more mt10"><span class="mr20">分配给: {{msg.receivers[0].fullName}}</span><span>相关人：</span><span ng-repeat="u in msg.receivers.slice(1)">{{u.fullName}}&nbsp;</span></div>
</div>
</div>
</div>

<div id="tasksICreated" style="display:none;">
<div class="task-list" ng-repeat="msg in tasksICreated.slice().reverse()">
<div class="names fl">{{msg.user.fullName[0]}}</div>
<div class="task-info fl">
  <div class="task-alert" ng-click="ToggleFlow(msg.uid)"}>
    <div class="overf"><div class="fl f16">{{msg.user.fullName}}</div><div class="fr c-999">{{TimeFromNow(msg.timestamp)}}</div></div>
    <div class="leave-out mt3"><p ng-if="!msg.rootTask">{{msg.title}}</p>
        <div ng-bind-html="msg.body|marked"></div>
  <div class="task-up" ng-if="msg.rootTask">
  <div class="task-title leave-out">{{msg.rootTask.user.fullName}}: {{msg.rootTask.title}}</div>
  <div class="tc mt10 tb-down" ng-click="ToggleRootTask($event)">&#x25BE</div>
  <div class="task-down mt5" ng-click="ToggleRootTask($event)">
    <p class="lh22" ng-bind-html="msg.rootTask.body|marked"></p>
    <p class="c-999 mt5"><span class="mr20">发起人: {{msg.rootTask.user.fullName}}</span><span class="mr20">
    分配给： {{msg.rootTask.receivers[0].fullName}}</span><span>相关人：
    <span ng-if="msg.rootTask.receivers.length > 1" ng-repeat="u in msg.rootTask.receivers.slice(1)">{{u.fullName}}&nbsp;</span></span></p>
    <p class="c-org f12 mt10"><i class="tb time"></i>{{Date(msg.rootTask.timestamp).Format("yyyy-MM-dd")}}</p>
    <div style="text-align:center">&#x25B4;</div>
    </div>
    </div>
    </div>
    </div>
  <div class="task-more mt10"><span class="mr20">分配给: {{msg.receivers[0].fullName}}</span><span>相关人：</span><span ng-repeat="u in msg.receivers.slice(1)">{{u.fullName}}&nbsp;</span></div>
</div>
</div>
</div>


<div id="tasksCCMe" style="display:none;">
<div class="task-list" ng-repeat="msg in tasksCCMe.slice().reverse()">
<div class="names fl">{{msg.user.fullName[0]}}</div>
<div class="task-info fl">
  <div class="task-alert" ng-click="ToggleFlow(msg.uid)"}>
    <div class="overf"><div class="fl f16">{{msg.user.fullName}}</div><div class="fr c-999">{{TimeFromNow(msg.timestamp)}}</div></div>
    <div class="leave-out mt3"><p ng-if="!msg.rootTask">{{msg.title}}</p>
        <div ng-bind-html="msg.body|marked"></div>
  <div class="task-up" ng-if="msg.rootTask">
  <div class="task-title leave-out">{{msg.rootTask.user.fullName}}: {{msg.rootTask.title}}</div>
  <div class="tc mt10 tb-down" ng-click="ToggleRootTask($event)">&#x25BE</div>
  <div class="task-down mt5" ng-click="ToggleRootTask($event)">
    <p class="lh22" ng-bind-html="msg.rootTask.body|marked"></p>
    <p class="c-999 mt5"><span class="mr20">发起人: {{msg.rootTask.user.fullName}}</span><span class="mr20">
    分配给： {{msg.rootTask.receivers[0].fullName}}</span><span>相关人：
    <span ng-if="msg.rootTask.receivers.length > 1" ng-repeat="u in msg.rootTask.receivers.slice(1)">{{u.fullName}}&nbsp;</span></span></p>
    <p class="c-org f12 mt10"><i class="tb time"></i>{{Date(msg.rootTask.timestamp).Format("yyyy-MM-dd")}}</p>
    <div style="text-align:center">&#x25B4;</div>
    </div>
    </div>
    </div>
    </div>
  <div class="task-more mt10"><span class="mr20">分配给: {{msg.receivers[0].fullName}}</span><span>相关人：</span><span ng-repeat="u in msg.receivers.slice(1)">{{u.fullName}}&nbsp;</span></div>
</div>
</div>
</div>

</div>

</div>

<!-- todo: 添加未处理任务  -->
<div class="task-right fl">
        <div class="task-no">
          <div class="no-title f18 c-333"><div class="fl">待处理({{tasksTodo.length}})</div><a ui-sref="task" class="fr" >全部</a></div>
          <div class="no-info">
           <ul ng-repeat="task in tasksTodo.slice().reverse().slice(0,4)">
             <li>
               <a href="" ng-click="ToggleFlow(task.uid)">
                <p class="leave-out">任务：{{task.title||task.body}}</p>
                <p class="c-org f12 mt5"><i class="tb time"></i>{{Date(task.timestamp).Format("yyyy-MM-dd")}}</p>
              </a>
            </li>
           </ul>
    </div>
  </div>
  <div>

</div>



</script>

<script type="text/ng-template" id="sign.html">
<div class="right-info fl">
<div class="task-left fl">
  <div class="my-main sign-nav">
      <a href="javascript:void(0)" class="sign-btn b-orgz f30 mr30" ng-click="sign()"><i class="tb sign-tb qiandao"></i>签到</a>
      <a href="javascript:void(0)" class="sign-btn b-green f30" ng-click="offwork()"><i class="tb sign-tb qiantui"></i>签退</a>
  </div>
  <div class="task-list mt15">
    <div class="sign-main f16 ml15">
	   <dl>
		 <dt class="c-999">今天</dt>
		 <dd ng-repeat=" sign in todaysign track by $index" ng-switch="sign.status" >
		 <span ng-switch-when="签到" ng-if="$index<4">@{{sign.name}}<span class="ml10">{{sign.signtime | formatTime}}</span><span class="ml10">在<i class="tb location"></i>{{sign.address}}</span><span class="ml10 c-zi" style="cursor:default ">{{sign.status}}</span> </span>
		 <span ng-switch-when="签退" ng-if="$index<4">@{{sign.name}}<span class="ml10">{{sign.workofftime | formatTime}}</span><span class="ml10">在<i class="tb location"></i>{{sign.address}}</span><span class="ml10 c-zi" style="cursor:default ">{{sign.status}}</span> </span>
		 </dd>
		 </dl>
	   <dl class="mt20">
		 <dt class="c-999">昨天</dt>
		 <dd ng-repeat=" sign in yesterdaysign track by $index" ng-switch="sign.status">
		 <span  ng-switch-when="签到" ng-if="$index<4">@{{sign.name}}<span class="ml10">{{sign.signtime | formatTime}}</span><span class="ml10">在<i class="tb location"></i>{{sign.address}}</span><span class="ml10 c-zi" style="cursor:default ">{{sign.status}}</span></span>
		 <span  ng-switch-when="签退" ng-if="$index<4">@{{sign.name}}<span class="ml10">{{sign.workofftime | formatTime}}</span><span class="ml10">在<i class="tb location"></i>{{sign.address}}</span><span class="ml10 c-zi" style="cursor:default ">{{sign.status}}</span></span>
		 </dd>
		 </dl>
  </div>
  </div>
  <div class="my-main">
    <div class="my-nav overf f18 fw">
	   <ul>
	     <li class="my-active">昨天</li>
	     <li>上一周</li>
	     <li>上个月</li>
	   </ul>
	 </div>
	 <div class="my-info f16 c-999 tc sign-list">
	    <div>
		  	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		  		<tr>
		  			<td width="12%">排名</td>
		  			<td width="17%">姓名</td>
		  			<td width="29%">签到时间</td>
		  			<td width="29%">下班时间</td>
		  			<td width="13%">工作时间</td>
	  			</tr>
		  		<tr ng-repeat=" data in oneDaysData track by $index">
		  			<td>{{$index+1}}</td>
		  			<td>{{data.name}}</td>
		  			<td><span class="c-orgz">{{data.signtime | onedayformatTime}}</span></td>
		  			<td><span class="c-orgz">{{data.workofftime | onedayformatTime }}</span></td>
		  			<td>{{data.worktime | formatWorkTime}}</td>
	  			</tr>
	  		</table>
		</div>
	    <div style="display:none;">
		  	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		  		<tr>
		  			<td width="12%">排名</td>
		  			<td width="17%">姓名</td>
		  			<td width="29%">签到时间</td>
		  			<td width="29%">下班时间</td>
		  			<td width="13%">工作时间</td>
	  			</tr>
		  		<tr ng-repeat=" data in sevenDaysData track by $index">
		  			<td>{{$index+1}}</td>
		  			<td>{{data.name}}</td>
		  			<td><span class="c-orgz">{{data.signtime}}</span></td>
		  			<td><span class="c-orgz">{{data.workofftime}}</span></td>
		  			<td>{{data.worktime}}</td>
	  			</tr>

	  		</table>
		</div>
	    <div style="display:none;">
		  	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		  		<tr>
		  			<td width="12%">排名</td>
		  			<td width="17%">姓名</td>
		  			<td width="29%">签到时间</td>
		  			<td width="29%">下班时间</td>
		  			<td width="13%">工作时间</td>
	  			</tr>
		  		<tr ng-repeat=" data in monthDaysData track by $index">
			  		<td>{{$index+1}}</td>
		  			<td>{{data.name}}</td>
		  			<td><span class="c-orgz">{{data.signtime}}</span></td>
		  			<td><span class="c-orgz">{{data.workofftime}}</span></td>
		  			<td>{{data.worktime}}</td>
	  			</tr>

	  		</table>
		</div>
	 </div>
  </div>
  <div style="height:20px"></div>
</div>
<div class="task-right fl">
  <div class="task-no">
    <div class="no-title f18 c-333"><div class="fl">最早榜</div></div>
	 <div class="thing early" >
	   <p ng-repeat=" e in earliest track by $index">
	   <span ng-if="$index<5">@{{e.name}} {{e.earlytime}}</span></p>
	 </div>
  </div>
  <div class="task-no mt15">
    <div class="no-title f18 c-333"><div class="fl">最勤榜</div></div>
	 <div class="thing early">
	   <p ng-repeat=" f in frequentlyTime track by $index">
	   <span ng-if="$index<5">@{{f.name}}  工作  <span class="c-999">{{f.frequentlytime}} 小时</span></span></p>
	 </div>
  </div>
</div>
</div>
</script>

<script type="text/ng-template" id="newuser.html">
    <div>用户名:<input ng-model="newRegUser.fullName"> </input><button ng-click="RegisterNewUser({fullName: newRegUser.fullName})">新用户</button>
    <div ng-if="newRegUser.errmsg != null">{{newRegUser.errmsg}}</div>
    <div ng-if="newRegUser.success">成功注册用户: {{newRegUser.fullName}}, <a href="{{newRegUser.url}}">{{newRegUser.url}}</a></div>
    <div>
    <div>系统已有用户</div>
    <div ng-repeat="u in users">{{u.fullName}}, <a href="{{u.url}}">{{u.url}}</a></div>
    </div>
</script>
`;
