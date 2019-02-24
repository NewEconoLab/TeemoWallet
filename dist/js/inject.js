var Test=()=>{
    alert("test")
}
var getAccount = (callback) =>{
    alert("inject getAccount");

    window.postMessage({
        key:"getAccount",
        msg:{}
    },"*")

    window.addEventListener("message", function(e)
    {
        var request = e.data;
        if(request.key === "getAccount_R")
        {
            callback(request.msg);
        }
    }, false);
}

// invoke 调用
// var invokeGroup = (invokeMessage) =>{
//     window.postMessage({
//         key:"invokeGroup",
//         msg:invokeMessage
//     },"*")
//     window.addEventListener("message", function(e)
//     {
//         var request = e.data;
//         if(request.key === "invokeGroup_R")
//         {
//             callback(request.msg);
//         }
//     }, false);
// }

var sendTransferTx = (from,to,asset,value,callback) =>{
    alert("inject sendTransferTx");

    window.postMessage({
        key:"sendTransferTx",
        msg:{
            from: from, 
            to: to,
            asset: asset,
            value: value
        }
    },"*")

    window.addEventListener("message", function(e)
    {
        var  request = e.data;
        if(request.key === "sendTransferTx_R")
        {
            callback(request.msg);
        }
    }, false);
}

/**
 *  合约调用
 * @param {*} invokeParam 
 * @param {any} callback 
 */
var invokeGroup = (invokeParam,callback) =>{
    alert("inject sendInvokeTx");
    window.postMessage({
        key:"sendInvokeTx",
        msg:{
            invokeParam: invokeParam
        }
    },"*")

    window.addEventListener("message", function(e)
    {
        var request = e.data;
        if(request.key === "sendInvokeTx_R")
        {
            callback(request.msg);
        }
    }, false);
}

// function sendMsgTest() {
//     window.postMessage({"test": '这里是inject.js'}, '*');
// }