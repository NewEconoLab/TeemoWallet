class SocketManager {
    constructor() {
        this.time = new Date().getTime();
        this.socketReadyState = -1;
        this.blockDatas = [{
                blockHeight: -1,
                blockTime: 0,
                blockHash: '',
                timeDiff: 0
            }];
        this.lastBlockTime = 0;
        this.lastWSmsgTime = new Date().getTime();
        this.lastWSmsgSec = 0;
        this.reconnection = 0;
        this.txids = [];
        this.updateLastWSmsgSec = () => {
            setTimeout(() => {
                this.lastWSmsgSec = (new Date().getTime() - this.lastWSmsgTime) / 1000;
                //webstock 如果2分钟取不到最新块，会发送心跳数据包
                if (this.lastWSmsgSec > 75) {
                    if (this.reconnection >= 3) {
                        this.socket.close();
                        this.reconnection = 0;
                        setInterval(() => {
                            Api.getBlockCount()
                                .then(result => {
                                const count = (parseInt(result) - 1);
                                if (count - storage.height != 0) {
                                    storage.height = count;
                                    TaskManager.update();
                                }
                            })
                                .catch(error => {
                                console.log(error);
                            });
                        }, 15000);
                    }
                    else {
                        this.lastWSmsgTime = new Date().getTime(),
                            this.lastWSmsgSec = 0;
                        this.socketInit();
                        this.reconnection++;
                        this.updateLastWSmsgSec(); // 回调自己
                    }
                }
                else {
                    this.updateLastWSmsgSec(); // 回调自己
                }
                if (this.socket)
                    this.socketReadyState = this.socket.readyState;
            }, 1000);
        };
    }
    get webSocketURL() {
        if (storage.network == 'MainNet')
            return 'wss://testws.nel.group/ws/mainnet';
        else
            return 'wss://testws.nel.group/ws/testnet';
    }
    socketInit() {
        console.log("socketInit", storage.network);
        if (this.socket) {
            this.socket.close();
        }
        this.blockDatas = [{
                blockHeight: -1,
                blockTime: 0,
                blockHash: '',
                timeDiff: 0
            }];
        this.socket = new WebSocket(this.webSocketURL);
        this.socket.onclose = (event) => {
            console.log('close', event);
        };
        this.socket.onerror = (event) => {
            console.log('error', event);
        };
        this.socket.onopen = (event) => {
            console.log('open', event);
            this.socket.send('Hello Server!');
        };
        this.socket.onmessage = (event) => {
            // console.log(event);
            // console.log(event.data);
            this.lastWSmsgTime = new Date().getTime();
            this.time = new Date().getTime();
            var data = JSON.parse(event.data).data;
            if (data.blockHeight != null) {
                storage.height = data.blockHeight;
                console.log('最新高度', storage.height);
                // if(data.tx && data.tx.length>0)
                // {
                //     this.txids = this.txids.concat(data.tx);
                // }
                EventsOnChange(WalletEvents.BLOCK_HEIGHT_CHANGED, event.data);
                for (const key in TaskManager.shed) {
                    const task = TaskManager.shed[key];
                    if (task.network == storage.network && task.state == TaskState.watting) {
                        if (data.tx.findIndex(txid => txid.txid.replace('0x', '') == task.txid) > 0) {
                            task.state = TaskState.success;
                            TaskManager.shed[key] = task;
                            Storage_local.set(TaskManager.table, TaskManager.shed);
                            const count = storage.accountWaitTaskCount[task.currentAddr] ? storage.accountWaitTaskCount[task.currentAddr] : 0;
                            storage.accountWaitTaskCount[task.currentAddr] = count - 1;
                            EventsOnChange(WalletEvents.TRANSACTION_CONFIRMED, { TXID: task.txid, blockHeight: data.blockHeight, blockTime: data.blockTime });
                            if (task.type == ConfirmType.toClaimgas) {
                                if (storage.account && storage.account.address == task.message) {
                                    claimGas();
                                }
                                else {
                                    localStorage.setItem('Teemo-claimgasState-' + task.network, '');
                                }
                            }
                            if (task.type == ConfirmType.claimgas) {
                                localStorage.setItem('Teemo-claimgasState-' + task.network, '');
                            }
                            if (task.next) {
                                TransferGroup.update(task.next, task.network);
                            }
                        }
                        else if (task.confirm > 4) {
                            Api.getrawtransaction(task.txid, task.network)
                                .then(result => {
                                if (result['blockhash']) {
                                    task.state = TaskState.success;
                                    TaskManager.shed[key] = task;
                                    Storage_local.set(TaskManager.table, TaskManager.shed);
                                    const count = storage.accountWaitTaskCount[task.currentAddr] ? storage.accountWaitTaskCount[task.currentAddr] : 0;
                                    storage.accountWaitTaskCount[task.currentAddr] = count - 1;
                                    if (task.next) {
                                        TransferGroup.update(task.next, task.network);
                                    }
                                }
                            })
                                .catch(error => {
                                console.log(error);
                            });
                        }
                    }
                }
                var blockHeightDataArray = this.blockDatas;
                if (blockHeightDataArray[0].blockHeight == -1)
                    blockHeightDataArray.shift();
                if (blockHeightDataArray.length >= 50)
                    blockHeightDataArray.pop();
                let timeDiff = 0;
                if (blockHeightDataArray.length > 0)
                    timeDiff = (data.blockTime - blockHeightDataArray[0].blockTime);
                let blockData = data;
                blockData['timeDiff'] = timeDiff;
                blockData['txCount'] = data.tx.length;
                blockHeightDataArray.unshift(blockData);
                this.blockDatas = blockHeightDataArray;
                this.lastBlockTime = data.blockTime;
            }
        };
    }
}
function TaskNotify(task) {
    const lang = sessionStorage.getItem('language');
    let title = (!lang || lang == 'zh') ? "交易已确认" : "Confirmed transaction";
    let value = (!lang || lang == 'zh') ? "交易成功，请在浏览器中查看。" : "Transaction confirmed. View on NELScan.";
    let amount = "";
    if (task.confirm === ConfirmType.tranfer) {
        const data = TaskManager.sendHistory[task.txid];
        amount = data.amount + " " + data.asset + " ";
    }
    else if (task.confirm === ConfirmType.contract) {
        const data = TaskManager.invokeHistory[task.txid];
        amount = data.expenses.map(expense => {
            "-" + expense.amount + " " + expense.symbol;
        }).join(',');
    }
    else if (task.confirm === ConfirmType.claimgas) {
        const data = TaskManager.sendHistory[task.txid];
        amount = data.amount + " " + data.asset + " ";
    }
    showNotify(title, (amount ? amount : '') + value);
}
//# sourceMappingURL=scoket.js.map