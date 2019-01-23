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

var sendInvokeTx = (scriptHash,invokeParam,callback) =>{
    alert("inject sendInvokeTx");
    window.postMessage({
        key:"sendInvokeTx",
        msg:{
            scriptHash: scriptHash, 
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