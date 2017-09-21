// WidgetTransEleBox
// ＝＝＝＝＝＝
// 1.默认变量
// boundingBox: 父容器
// ＝＝＝＝＝＝＝＝＝＝
// 2.接口
// renderUI: 添加dom节点
// bindUI: 监听者
// initUI: 初始化属性
// destructor: 析构函数(销毁前调用)
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 3.方法
// render: 渲染组件
// destroy: 销毁组件
function WidgetTransEleBox() {
    this.boundingBox = null;
    this.target = null;
}
WidgetTransEleBox.prototype = {
    renderUI: function() {},
    bindUI: function() {},
    initUI: function() {},
    render: function(container) {
        this.handlers = {};
        this.renderUI();
        this.bindUI();
        this.initUI();
    },
    destructor: function() {},
    destroy: function() {
        this.destructor();
        this.off();
        this.boundingBox.parentNode.removeChild(this.boundingBox);
    },
    // 自定义事件
    on: function(type, handler) {
        if (typeof this.handlers[type] == 'undefined') {
            this.handlers[type] = [];
        }
        this.handlers[type].push(handler);
        return this;
    },
    off: function() {
        for (var type in this.handlers) {
            delete this.handlers[type];
        }
    },
    fire: function(type, data) {
        if (this.handlers[type] instanceof Array) {
            for (var i = 0, len = this.handlers[type].length; i < len; i++) {
                this.handlers[type][i](data);
            }
        }
    }
}
window.WidgetTransEleBox = WidgetTransEleBox;