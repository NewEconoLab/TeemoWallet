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

var teemmo;
((teemmo)=>{

    var getProvider=()=>{
        return new Promise((resolve, reject) =>{
            window.postMessage({
                key:"getProvider",
                msg:{}
            },"*");            
            window.addEventListener("message", function(e)
            {
                var request = e.data;
                if(request.key === "getProvider_R")
                {
                    resolve(request.msg);
                }
            }, false);
        });
    }

    var getNetworks=()=>{
        return new Promise((resolve, reject) =>{
            window.postMessage({
                key:"getNetworks",
                msg:{}
            },"*");            
            window.addEventListener("message", function(e)
            {
                var request = e.data;
                if(request.key === "getProvider_R")
                {
                    resolve(request.msg);
                }
            }, false);
        });
    }

    var getAccount=()=>{
        return new Promise((resolve, reject) =>{
            window.postMessage({
                key:"getAccount",
                msg:{}
            },"*")
        
            window.addEventListener("message", function(e)
            {
                var request = e.data;
                if(request.key === "getAccount_R")
                {
                    resolve(request.msg);
                }
            }, false);
        });
    }

    var getBalance=(params)=>{
        return new Promise((resolve, reject) =>{
            window.postMessage({
                key:"getBalance",
                msg:{}
            },"*");            
            window.addEventListener("message", function(e)
            {
                var request = e.data;
                if(request.key === "getProvider_R")
                {
                    resolve(request.msg);
                }
            }, false);
        });
    }

    var getStorage=(params)=>{
        return new Promise((resolve, reject) =>{
            window.postMessage({
                key:"getStorage",
                msg:{}
            },"*");            
            window.addEventListener("message", function(e)
            {
                var request = e.data;
                if(request.key === "getProvider_R")
                {
                    resolve(request.msg);
                }
            }, false);
        });
    }
    
    var send=(params)=>{
        return new Promise((resolve, reject) =>{
            window.postMessage({
                key:"send",
                msg:{}
            },"*");            
            window.addEventListener("message", function(e)
            {
                var request = e.data;
                if(request.key === "getProvider_R")
                {
                    resolve(request.msg);
                }
            }, false);
        });
    }
    
    var invoke=(params)=>{
        return new Promise((resolve, reject) =>{
            window.postMessage({
                key:"invoke",
                msg:{
                    invokeParam: params
                }
            },"*")
        
            window.addEventListener("message", function(e)
            {
                var request = e.data;
                if(request.key === "invoke_R")
                {
                    resolve(request.msg);
                }
            }, false);
        });
    }

    var NEO={
        getProvider,
        getNetworks,
        getAccount,
        getBalance,
        getStorage,
        send,
        invoke
    }
    teemmo.NEO=NEO

})(teemmo || (teemmo = {}));