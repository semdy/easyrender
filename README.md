# easyrender
a lite frameworks for canvas, simply, faster and liter. for more information see API document or [demos](#live-demo).

# 简要文档

## EC提供的属性 ##
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>ua</td>
		<td>String</td>
		<td>navigator.userAgent</td>
		<td>浏览器标识</td>
	</tr>
	<tr>
		<td>isTouch</td>
		<td>Boolean</td>
		<td>视浏览器类型而定</td>
		<td>是否是可触摸设备</td>
	</tr>
	<tr>
		<td>noop</td>
		<td>Function</td>
		<td>function(){}</td>
		<td>空方法</td>
	</tr>
	<tr>
		<td>EVENTS</td>
		<td>Object</td>
		<td>--</td>
		<td>属性：START, MOVE, END, RESIZE</td>
	</tr>
</table>

## EC提供的静态方法 ##
<table>
	<tr>
		<td>method</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>extend</td>
		<td>Object: source -> 继承的对象<br>
			Object: props... -> 被继承的对象
		</td>
		<td>对象的继承</td>
		<td>source</td>
	</tr>
	<tr>
		<td>provide</td>
		<td>Object: props -> 扩展的方法或属性</td>
		<td>扩展EC的静态方法或属性</td>
		<td>EC</td>
	</tr>
	<tr>
		<td>classExtend</td>
		<td>Object: protoProps -> 继承的原型链<br>
			Object: staticProps -> 设置额外的静态属性
		</td>
		<td>类的继承</td>
		<td>新的constructor</td>
	</tr>
	<tr>
		<td>isPointInPath</td>
		<td>Object: {x, y} -> 坐标点 <br>
			Object: object -> 组件对象
		</td>
		<td>检测坐标点是否在组件边界内</td>
		<td>Boolean</td>
	</tr>
	<tr>
		<td>isDefined</td>
		<td>Object: obj</td>
		<td>检查变量是否被定义</td>
		<td>Boolean</td>
	</tr>
	<tr>
		<td>isNumber</td>
		<td>Object: obj</td>
		<td>obj是否为数字类型</td>
		<td>Boolean</td>
	</tr>
	<tr>
		<td>isString</td>
		<td>Object: obj</td>
		<td>obj是否为字符串类型</td>
		<td>Boolean</td>
	</tr>
	<tr>
		<td>isFunction</td>
		<td>Object: obj</td>
		<td>obj是否为Function类型</td>
		<td>Boolean</td>
	</tr>
	<tr>
		<td>isObject</td>
		<td>Object: obj</td>
		<td>obj是否为Object</td>
		<td>Boolean</td>
	</tr>
	<tr>
		<td>isArray</td>
		<td>Object: obj</td>
		<td>obj是否为数组</td>
		<td>Boolean</td>
	</tr>
	<tr>
		<td>copy</td>
		<td>Object: obj <br/>
			Boolean: depth 是否深度拷贝
		</td>
		<td>复制Object或者Array</td>
		<td>Object/Array</td>
	</tr>
	<tr>
		<td>camelize</td>
		<td>String: key</td>
		<td>将"a-b-c"转换成"aBC"的写法</td>
		<td>String</td>
	</tr>
	<tr>
    		<td>lowercase</td>
    		<td>String: key</td>
    		<td>将"aBC"转换成"a-b-c"的写法</td>
    		<td>String</td>
    	</tr>
	<tr>
		<td>getStyle</td>
		<td>Object: element -> DOMObject<br>
			String: attr -> 样式属性
		</td>
		<td>获取指定节点样式</td>
		<td>String</td>
	</tr>
</table>

## EC.Util ##
<table>
	<tr>
		<td>method</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td rowspan="2">color</td>
		<td>String: rgb -> 颜色rgb</td>
		<td><code>toHex(rgb)</code> -> RGB颜色转换为16进制</td>
		<td>String: hex</td>
	</tr>
	<tr>
		<td>String: hex -> 颜色16进制值 <br>
			Number: alpha -> 颜色透明度</td>
		<td><code>toRgb(hex, alpha)</code> -> 16进制颜色转为RGB格式</td>
		<td>String: rgb</td>
	</tr>
	<tr>
		<td>getParameter</td>
		<td>name:参数名</td>
		<td>获取网页url参数</td>
		<td>String</td>
	</tr>
	<tr>
		<td>hitTest</td>
		<td>objectA, objectB</td>
		<td>检测两个组件是否有碰触</td>
		<td>Boolean</td>
	</tr>
</table>

## EC.Event ##
<table>
	<tr>
		<td>method</td>
		<td>parameter</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>on</td>
		<td>name: 事件名<br>
			callback: 事件监听listener <br>
			scope: 设定上下文</td>
		<td>发起一个事件监听</td>
	</tr>
	<tr>
		<td>once</td>
		<td>name: 事件名<br>
			callback: 事件监听listener <br>
			scope: 设定上下文</td>
		<td>发起一个事件监听，且仅一次有效</td>
	</tr>
	<tr>
		<td>has</td>
		<td>name: 事件名<br>
			callback?: 事件监听listener</td>
		<td>判断当前事件池中是否有指定的事件监听</td>
	</tr>
	<tr>
		<td>off</td>
		<td>name: 事件名<br>
			callback?: 事件监听listener</td>
		<td>取消一个事件监听</td>
	</tr>
	<tr>
		<td>dispatch</td>
		<td>name: 事件名<br>
			...args: 传递的参数
		</td>
		<td>触发一个事件</td>
	</tr>
	<tr>
		<td>clear</td>
		<td>--</td>
		<td>清空事件池</td>
	</tr>
</table>

## RES ##
`extends EC.Event`
<table>
	<tr>
		<td>method</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>loadImage</td>
		<td>src: 图片地址</td>
		<td>加载一张图片</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>ajaxSetup</td>
		<td>object: ajax全局配置参数</td>
		<td>ajax全局配置</td>
		<td>undefined</td>
	</tr>
	<tr>
		<td>ajax</td>
		<td>params: ajax配置参数</td>
		<td>发起ajax请求，用法与jQuery.ajax类似</td>
		<td>XMLHttpRequest</td>
	</tr>
	<tr>
		<td>request</td>
		<td>params: ajax配置参数</td>
		<td>配置参数与ajax相同，但返回内容不同。<br>
			支持的写法RES.request(params).then(succFun, errFun).always(alwaysFun);<br>
			虽支持promise写法，但是并不是真正的promise模式
		</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>get</td>
		<td>url: 请求地址 <br>
			params: ajax配置参数</td>
		<td>request({type: 'GET'})的简易调用
		</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>post</td>
		<td>url: 请求地址 <br>
			params: ajax配置参数</td>
		<td>request({type: 'POST'})的简易调用
		</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>getJSON</td>
		<td>url: 请求地址 <br>
			params: ajax配置参数</td>
		<td>request({type: 'GET', dataType: 'json'})的简易调用, 自动将获取到的数据转json
		</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>loadJson</td>
		<td>url: 请求地址</td>
		<td>request({url: url, dataType: "json"})的简易调用, 自动将获取到的数据转json
		</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>loadJsonp</td>
		<td>url: 请求地址</td>
		<td>跨域请求数据</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>loadScript</td>
		<td>url: js文件地址</td>
		<td>异步加载一个外部js文件</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>getRes</td>
		<td>resId: 资源label</td>
		<td>获取资源配置项</td>
		<td>object</td>
	</tr>
	<tr>
		<td>getTexture</td>
		<td>resId: 资源label</td>
		<td>获取资源纹理图</td>
		<td>IMG DOMObject</td>
	</tr>
	<tr>
		<td>el</td>
		<td>selector: 节点selector<br>
			container: 节点父容器selector		
		</td>
		<td>一个简单的元素选择器</td>
		<td>DOMObject/Array&lt;DOMObject&gt;</td>
	</tr>
</table>

### RES events ###
<table>
	<tr>
		<td>name</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>success</td>
		<td>当request/image/script处理成功时执行的回调</td>
	</tr>
<tr>
		<td>error</td>
		<td>当request/image/script处理失败时执行的回调</td>
	</tr>
<tr>
		<td>complete</td>
		<td>当request/resource加载完成时执行的回调</td>
	</tr>
<tr>
		<td>progress</td>
		<td>当resource正在加载时执行的回调，传递两个参数loaded, total</td>
	</tr>
</table>

### ajax options ###
<table>
	<tr>
		<td>name</td>
		<td>默认值</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>url</td>
		<td>""</td>
		<td>请求地址</td>
	</tr>
<tr>
		<td>type</td>
		<td>GET</td>
		<td>请求类型</td>
	</tr>
<tr>
		<td>async</td>
		<td>true</td>
		<td>请同步或异步</td>
	</tr>
<tr>
		<td>data</td>
		<td>{}</td>
		<td>请求参数配置</td>
	</tr>
<tr>
		<td>headers</td>
		<td>{}</td>
		<td>设置请求响应头</td>
	</tr>
<tr>
		<td>cache</td>
		<td>true</td>
		<td>是否可缓存</td>
	</tr>
<tr>
		<td>cors</td>
		<td>false</td>
		<td>是否通过withCredentials跨域请求</td>
	</tr>
<tr>
        <td>crossDomain</td>
        <td>false</td>
        <td>是否允许跨域请求</td>
    </tr>
<tr>
        <td>xhrFields</td>
        <td>{}</td>
        <td>给xhr添加额外属性</td>
    </tr>
<tr>
		<td>global</td>
		<td>true</td>
		<td>是否触发ajax全局的相关事件</td>
	</tr>
<tr>
		<td>beforeSend</td>
		<td>noop</td>
		<td>请求发生前执行的回调，当返回false时，终止请求</td>
	</tr>
<tr>
		<td>success</td>
		<td>noop</td>
		<td>请求成功时执行的回调</td>
	</tr>
<tr>
		<td>error</td>
		<td>noop</td>
		<td>请求失败时执行的回调</td>
	</tr>
<tr>
		<td>complete</td>
		<td>noop</td>
		<td>请求成功或失败时执行的回调</td>
	</tr>
<tr>
		<td>progress</td>
		<td>noop</td>
		<td>请求过程进度返回的回调</td>
	</tr>
<tr>
		<td>timeout</td>
		<td>0</td>
		<td>设置超时上限, 为0时则不设上限</td>
	</tr>
<tr>
		<td>context</td>
		<td>null</td>
		<td>配置上下文</td>
	</tr>
<tr>
		<td>dataType</td>
		<td>text</td>
		<td>设置返回的数据类型,可选值有：text, html, xml, json, jsonp, script</td>
	</tr>
<tr>
		<td>responseType</td>
		<td>null</td>
		<td>设置返回的数据类型,可选值有：blob,xml,json,...</td>
	</tr>
<tr>
		<td>callbackName</td>
		<td>?</td>
		<td>请求类型为jsonp时，设置的回调函数名称</td>
	</tr>
<tr>
		<td>contentType</td>
		<td>application/x-www-form-urlencoded;charset=UTF-8</td>
		<td>设置请求响应类型</td>
	</tr>
<tr>
		<td>xhr</td>
		<td>new XMLHttpRequest</td>
		<td>自定义XMLHttpRequest</td>
	</tr>
</table>

## EC.Ticker ##
`extends EC.Event`
<table>
	<tr>
		<td>method</td>
		<td>parameter</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>start</td>
		<td>--</td>
		<td>开始当前ticker</td>
	</tr>
	<tr>
		<td>stop</td>
		<td>--</td>
		<td>停止当前ticker</td>
	</tr>
</table>

### EC.Ticker events ###
<table>
	<tr>
		<td>name</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>ticker</td>
		<td>当Ticker运行时执行的回调</td>
	</tr>
</table>

## EC.Timer ##
`extends EC.Event`
<table>
	<tr>
		<td>method</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>constructor</td>
		<td>Number: delay -> 间隔时间<br>
			Number: repeatCount -> 重复次数</td>
		<td>按设定间隔时间执行脚本</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>start</td>
		<td>--</td>
		<td>开始计时</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>stop</td>
		<td>--</td>
		<td>停止计时</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>wait</td>
		<td>Number: time -> 计时结束后延迟指定时间执行complete事件</td>
		<td>计时结束设置延迟</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>pause</td>
		<td>Number: time -> 计时暂停指定时间后，继续计时，不设定则不会继续计时</td>
		<td>暂停计时</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>setRepeatCount</td>
		<td>Number: count -> 设定计时次数</td>
		<td>设定计时次数</td>
		<td>Event</td>
	</tr>
	<tr>
		<td>reset</td>
		<td>--</td>
		<td>重置计时</td>
		<td>Event</td>
	</tr>
</table>

### EC.Timer events ###
<table>
	<tr>
		<td>name</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>timer</td>
		<td>当Timer运行时执行的回调</td>
	</tr>
<tr>
		<td>complete</td>
		<td>当Timer结束时执行的回调</td>
	</tr>
<tr>
		<td>pause</td>
		<td>当Timer暂停时执行的回调</td>
	</tr>
</table>

## EC.Tween ##
<table>
	<tr>
		<td>method</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>constructor</td>
		<td>Object: object -> component<br>
			Object: congfig -> Tween的配置</td>
		<td>可配置的参数有：<br>
			{reverse: true} 当动画结束后，又以动画的形式返回初始状态;<br>
			{loop: true} 动画无限循环<br>
			{loop: 2...} 指定动画执行几次<br>
		</td>
		<td>EC.Tween类</td>
	</tr>
	<tr>
		<td>to</td>
		<td>
			Object: tweenAttrs -> 动画结束状态参数 <br>
			Number: duration -> 动画持续时间<br>
			Function: Easing -> 缓动动画类 
		</td>
		<td>配置动画结束状态</td>
		<td>EC.Tween类</td>
	</tr>
	<tr>
		<td>wait</td>
		<td>Number: time -> 动画暂停时间</td>
		<td>设置动画暂停时间</td>
		<td>EC.Tween类</td>
	</tr>
	<tr>
		<td>stop</td>
		<td>--</td>
		<td>停止动画</td>
		<td>EC.Tween类</td>
	</tr>
<tr>
		<td>onStart</td>
		<td>
			Function: callback -> 当前tween开始执行的回调<br>
			Object: context -> 设定上下文
		</td>
		<td>当前tween开始执行</td>
		<td>EC.Tween类</td>
	</tr>
	<tr>
		<td>onUpdate</td>
		<td>
			Function: callback -> 当前状态更新时执行的回调<br>
			Object: context -> 设定上下文
		</td>
		<td>当前状态更新时间执行</td>
		<td>EC.Tween类</td>
	</tr>
<tr>
		<td>onStop</td>
		<td>
			Function: callback -> 当前tween停止的回调<br>
			Object: context -> 设定上下文
		</td>
		<td>当前tween停止时执行</td>
		<td>EC.Tween类</td>
	</tr>
	<tr>
		<td>call</td>
		<td>
			Function: callback -> 动画结束时执行的回调<br>
			Object: context -> 设定上下文
		</td>
		<td>动画结束时执行</td>
		<td>EC.Tween类</td>
	</tr>
</table>

### EC.Tween 静态方法 ###
<table>
	<tr>
		<td>method</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>get</td>
		<td>Object: object -> component<br>
			Object: congfig -> Tween的配置</td>
		<td>可配置的参数有：<br>
			{reverse: true} 当动画结束后，又以动画的形式返回初始状态;<br>
			{loop: true} 动画无限循环<br>
			{loop: 2...} 指定动画执行几次<br>
		</td>
		<td>new EC.Tween类</td>
	</tr>
	<tr>
		<td>removeTweens</td>
		<td>
			Object: target -> component
		</td>
		<td>停止目标object的动画</td>
		<td>EC.Tween</td>
	</tr>
	<tr>
		<td>removeAllTweens</td>
		<td>
			Object: container -> Stage或Sprite
		</td>
		<td>停止指定容器内容所有子集的动画</td>
		<td>EC.Tween</td>
	</tr>
</table>

### EC.Easing 列表 ###
<table>
	<tr>
		<td>method</td>
		<td>子集</td>
	</tr>
	<tr>
		<td>Linear</td>
		<td>None</td>
	</tr>
	<tr>
		<td>Quadratic</td>
		<td>In<br>Out<br>InOut</td>
	</tr>
	<tr>
		<td>Cubic</td>
		<td>In<br>Out<br>InOut</td>
	</tr>
	<tr>
		<td>Quartic</td>
		<td>In<br>Out<br>InOut</td>
	</tr>
	<tr>
		<td>Quintic</td>
		<td>In<br>Out<br>InOut</td>
	</tr>
	<tr>
		<td>Sinusoidal</td>
		<td>In<br>Out<br>InOut</td>
	</tr>
	<tr>
		<td>Exponential</td>
		<td>In<br>Out<br>InOut</td>
	</tr>
	<tr>
		<td>Circular</td>
		<td>In<br>Out<br>InOut</td>
	</tr>
	<tr>
		<td>Elastic</td>
		<td>In<br>Out<br>InOut</td>
	</tr>
	<tr>
		<td>Back</td>
		<td>In<br>Out<br>InOut</td>
	</tr>
	<tr>
		<td>Bounce</td>
		<td>In<br>Out<br>InOut</td>
	</tr>
</table>

## EC.DisplayObjectContainer ##
`extends EC.Event`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>x</td>
		<td>Number</td>
		<td>0</td>
		<td>横坐标</td>
	</tr>
	<tr>
		<td>y</td>
		<td>Number</td>
		<td>0</td>
		<td>纵坐标</td>
	</tr>
	<tr>
		<td>width</td>
		<td>Number</td>
		<td>0</td>
		<td>宽度</td>
	</tr>
	<tr>
		<td>height</td>
		<td>Number</td>
		<td>0</td>
		<td>高度</td>
	</tr>
	<tr>
		<td>visible</td>
		<td>Boolean</td>
		<td>true</td>
		<td>是否可见</td>
	</tr>
<tr>
		<td>touchEnabled</td>
		<td>Boolean</td>
		<td>false</td>
		<td>是否开启响应事件</td>
	</tr>
	<tr>
		<td>alpha</td>
		<td>Number/undefined</td>
		<td>undefined</td>
		<td>透明度</td>
	</tr>
	<tr>
		<td>scaleX</td>
		<td>Number</td>
		<td>1</td>
		<td>横向放大倍数</td>
	</tr>
<tr>
		<td>scaleY</td>
		<td>Number</td>
		<td>1</td>
		<td>纵向放大倍数</td>
	</tr>
<tr>
		<td>rotation</td>
		<td>Number</td>
		<td>0</td>
		<td>旋转角度</td>
	</tr>
<tr>
		<td>skewX</td>
		<td>Number</td>
		<td>0</td>
		<td>横向斜切角度</td>
	</tr>
<tr>
		<td>skewY</td>
		<td>Number</td>
		<td>0</td>
		<td>纵向斜切角度</td>
	</tr>
<tr>
		<td>anchorX</td>
		<td>Number</td>
		<td>0</td>
		<td>横向中心点</td>
	</tr>
<tr>
		<td>anchorY</td>
		<td>Number</td>
		<td>0</td>
		<td>纵向中心点</td>
	</tr>
<tr>
		<td>numChildren</td>
		<td>Number</td>
		<td>0</td>
		<td>返回当前容器子集的个数</td>
	</tr>
<tr>
		<td>cursor</td>
		<td>String</td>
		<td>pointer</td>
		<td>鼠标滑过时显示的鼠标样式，仅PC下有效</td>
	</tr>
</table>

### EC.DisplayObjectContainer methods ###
<table>
	<tr>
		<td>method</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>addChildAt</td>
		<td>Object: childObject -> 子集对象<br>
			Number: index -> 子集的添加位置</td>
		<td>向容器添加子集</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
	<tr>
		<td>addChild</td>
		<td>Object: childObject -> 子集对象</td>
		<td>向容器添加子集</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
	<tr>
		<td>removeChild</td>
		<td>Object: childObject -> 子集对象</td>
		<td>容器中移除一个子集</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
	<tr>
		<td>removeChildAt</td>
		<td>Number: index -> 子集对象索引值</td>
		<td>从容器中指定位置移除一个子集</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
	<tr>
		<td>remove</td>
		<td>--</td>
		<td>从父容器中移除自己</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
	<tr>
		<td>removeAllChildren</td>
		<td>--</td>
		<td>清除子集</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
<tr>
		<td>getChilds</td>
		<td>--</td>
		<td>获取当前容器所有子集对象</td>
		<td>EC.DisplayObjectContainer集合</td>
	</tr>
<tr>
		<td>getChildAt</td>
		<td>Number: index -> 子集对象索引值</td>
		<td>获取指定位置的子集</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
<tr>
		<td>each</td>
		<td>Function: iterator -> 子集迭代器<br/>
			Object: context -> 指定上下文
</td>
		<td>子集迭代</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
<tr>
		<td>getBounds</td>
		<td>--</td>
		<td>获取当前容器的边界</td>
		<td>new Bounds()</td>
	</tr>
<tr>
		<td>getChildIndex</td>
		<td>Object: childObject -> 获取子集的索引值</td>
		<td>获取当前容器的边界</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
<tr>
		<td>setChildIndex</td>
		<td>Object: childObject -> 设置子集的索引值<br>
			Number: index -> 索引值
		</td>
		<td>获取当前容器的边界</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
<tr>
		<td>contains</td>
		<td>Object: childObject</td>
		<td>判断当前显示对象是否已经在父容器中</td>
		<td>Boolean</td>
	</tr>
<tr>
		<td>setParams</td>
		<td>Object: params -> 参数集</td>
		<td>设置当前容器的相关属性</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
<tr>
		<td>size</td>
		<td>--</td>
		<td>获取容器子集的个数</td>
		<td>Number</td>
	</tr>
<tr>
        <td>broadcast</td>
        <td>String: name -> 事件名称<br>
            [...args]  -> 事件传值
        </td>
        <td>向子节点(包括自己)广播事件</td>
        <td>EC.DisplayObjectContainer</td>
    </tr>
<tr>
        <td>emit</td>
        <td>String: name -> 事件名称<br>
            [...args]  -> 事件传值
        </td>
        <td>向父节点(包括自己)广播事件</td>
        <td>EC.DisplayObjectContainer</td>
    </tr>
</table>

### EC.DisplayObjectContainer events ###
<table>
	<tr>
		<td>name</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>addToStage</td>
		<td>当前容器添加到舞台时执行的回调</td>
	</tr>
<tr>
		<td>remove</td>
		<td>在被从父容器中移除时执行的回调</td>
	</tr>
<tr>
		<td>enterframe</td>
		<td>舞台实时渲染时执行的回调</td>
	</tr>
</table>

## Bounds ##
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>x</td>
		<td>Number</td>
		<td>--</td>
		<td>返回边界的x坐标</td>
	</tr>
	<tr>
		<td>y</td>
		<td>Number</td>
		<td>--</td>
		<td>返回边界的y坐标</td>
	</tr>
	<tr>
		<td>width</td>
		<td>Number</td>
		<td>--</td>
		<td>返回边界的宽度</td>
	</tr>
	<tr>
		<td>height</td>
		<td>Number</td>
		<td>--</td>
		<td>返回边界的高度</td>
	</tr>
</table>

### Bounds methods ###
<table>
	<tr>
		<td>methods</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>intersects</td>
		<td>Object: target -> 被检测的目标对象</td>
		<td>检测两个组件是否有交叉</td>
		<td>Boolean</td>
	</tr>
</table>

## EC.Sprite ##
`extends EC.DisplayObjectContainer`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>mask</td>
		<td>EC.Shape</td>
		<td>undefined</td>
		<td>添加遮罩</td>
	</tr>
</table>

## EC.TextField ##
`extends EC.DisplayObjectContainer`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>text</td>
		<td>String</td>
		<td>""</td>
		<td>显示的文本</td>
	</tr>
	<tr>
		<td>size</td>
		<td>Number</td>
		<td>16</td>
		<td>字号</td>
	</tr>
	<tr>
		<td>textAlign</td>
		<td>String</td>
		<td>start</td>
		<td>文本水平对齐方式</td>
	</tr>
	<tr>
		<td>textBaseline</td>
		<td>String</td>
		<td>top</td>
		<td>文本垂直对齐方式</td>
	</tr>
	<tr>
		<td>fontFamily</td>
		<td>String</td>
		<td>Arial</td>
		<td>字体</td>
	</tr>
	<tr>
		<td>textColor</td>
		<td>String</td>
		<td>#000</td>
		<td>文本颜色</td>
	</tr>
	<tr>
		<td>strokeColor</td>
		<td>String</td>
		<td>#000</td>
		<td>字本描边颜色</td>
	</tr>
	<tr>
		<td>textStyle</td>
		<td>String</td>
		<td>normal</td>
		<td>文本样式</td>
	</tr>
	<tr>
		<td>textWeight</td>
		<td>String</td>
		<td>normal</td>
		<td>字体加粗</td>
	</tr>
	<tr>
		<td>lineSpacing</td>
		<td>Number</td>
		<td>2</td>
		<td>行间距</td>
	</tr>
	<tr>
		<td>numLines</td>
		<td>Number</td>
		<td>1</td>
		<td>行数</td>
	</tr>
	<tr>
		<td>stroke</td>
		<td>Boolean</td>
		<td>false</td>
		<td>是否描边</td>
	</tr>
	<tr>
		<td>strokeOnly</td>
		<td>Boolean</td>
		<td>false</td>
		<td>是否只描边</td>
	</tr>
	<tr>
		<td>multiple</td>
		<td>Boolean</td>
		<td>false</td>
		<td>是否开启文本自动换行</td>
	</tr>
</table>

## EC.BitMap ##
`extends EC.DisplayObjectContainer`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>sx</td>
		<td>Number/undefined</td>
		<td>undefined</td>
		<td>图片裁切的x起始位置</td>
	</tr>
	<tr>
		<td>sy</td>
		<td>Number/undefined</td>
		<td>undefined</td>
		<td>图片裁切的y起始位置</td>
	</tr>
	<tr>
		<td>swidth</td>
		<td>Number/undefined</td>
		<td>undefined</td>
		<td>图片裁切的宽度</td>
	</tr>
	<tr>
		<td>sheight</td>
		<td>Number/undefined</td>
		<td>undefined</td>
		<td>图片裁切的高度</td>
	</tr>
	<tr>
		<td>texture</td>
		<td>Img DOMObject</td>
		<td>undefined</td>
		<td>BitMap的纹理</td>
	</tr>
</table>

### EC.BitMap methods ###
<table>
	<tr>
		<td>methods</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>setTexture</td>
		<td>Object/IMG DOMObject: dataObject -> 纹理参数</td>
		<td>设置纹理</td>
		<td>EC.BitMap</td>
	</tr>
</table>

## EC.Shape ##
`extends EC.DisplayObjectContainer`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>radius</td>
		<td>Number</td>
		<td>0</td>
		<td>形状的半径或圆角大小</td>
	</tr>
	<tr>
		<td>fillStyle</td>
		<td>String</td>
		<td>#000</td>
		<td>填充样式</td>
	</tr>
	<tr>
		<td>strokeStyle</td>
		<td>String</td>
		<td>#000</td>
		<td>描边样式</td>
	</tr>
	<tr>
		<td>shadowColor</td>
		<td>String</td>
		<td>#000</td>
		<td>阴影颜色</td>
	</tr>
	<tr>
		<td>shadowBlur</td>
		<td>String</td>
		<td>0</td>
		<td>阴影的模糊级别</td>
	</tr>
	<tr>
		<td>shadowOffsetX</td>
		<td>String</td>
		<td>0</td>
		<td>阴影距形状的水平距离</td>
	</tr>
	<tr>
		<td>shadowOffsetY</td>
		<td>String</td>
		<td>0</td>
		<td>阴影距形状的垂直距离</td>
	</tr>
	<tr>
		<td>lineCap</td>
		<td>String</td>
		<td>""</td>
		<td>线条的结束端点样式</td>
	</tr>
	<tr>
		<td>lineJoin</td>
		<td>String</td>
		<td>""</td>
		<td>两条线相交时，所创建的拐角类型</td>
	</tr>
	<tr>
		<td>lineWidth</td>
		<td>String</td>
		<td>0</td>
		<td>当前的线条宽度</td>
	</tr>
	<tr>
		<td>miterLimit</td>
		<td>String</td>
		<td>""</td>
		<td>最大斜接长度</td>
	</tr>
	<tr>
		<td>dashLength</td>
		<td>Number</td>
		<td>0</td>
		<td>虚线的长度(较老的浏览器可能不支持)</td>
	</tr>
	<tr>
		<td>dashGap</td>
		<td>Number</td>
		<td>0</td>
		<td>虚线之间的间隙(较老的浏览器可能不支持)</td>
	</tr>
</table>

### EC.Shape methods ###
<table>
	<tr>
		<td>methods</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>fill</td>
		<td>
			String/Number: color -> 填充颜色<br>
			Number: alpha -> 填充透明度 
		</td>
		<td>设置填充颜色及透明度</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>stroke</td>
		<td>
			String/Number: color -> 描边颜色<br>
			Number: alpha -> 描边透明度 
		</td>
		<td>设置描边颜色及透明度</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>drawRect</td>
		<td>x: x坐标 <br>
			y: y坐标<br>
			width: 宽度<br>
			height: 高度
		</td>
		<td>画矩形</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>drawArc</td>
		<td>x: x坐标 <br>
			y: y坐标<br>
			radius: 半径<br>
			startAngle: 起始弧度<br>
			endAngle: 结束弧度<br>
			counterclockwise: 方向
		</td>
		<td>画圆</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>drawCircle</td>
		<td>x: x坐标 <br>
			y: y坐标<br>
			radius: 半径
		</td>
		<td>画圆</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>arcTo</td>
		<td>startX: 起始x坐标 <br>
			startY: 起始y坐标<br>
			endX： 结束x坐标<br>
			endY: 结束y坐标<br>
			radius: 圆角大小<br>
		</td>
		<td>画圆角折线</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>drawRoundRect</td>
		<td>x: x坐标 <br>
			y: y坐标<br>
			width: 宽度<br>
			height: 高度<br>
			radius: 圆角大小
		</td>
		<td>画圆角矩形</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>moveTo</td>
		<td>x: x坐标 <br>
			y: y坐标<br>
		</td>
		<td>将笔触移动至指定位置</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>lineTo</td>
		<td>x: x坐标 <br>
			y: y坐标<br>
		</td>
		<td>从笔触位置到该指定位置画线条</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>drawLine</td>
		<td>x: x起始位置 <br>
			y: y起始位置<br>
			endX: x结束位置<br>
			endY: y结束位置<br>
		</td>
		<td>画实线</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>drawDashedLine</td>
		<td>x: x起始位置 <br>
			y: y起始位置<br>
			endX: x结束位置<br>
			endY: y结束位置<br>
			dashLength: 虚线间隔长度
		</td>
		<td>画虚线</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>drawEllipse</td>
		<td>x: x起始位置 <br>
			y: y起始位置<br>
			width: 宽度<br>
			height: 高度<br>
		</td>
		<td>画椭圆</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>clip</td>
		<td>--</td>
		<td>裁切</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>quadraticCurveTo</td>
		<td>cpx: 贝塞尔控制点的 x 坐标 <br>
			cpy: 贝塞尔控制点的 y 坐标<br>
			x: 结束点的 x 坐标<br>
			y: 结束点的 y 坐标<br>
		</td>
		<td>创建二次贝塞尔曲线</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>quadraticCurveTo</td>
		<td>cp1x: 第一个贝塞尔控制点的 x 坐标 <br>
			cp1y: 第一个贝塞尔控制点的 y 坐标<br>
			cp2x: 第二个贝塞尔控制点的 x 坐标<br>
			cp2y: 第二个贝塞尔控制点的 y 坐标<br>
			x: 结束点的 x 坐标<br>
			y: 结束点的 y 坐标<br>
		</td>
		<td>创建三次方贝塞尔曲线</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>close</td>
		<td>--</td>
		<td>闭合路径</td>
		<td>EC.Shape</td>
	</tr>
</table>

## EC.Masker ##
`extends EC.Shape`

## EC.Rectangle(x, y, width, height) ##
`extends EC.Shape`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>x</td>
		<td>Number</td>
		<td>0</td>
		<td>矩形x坐标</td>
	</tr>
	<tr>
		<td>y</td>
		<td>Number</td>
		<td>0</td>
		<td>矩形y坐标</td>
	</tr>
	<tr>
		<td>width</td>
		<td>Number</td>
		<td>0</td>
		<td>矩形宽度</td>
	</tr>
	<tr>
		<td>height</td>
		<td>Number</td>
		<td>0</td>
		<td>矩形高度</td>
	</tr>
</table>

## EC.TextInput ##
`extends EC.Sprite`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>width</td>
		<td>Number</td>
		<td>400</td>
		<td>输入框的宽度</td>
	</tr>
	<tr>
		<td>height</td>
		<td>Number</td>
		<td>64</td>
		<td>输入框的高度</td>
	</tr>
	<tr>
		<td>backgroundColor</td>
		<td>String</td>
		<td>""</td>
		<td>输入框的背景颜色</td>
	</tr>
	<tr>
		<td>backgroundImage</td>
		<td>String</td>
		<td>""</td>
		<td>输入框的背景图片</td>
	</tr>
	<tr>
		<td>backgroundRepeat</td>
		<td>String</td>
		<td>repeat</td>
		<td>背景图片的填充方式，或选值有： repeat, no-repeat, repeat-x, repeat-y</td>
	</tr>
	<tr>
		<td>backgroundAlpha</td>
		<td>Number</td>
		<td>1</td>
		<td>背景颜色透明度</td>
	</tr>
<tr>
		<td>borderColor</td>
		<td>String</td>
		<td>#000</td>
		<td>边框颜色</td>
	</tr>
<tr>
		<td>borderAlpha</td>
		<td>Number</td>
		<td>1</td>
		<td>边框颜色透明度</td>
	</tr>
<tr>
		<td>borderRadius</td>
		<td>Number</td>
		<td>0</td>
		<td>输入框圆角大小</td>
	</tr>
<tr>
		<td>borderWidth</td>
		<td>Number</td>
		<td>2</td>
		<td>边框粗细</td>
	</tr>
<tr>
		<td>fontSize</td>
		<td>Number</td>
		<td>28</td>
		<td>文本字号</td>
	</tr>
<tr>
		<td>fontFamily</td>
		<td>String</td>
		<td>继承自TextField默认字体</td>
		<td>输入框文本字体</td>
	</tr>
<tr>
		<td>lineHeight</td>
		<td>Number</td>
		<td>16</td>
		<td>输入框文本行高</td>
	</tr>
<tr>
		<td>lineSpacing</td>
		<td>Number</td>
		<td>2</td>
		<td>输入框文本行间距</td>
	</tr>
<tr>
		<td>color</td>
		<td>String</td>
		<td>#000</td>
		<td>文本颜色</td>
	</tr>
<tr>
		<td>padding</td>
		<td>Number/Array&lt;Number,Number,Number,Number,&gt;</td>
		<td>3</td>
		<td>输入框内填充</td>
	</tr>
<tr>
		<td>placeholder</td>
		<td>String</td>
		<td>""</td>
		<td>输入框提示</td>
	</tr>
<tr>
		<td>placeholderColor</td>
		<td>String</td>
		<td>#999</td>
		<td>输入框提示文本颜色</td>
	</tr>
<tr>
		<td>inputType</td>
		<td>String</td>
		<td>text</td>
		<td>输入框类型</td>
	</tr>
</table>

### EC.TextInput events ###
<table>
	<tr>
		<td>name</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>focus</td>
		<td>当输入框聚集时执行的回调</td>
	</tr>
<tr>
		<td>change</td>
		<td>当输入框的值发生变化时执行的回调</td>
	</tr>
<tr>
		<td>blur</td>
		<td>当输入框失去聚集时执行的回调</td>
	</tr>
<tr>
		<td>input</td>
		<td>实时监控输入框值的变化</td>
	</tr>
</table>

## EC.BitMapText ##
`extends EC.Sprite`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>text</td>
		<td>String</td>
		<td>""</td>
		<td>显示的文本</td>
	</tr>
	<tr>
		<td>font</td>
		<td>String/Object</td>
		<td>""</td>
		<td>字体配置文件</td>
	</tr>
	<tr>
		<td>textAlign</td>
		<td>String</td>
		<td>left</td>
		<td>文本水平对齐方式</td>
	</tr>
	<tr>
		<td>letterSpacing</td>
		<td>Number</td>
		<td>0</td>
		<td>文本间隔</td>
	</tr>
</table>

## EC.Button ##
`extends EC.Sprite`

### EC.Button methods ###
<table>
	<tr>
		<td>methods</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>setButton</td>
		<td>
			String/Object: status -> 按钮状态
		</td>
		<td>设置按钮状态 normal, hover, active, disabled四选其一<br>
			具体详见 [Button demo](https://semdy.github.io/easyrender/dist/Button.html)	
		</td>
		<td>EC.Button</td>
	</tr>
</table>

## EC.Point ##
`extends EC.Event`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>x</td>
		<td>Number</td>
		<td>0</td>
		<td>x值</td>
	</tr>
	<tr>
		<td>y</td>
		<td>Number</td>
		<td>0</td>
		<td>y值</td>
	</tr>
</table>

### EC.Point methods ###
<table>
	<tr>
		<td>methods</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>set</td>
		<td>
			Number: x -> x值<br>
			Number: y -> y值
		</td>
		<td>设置x,y的值</td>
		<td>EC.Point</td>
	</tr>
	<tr>
    		<td>clone</td>
    		<td></td>
    		<td>拷贝一份Point</td>
    		<td>EC.Point</td>
    	</tr>
<tr>
    		<td>toString</td>
    		<td></td>
    		<td>Point类字符串化</td>
    		<td>EC.Point</td>
    	</tr>
<tr>
    		<td>add</td>
    		<td>Object: Point实例</td>
    		<td>Point类与自身坐标累加，并返回一个新Point实例</td>
    		<td>EC.Point</td>
    	</tr>
<tr>
    		<td>distance</td>
    		<td></td>
    		<td>计算本身坐标与0,0之间的距离</td>
    		<td>Number</td>
    	</tr>
<tr>
    		<td>copyFrom</td>
    		<td>Object: Point</td>
    		<td>将Point类的坐标覆盖本身坐标</td>
    		<td>EC.Point</td>
    	</tr>
<tr>
    		<td>equals</td>
    		<td>Object: Point</td>
    		<td>判断Point与本身坐标是否相等</td>
    		<td>Boolean</td>
    	</tr>
<tr>
    		<td>offset</td>
    		<td>Number: x<br/>
				Nubmer: y</td>
    		<td>本身坐标累加</td>
    		<td>EC.Point</td>
    	</tr>
<tr>
    		<td>subtract</td>
    		<td>Object: Point</td>
    		<td>计算Point与本身坐标差值，并返回新的Point实例</td>
    		<td>EC.Point</td>
    	</tr>
<tr>
    		<td>getAngle</td>
    		<td>Object: Point</td>
    		<td>计算本身坐标与0,0之间的角度</td>
    		<td>Number</td>
    	</tr>
</table>

### EC.Point 静态methods ###
<table>
	<tr>
		<td>methods</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
<tr>
    		<td>calcDistance</td>
    		<td>Number: x1<br>
				Number: y1<br>
				Number: x2<br>
				Number: y2<br>
			</td>
    		<td>计算两点之前的距离</td>
    		<td>Number</td>
    	</tr>
<tr>
    		<td>distance</td>
    		<td>Object: Point<br>
				Object: Point<br>
			</td>
    		<td>计算两个Point类之间的距离</td>
    		<td>Number</td>
    	</tr>
<tr>
    		<td>fromValues</td>
    		<td>Number: x<br>
				Number: y<br>
			</td>
    		<td>将x,y转换成[x, y]</td>
    		<td>Array</td>
    	</tr>
<tr>
    		<td>getAngle</td>
    		<td>Number: x1<br>
				Number: y1<br>
				Number: x2<br>
				Number: y2<br>
			</td>
    		<td>计算两点之前的角度</td>
    		<td>Number</td>
    	</tr>
</table>

## EC.MovieClip properties ##
`extends EC.Sprite`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>currentFrame</td>
		<td>Number</td>
		<td>0</td>
		<td>当前动画所在帧数</td>
	</tr>
	<tr>
		<td>totalFrames</td>
		<td>Number</td>
		<td>--</td>
		<td>当前动画帧数的长度</td>
	</tr>
<tr>
		<td>frameRate</td>
		<td>Number</td>
		<td>1000/24</td>
		<td>帧的播放速度</td>
	</tr>
<tr>
</table>

## EC.MovieClip ##
`extends EC.Sprite`
<table>
	<tr>
		<td>method</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>constructor</td>
		<td>Object/String: resUrl -> MovieClip图片资源<br>
			Object/String: resConfig -> MovieClip配置参数</td>
		<td>精灵图动画</td>
		<td>MovieClip</td>
	</tr>
	<tr>
		<td>gotoAndPlay</td>
		<td>Number: startFrame -> 动画播放的起始帧<br>
			Number: playTimes -> 动画播放次数，当为-1时表示重复循环播放<br>
			Nubmer: frameRate -> 动画帧速，默认为24		
		</td>
		<td>开始播放动画</td>
		<td>MovieClip</td>
	</tr>
	<tr>
		<td>gotoAndStop</td>
		<td>Number: endFrame -> 停止动画并停留在指定帧</td>
		<td>停止动画</td>
		<td>MovieClip</td>
	</tr>
	<tr>
		<td>prevFrame</td>
		<td>--</td>
		<td>回退一帧</td>
		<td>MovieClip</td>
	</tr>
	<tr>
		<td>nextFrame</td>
		<td>--</td>
		<td>前进一帧</td>
		<td>MovieClip</td>
	</tr>
	<tr>
		<td>play</td>
		<td>--</td>
		<td>开始动画</td>
		<td>MovieClip</td>
	</tr>
	<tr>
		<td>stop</td>
		<td>--</td>
		<td>开始动画</td>
		<td>MovieClip</td>
	</tr>
	<tr>
		<td>pause</td>
		<td>Number: time -> 动画暂停时间，然后继续动画，不设定则不会继续</td>
		<td>暂停动画</td>
		<td>MovieClip</td>
	</tr>
	<tr>
		<td>wait</td>
		<td>Number: time -> 动画结束后，延迟指定时间执行complete事件</td>
		<td>动画结束指定延迟执行complete事件</td>
		<td>MovieClip</td>
	</tr>
	<tr>
		<td>setFrameRate</td>
		<td>Number: frameRate -> 设置帧速</td>
		<td>暂停动画</td>
		<td>MovieClip</td>
	</tr>
<tr>
		<td>isPlaying</td>
		<td>--</td>
		<td>判断当前动画是否在播放</td>
		<td>Boolean</td>
	</tr>
</table>

### EC.MovieClip events ###
<table>
	<tr>
		<td>name</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>complete</td>
		<td>当动画停止时执行的回调</td>
	</tr>
<tr>
		<td>loopcomplete</td>
		<td>当动画播放完一轮时执行的回调</td>
	</tr>
<tr>
		<td>pause</td>
		<td>当动画暂停时执行的回调</td>
	</tr>
</table>

### EC.ScrollView properties ###
`extends EC.Sprite`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>vertical</td>
		<td>Boolean</td>
		<td>true</td>
		<td>是否垂直滚动</td>
	</tr>
	<tr>
		<td>initialValue</td>
		<td>Number</td>
		<td>0</td>
		<td>初始滚动位置</td>
	</tr>
<tr>
		<td>adjustValue</td>
		<td>Number</td>
		<td>0</td>
		<td>滚动容器的高度或宽度调节</td>
	</tr>
<tr>
		<td>disabled</td>
		<td>Boolean</td>
		<td>false</td>
		<td>是否可滚动</td>
	</tr>
<tr>
		<td>layout</td>
		<td>Object: EC.Sprite</td>
		<td>null</td>
		<td>滚动容器</td>
	</tr>
<tr>
		<td>step</td>
		<td>Number</td>
		<td>undefined</td>
		<td>滚动snap</td>
	</tr>
</table>

### EC.ScrollView ###
`extends EC.Sprite`
<table>
	<tr>
		<td>method</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>scrollTo</td>
		<td>Number: value -> 滚动值<br>
			Number: duration -> 滚动速度<br>
			Function: ease -> 滚动easing
	</td>
		<td>滚动到指定位置</td>
		<td>EC.ScrollView</td>
	</tr>
	<tr>
		<td>stop</td>
		<td>--</td>
		<td>立即停止滚动</td>
		<td>EC.ScrollView</td>
	</tr>
</table>

### EC.ScrollView events ###
<table>
	<tr>
		<td>name</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>scroll</td>
		<td>滚动时执行的回调</td>
	</tr>
<tr>
		<td>totop</td>
		<td>当滚动到顶部时执行的回调</td>
	</tr>
<tr>
		<td>tobottom</td>
		<td>当滚动到底部时执行的回调</td>
	</tr>
<tr>
		<td>scrollstop</td>
		<td>当滚动停止时执行的回调</td>
	</tr>
<tr>
		<td>rebound</td>
		<td>当重新回弹至顶部或底部时执行的回调</td>
	</tr>
</table>

## EC.Stage ##
`extends EC.DisplayObjectContainer`
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>canvas</td>
		<td>DOMObject</td>
		<td>canvas object</td>
		<td>canvas节点对象</td>
	</tr>
	<tr>
		<td>renderContext</td>
		<td>Object</td>
		<td>CanvasRenderingContext2D</td>
		<td>canvas 2d对象</td>
	</tr>
	<tr>
		<td>blendMode</td>
		<td>String</td>
		<td>source-over</td>
		<td>新图像的绘制方式</td>
	</tr>
<tr>
		<td>width</td>
		<td>Number</td>
		<td>options.width（只读）</td>
		<td>画布宽度</td>
	</tr>
<tr>
		<td>height</td>
		<td>Number</td>
		<td>options.height（只读）</td>
		<td>画布高度</td>
	</tr>
<tr>
		<td>scaleRatio</td>
		<td>Number</td>
		<td>1（只读）</td>
		<td>画布缩放比率</td>
	</tr>
</table>

### EC.Stage options ###
<table>
	<tr>
		<td>properties</td>
		<td>类型</td>
		<td>默认</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>showFps</td>
		<td>Boolean</td>
		<td>false</td>
		<td>是否开启性能监测</td>
	</tr>
	<tr>
		<td>scaleMode</td>
		<td>String</td>
		<td>showAll</td>
		<td>画布缩放方式，可选值有:showAll, noScale, fixedWidth</td>
	</tr>
	<tr>
		<td>width</td>
		<td>Number</td>
		<td>window innerWidth</td>
		<td>画布宽度</td>
	</tr>
	<tr>
		<td>height</td>
		<td>Number</td>
		<td>window innerHeight</td>
		<td>画布高度</td>
	</tr>
<tr>
		<td>frameRate</td>
		<td>Number</td>
		<td>60</td>
		<td>图像每秒渲染的帧数</td>
	</tr>
<tr>
		<td>blendMode</td>
		<td>String</td>
		<td>source-over</td>
		<td>图像叠加模式</td>
	</tr>
<tr>
		<td>forceUpdate</td>
		<td>Boolean</td>
		<td>false</td>
		<td>为true时将使用setInterval代替requestAnimationFrame</td>
	</tr>
<tr>
</table>

### EC.Stage methods ###
<table>
	<tr>
		<td>methods</td>
		<td>parameter</td>
		<td>描述</td>
		<td>return</td>
	</tr>
	<tr>
		<td>addChild</td>
		<td>
			Object: childObject -> 添加子集
		</td>
		<td>向舞台添加一个子集</td>
		<td>EC.Stage</td>
	</tr>
	<tr>
		<td>showFps</td>
		<td>
			Object: {left, top, right, bottom} 性能监测表显示的位置
		</td>
		<td>设置性能监测表显示的位置</td>
		<td>EC.Stage</td>
	</tr>
<tr>
		<td>start</td>
		<td>--</td>
		<td>开始渲染</td>
		<td>EC.Stage</td>
	</tr>
	<tr>
		<td>stop</td>
		<td>--</td>
		<td>停止渲染</td>
		<td>EC.Stage</td>
	</tr>
<tr>
		<td>clear</td>
		<td>--</td>
		<td>清除画布</td>
		<td>EC.Stage</td>
	</tr>
<tr>
		<td>render</td>
		<td>--</td>
		<td>渲染画布</td>
		<td>EC.Stage</td>
	</tr>
</table>

### TouchEvents ###
<table>
	<tr>
		<td>name</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>touchstart</td>
		<td>手指或鼠标按下时执行的回调</td>
	</tr>
<tr>
		<td>longtouch</td>
		<td>长按时执行的回调</td>
	</tr>
<tr>
		<td>touchmove</td>
		<td>手指或鼠标移动时执行的回调</td>
	</tr>
<tr>
		<td>touchend</td>
		<td>手指或鼠标抬起时执行的回调</td>
	</tr>
<tr>
		<td>touch</td>
		<td>手指或鼠标按下并抬起时执行的回调</td>
	</tr>
<tr>
		<td>touchenter</td>
		<td>手指或鼠标进入时执行的回调</td>
	</tr>
<tr>
		<td>touchout</td>
		<td>手指或鼠标离开时执行的回调</td>
	</tr>
</table>

## live demo ##
- [弹幕](https://semdy.github.io/easyrender/dist/index.html "弹幕")
- [奔跑的兔子](https://semdy.github.io/easyrender/dist/MovieClip.html "奔跑的兔子")
- [系列图动画+tween测试](https://semdy.github.io/easyrender/dist/MovieClip2.html)
- [序列帧动画+事件测试](https://semdy.github.io/easyrender/dist/MovieClip3.html)
- [形状](https://semdy.github.io/easyrender/dist/shape.html)
- [遮罩](https://semdy.github.io/easyrender/dist/Mask.html)
- [文本输入框](https://semdy.github.io/easyrender/dist/TextInput.html)
- [文本排版](https://semdy.github.io/easyrender/dist/Text.html)
- [ScrollView](https://semdy.github.io/easyrender/dist/scrollview.html)
- [BitMapText](https://semdy.github.io/easyrender/dist/BitMapText.html)
- [Button](https://semdy.github.io/easyrender/dist/Button.html)
- [TouchEvent](https://semdy.github.io/easyrender/dist/TouchEvent.html)
- [Drag](https://semdy.github.io/easyrender/dist/Drag.html)
- [碰撞检测](https://semdy.github.io/easyrender/dist/hitTest.html)
- [物理世界](https://semdy.github.io/easyrender/dist/physics.html)
