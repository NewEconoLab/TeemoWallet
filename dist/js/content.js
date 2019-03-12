// 向页面注入JS
function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        // 放在页面不好看，执行完后移除掉
        // this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}
function sendMsgTest() {
    window.postMessage({ "test": '这里是contentScript.js' }, '*');
}
// 接收向页面注入的JS
window.addEventListener("message", function (e) {
    var request = e.data;
    if (request.command) {
        chrome.runtime.sendMessage(request);
    }
    if (request.eventInit) {
        chrome.runtime.sendMessage(request);
    }
}, false);
/**
 * 发送返回值
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.return)
        window.postMessage(request, '*');
    if (request.EventName) {
        console.log("收到了Event名称：" + request.EventName);
        window.postMessage(request, '*');
    }
});
window.onload = () => {
    injectCustomJs();
    sendMsgTest();
};
// function getBase64Image(img) {  
//     var canvas = document.createElement("canvas");  
//     canvas.width = img.width;  
//     canvas.height = img.height;  
//     var ctx = canvas.getContext("2d");  
//     ctx.drawImage(img, 0, 0, img.width, img.height);  
//     var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
//     var dataURL = canvas.toDataURL("image/"+ext);  
//     return dataURL;  
// }
// function getBase64ByUrl(url:string) {
//     return new Promise<string>((r,j)=>{
//         var image = new Image();
//         image.src = url;
//         image.onload = ()=>{  
//         let base64 = getBase64Image(image);  
//         r(base64);
//         }
//     })
// }
//# sourceMappingURL=content.js.map