// WidgetTransEleBox
var w = WidgetTransEleBox;
// 元素的拖拽实现
function TransformElementBox(){
    this.config = {
        container: null,
        target: null,
        top: 0,
        left: 0,
        center: false,
        minWidth: 100,
        maxWidth: 500,
        canResize: true,
        canDrag: true
    }
}
TransformElementBox.prototype = extend({}, new w(), {
    renderUI: function(){
        // 创建refixBox
        this.boundingBox = document.createElement('div');
        this.boundingBox.className = 'm-refixBox';
        this.boundingBox.setAttribute('data-target', this.config.target);
        this.config.target = document.getElementsByClassName(this.boundingBox.getAttribute('data-target'))[0];
        // 加伸缩的图标
        var eastSouth = document.createElement('i');
            eastSouth.className = 'u-eastSouth';
        this.config.container.appendChild(this.boundingBox);
        this.boundingBox.appendChild(eastSouth);
        // 设置box属性
        var targetStyle = window.getComputedStyle(this.config.target, null);
        this.boundingBox.style.width = targetStyle.width;
        this.boundingBox.style.height = targetStyle.height;
        this.boundingBox.style.top = parseInt(targetStyle.top) - 2 + 'px';
        this.boundingBox.style.left = parseInt(targetStyle.left) - 2 + 'px';
    },
    bindUI: function(){},
    initUI: function() {
        this.startDrag(this.config.target, this.boundingBox);
        this.startResize(this.boundingBox.getElementsByClassName('u-eastSouth')[0], this.boundingBox);
    },
    destructor: function() {
        // 移除document上这个组件的事件
        document.removeEventListener('mouseup', this.startResize._mouseupHandler);
        document.removeEventListener('mousemove', this.startResize._mousemoveHandler);
        document.removeEventListener('mouseup', this.startDrag._mouseupHandler);
        document.removeEventListener('mousemove', this.startDrag._mousemoveHandler);
    },
    work: function(config, callback){
        extend(this.config, config);
        this.render(this.config.container);
        if (typeof callback !== 'undefined') {
            callback();
        }
    },
    /* 拖拽的实现 */
    startDrag: function(target, box) {
        var params = {
            left: 0,
            top: 0,
            startX: 0,
            startY: 0,
            flag: false
        }
        // 获取box的left & top
        _reGetBoxPosition(target, box);
        // 鼠标down，记录准备开始移动的鼠标位置
        box.onmousedown = function(e) {
            params.flag = true;
            params.startX = e.clientX;
            params.startY = e.clientY;
        };
        // 鼠标up的时候，重新获取box的left & top一遍
        document.addEventListener('mouseup', _mouseupHandler);
        document.addEventListener('mousemove', _mousemoveHandler);
        // 鼠标抬起以后的处理
        function _mouseupHandler(e){
            params.flag = false;
            _reGetBoxPosition(target, box);
        }
        // 鼠标移动时的处理
        function _mousemoveHandler(e) {
            if (params.flag) {
                var nowX = e.clientX,
                    nowY = e.clientY;
                var disX = nowX - params.startX,
                    disY = nowY - params.startY;
                target.style.left = parseFloat(params.left) + disX + 'px';
                target.style.top = parseFloat(params.top) + disY + 'px';
                box.style.left = parseFloat(target.style.left) - 2 + 'px';
                box.style.top = parseFloat(target.style.top) - 2 + 'px';
            }
        }
        // 重新获取box位置
        function _reGetBoxPosition(target){
            params.left = window.getComputedStyle(target, null).left;
            params.top = window.getComputedStyle(target, null).top;
        }
    },
    /* 实现水平、垂直resize图片 */
    startResize: function(eastSouthBar, box){
        var that = this;
        var params = {
            x: 0,
            y: 0,
            startX: 0,
            startY: 0,
            flag: false
        };
        _reGetBoxSize(box);
        eastSouthBar.addEventListener('mousedown', function(e){
            e.stopPropagation();
            params.flag = true;
            params.startX = e.clientX;
            params.startY = e.clientY;
        });
        document.addEventListener('mouseup', _mouseupHandler);
        document.addEventListener('mousemove', _mousemoveHandler);
        // 鼠标抬起以后的处理
        function _mouseupHandler(e){
            params.flag = false;
            _reGetBoxSize(box);
        }
        // 鼠标移动时的处理
        function _mousemoveHandler(e) {
            if (params.flag) {
                var nowX = e.clientX,
                    nowY = e.clientY;
                var targetStyle = window.getComputedStyle(that.config.target, null);
                var ratio = parseInt(targetStyle.height) / parseInt(targetStyle.width);
                var disX = nowX - params.startX,
                    disY = nowY - params.startY;
                var fdisX, fdisY;
                // 下、右都是增大X，上、左都是减小X
                if (disX >= 0 && disY <= 0 || disY >= 0 && disX <= 0) {
                    // 特殊处理上、右方向，和 特殊处理下、左方向
                    fdisX = disY + disX;
                    fdisY = fdisX * ratio;
                }else{
                    if (disX >= 0 || disY >= 0) {
                        fdisX = disX >= disY ? disX : disY;
                        fdisY = fdisX * ratio;
                    }
                    if(disX < 0 || disY < 0){
                        fdisX = disX <= disY ? disX : disY;
                        fdisY = fdisX * ratio;
                    }
                }
                box.style.width = parseFloat(params.x) + fdisX + 'px';
                box.style.height = parseFloat(params.y) + fdisY + 'px';
                // 限制最大宽度 & 高度
                if (that.config.maxWidth < parseInt(box.style.width)) {
                    box.style.width = that.config.maxWidth + 'px';
                    box.style.height = that.config.maxWidth * ratio + 'px';
                }
                if (parseInt(box.style.width) < that.config.minWidth) {
                    box.style.width = that.config.minWidth + 'px';
                    box.style.height = that.config.minWidth * ratio + 'px';
                }
                // 图片的宽度改变
                var target = document.getElementsByClassName(box.getAttribute('data-target'))[0];
                target.style.width = box.style.width;
                target.style.height = box.style.height;
            }
        }
        // 重新获取box的大小
        function _reGetBoxSize(box){
            var obj = {};
            obj.x = params.x = window.getComputedStyle(box, null).width;
            obj.y = params.y = window.getComputedStyle(box, null).height;
            return obj;
        }
    }
});
// extend方法
function extend(out) {
    var out = out || {};
    for (var i = 1, len = arguments.length; i < len; i++) {
        if (!arguments[i])
            continue;
        for (var key in arguments[i]) {
            out[key] = arguments[i][key];
        }
    }
    return out;
}