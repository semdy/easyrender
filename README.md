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
		<td>DOMObject/Array&lt;DOMObject&gt;</td>
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
		<td>onUpdate</td>
		<td>
			Function: callback -> 当前状态更新时执行的回调<br>
			Object: context -> 设定上下文
		</td>
		<td>当前状态更新时间执行</td>
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
		<td>addChild</td>
		<td>Object: childObject -> 子集对象<br>
			Number: index -> 子集的添加位置</td>
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
		<td>removeAllChildren</td>
		<td>--</td>
		<td>清除子集</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
<tr>
		<td>getChilds</td>
		<td>--</td>
		<td>获取当前容器所有子集对象</td>
		<td>EC.DisplayObjectContainer</td>
	</tr>
<tr>
		<td>getBounds</td>
		<td>--</td>
		<td>获取当前容器的边界</td>
		<td>EC.DisplayObjectContainer</td>
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
		<td>setParams</td>
		<td>Object: params -> 参数集</td>
		<td>设置当前容器的相关属性</td>
		<td>EC.DisplayObjectContainer</td>
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
		<td>textFamily</td>
		<td>String</td>
		<td>Microsoft yahei,Arial,sans-serif</td>
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
		<td>lineHeight</td>
		<td>Number</td>
		<td>20</td>
		<td>行高</td>
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
		<td>""</td>
		<td>填充样式</td>
	</tr>
	<tr>
		<td>strokeStyle</td>
		<td>String</td>
		<td>""</td>
		<td>描边样式</td>
	</tr>
	<tr>
		<td>shadowColor</td>
		<td>String</td>
		<td>""</td>
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
		<td>rect</td>
		<td>x: x坐标 <br>
			y: y坐标<br>
			width: 宽度<br>
			height: 高度
		</td>
		<td>画矩形</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>arc</td>
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
		<td>roundRect</td>
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
		<td>Array&lt;x, y&gt;
		</td>
		<td>从笔触位置到该指定位置画线条</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>line</td>
		<td>x: x起始位置 <br>
			y: y起始位置<br>
			endX: x结束位置<br>
			endY: y结束位置<br>
		</td>
		<td>画实线</td>
		<td>EC.Shape</td>
	</tr>
	<tr>
		<td>dashedLine</td>
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
		<td>ellipse</td>
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
		<td>20</td>
		<td>输入框文本行高</td>
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
		<td>compositeOperation</td>
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
		<td>stop</td>
		<td>--</td>
		<td>停止渲染</td>
		<td>EC.Stage</td>
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
