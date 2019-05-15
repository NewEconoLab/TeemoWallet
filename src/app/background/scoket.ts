class SocketManager
{
    socket: WebSocket;
    time = new Date().getTime();
    socketReadyState = -1;
    blockDatas=[{
        blockHeight:-1,
        blockTime:0,
        blockHash:'',
        timeDiff:0
      }];
    lastBlockTime=0;
    lastWSmsgTime=new Date().getTime();
    lastWSmsgSec=0;
    reconnection=0;
    txids:string[] = [];

    get webSocketURL(){
        if(storage.network=='MainNet') return 'wss://testws.nel.group/ws/mainnet'
        else return 'wss://testws.nel.group/ws/testnet'
    }

    updateLastWSmsgSec = () =>{
        setTimeout(() => {
            
            this.lastWSmsgSec=(new Date().getTime() - this.lastWSmsgTime)/1000

            //webstock 如果2分钟取不到最新块，会发送心跳数据包
            if(this.lastWSmsgSec>75){
                if(this.reconnection>=3)
                {
                    this.socket.close();
                    this.reconnection=0;
                    setInterval(()=>{
                        Api.getBlockCount()
                        .then(result=>{
                            const count = (parseInt(result)-1);
                            if(count - storage.height!=0)
                            {
                                storage.height=count;
                                TaskManager.update()
                            }
                        })
                        .catch(error=>{
                            console.log(error);
                        })
                    },15000)     
                }
                else
                {
                    this.lastWSmsgTime=new Date().getTime(),
                    this.lastWSmsgSec=0
                    this.socketInit()
                    this.reconnection++;
                    this.updateLastWSmsgSec();  // 回调自己
                }
            }
            else
            {
                this.updateLastWSmsgSec(); // 回调自己
            }

            if(this.socket) this.socketReadyState = this.socket.readyState
        }, 1000);
    }

    socketInit(){

        console.log("socketInit",storage.network);
        
        if(this.socket){
            this.socket.close()
        }

        this.blockDatas=[{
            blockHeight:-1,
            blockTime:0,
            blockHash:'',
            timeDiff:0
          }]

        this.socket = new WebSocket(this.webSocketURL);
    
        this.socket.onclose = (event:any) => {
            console.log('close',event);
        };
        this.socket.onerror = (event:any) => {
            console.log('error',event);
        };
        this.socket.onopen = (event:any) =>{
            console.log('open',event);
            this.socket.send('Hello Server!');
        }
        this.socket.onmessage = (event:any) =>{
            // console.log(event);
            // console.log(event.data);
            this.lastWSmsgTime = new Date().getTime()
            this.time = new Date().getTime()
            var data = JSON.parse(event.data).data
            if(data.blockHeight != null){
                storage.height= data.blockHeight;
                console.log('最新高度',storage.height);
                
                // if(data.tx && data.tx.length>0)
                // {
                //     this.txids = this.txids.concat(data.tx);
                // }
                
                EventsOnChange(WalletEvents.BLOCK_HEIGHT_CHANGED,event.data);

                for ( const key in TaskManager.shed) 
                {
                    const task = TaskManager.shed[key];
                    if( task.network == storage.network && task.state==TaskState.watting)
                    {
                        if(data.tx.findIndex(txid=>txid.txid.replace('0x','')==task.txid)>0)
                        {
                            task.state = TaskState.success;
                            TaskManager.shed[key]=task;
                            Storage_local.set(TaskManager.table,TaskManager.shed);
                            
                            EventsOnChange(WalletEvents.TRANSACTION_CONFIRMED,{TXID:task.txid,blockHeight:data.blockHeight,blockTime:data.blockTime});
                            if(task.type==ConfirmType.toClaimgas)
                            {
                                if(storage.account && storage.account.address == task.message)
                                {
                                    claimGas();
                                }
                                else
                                {
                                    localStorage.setItem('Teemo-claimgasState-'+task.network,'');
                                }
                            }
                            if(task.type==ConfirmType.claimgas)
                            {
                                localStorage.setItem('Teemo-claimgasState-'+task.network,'');
                            }
                            if(task.next)
                            {
                                TransferGroup.update(task.next,task.network);
                            }
                        }
                        else if(task.confirm>4){
                            Api.getrawtransaction(task.txid,task.network)
                            .then(result=>{                        
                                if(result['blockhash'])
                                {
                                    task.state = TaskState.success;
                                    TaskManager.shed[key]=task;
                                    Storage_local.set(TaskManager.table,TaskManager.shed);
                                    if(task.next)
                                    {
                                        TransferGroup.update(task.next,task.network);
                                    }
                                }
                            })
                            .catch(error=>{
                                console.log(error);
                            })
                        }
                    }
                }


                var blockHeightDataArray = this.blockDatas
                if(blockHeightDataArray[0].blockHeight == -1 ) blockHeightDataArray.shift()
                if(blockHeightDataArray.length>=50) blockHeightDataArray.pop()

                let timeDiff = 0
                if(blockHeightDataArray.length > 0) timeDiff = (data.blockTime - blockHeightDataArray[0].blockTime)
                let blockData = data;
                blockData['timeDiff'] = timeDiff;
                blockData['txCount'] = data.tx.length;
                blockHeightDataArray.unshift(blockData);

                this.blockDatas = blockHeightDataArray
                this.lastBlockTime = data.blockTime
            }
        }
    }
}

