# easyrender
a lite frameworks for canvas
#简要文档
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
		<td><code>colorTransfer.toHex(rgb)</code> -> RGB颜色转换为16进制</td>
		<td>String: hex</td>
	</tr>
	<tr>
		<td>String: hex -> 颜色16进制值 <br>
			Number: alpha -> 颜色透明度</td>
		<td><code>colorTransfer.toRgb(hex, alpha)</code> -> 16进制颜色转为RGB格式</td>
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
		<td>off</td>
		<td>name: 事件名<br>
			callback: 事件监听listener</td>
		<td>取消一个事件监听</td>
	</tr>
	<tr>
		<td>dispatch / emit</td>
		<td>name: 事件名</td>
		<td>触发一个事件</td>
	</tr>
	<tr>
		<td>clear</td>
		<td>--</td>
		<td>清空事件池</td>
	</tr>
</table>

## RES ##
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
		<td>el</td>
		<td>selector: 节点selector<br>
			container: 节点父容器selector		
		</td>
		<td>一个简单的元素选择器</td>
		<td>object</td>
	</tr>
</table>

## EC.Ticker ##
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
	<tr>
		<td>off</td>
		<td>name: 事件名<br>
			callback: 事件监听listener</td>
		<td>取消一个事件监听</td>
	</tr>
	<tr>
		<td>dispatch / emit</td>
		<td>name: 事件名</td>
		<td>触发一个事件</td>
	</tr>
	<tr>
		<td>clear</td>
		<td>--</td>
		<td>清空事件池</td>
	</tr>
</table>

## EC.Timer ##
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
- [BitMapText](https://semdy.github.io/easyrender/dist/BitMapText.html)
- [TouchEvent](https://semdy.github.io/easyrender/dist/TouchEvent.html)
- [碰撞检测](https://semdy.github.io/easyrender/dist/hitTest.html)
