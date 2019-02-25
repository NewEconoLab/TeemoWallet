import { Utxo, MarkUtxo } from "./entity";
import { common } from "./store/common";

    /**
     * 继承 NEO-TS SDK - Transaction类
     */
    export class Transaction extends ThinNeo.Transaction
    {    

        public marks:MarkUtxo[]=[];

        constructor(type?:ThinNeo.TransactionType)
        {
            super();
            this.type = type ? type : ThinNeo.TransactionType.ContractTransaction;
            this.version = 0;// 0 or 1
            this.extdata = null;
            this.witnesses = [];
            this.attributes = [];
            this.inputs = [];
            this.outputs = [];
        }

        /**
         * setScript 往交易中塞入脚本 修改交易类型为 InvokeTransaction
         */
        public setScript(script: Uint8Array) 
        {
            this.type = ThinNeo.TransactionType.InvocationTransaction;
            this.extdata = new ThinNeo.InvokeTransData();
            (this.extdata as ThinNeo.InvokeTransData).script = script;
            this.attributes = new Array<ThinNeo.Attribute>(1);
            this.attributes[ 0 ] = new ThinNeo.Attribute();
            this.attributes[ 0 ].usage = ThinNeo.TransactionAttributeUsage.Script;
            this.attributes[ 0 ].data = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(common.account.address);
        }

        /**
         * 创建一个交易中的输入和输出 将使用过的utxo 放入 marks
         * @param utxos 资产的utxo 
         * @param sendcount 输出总数
         * @param target 对方地址
         */
        public creatInuptAndOutup(utxos: Utxo[], sendcount: Neo.Fixed8, target?: string)
        {
            let count = Neo.Fixed8.Zero;
            let scraddr = "";
            const assetId: Uint8Array = utxos[0].asset.hexToBytes().reverse();
            // 循环utxo 塞入 input
            for (const utxo of utxos) 
            {
                const input = new ThinNeo.TransactionInput();
                input.hash = utxo.txid.hexToBytes().reverse();
                input.index = utxo.n;
                input.addr = utxo.addr;
                count = count.add(utxo.count);
                scraddr = utxo.addr;
                this.inputs.push(input);
                this.marks.push(new MarkUtxo(utxo.txid,utxo.n));
                if(count.compareTo(sendcount)>0)    // 塞入足够的input的时候跳出循环
                {
                    break;
                }
            }
            if(count.compareTo(sendcount)>=0)   // 比较utxo是否足够转账
            {
                if(target)
                {   // 如果有转账地址则塞入转账的金额
                    if(sendcount.compareTo(Neo.Fixed8.Zero)>0)
                    {
                        const output = new ThinNeo.TransactionOutput();
                        output.assetId = assetId;
                        output.value = sendcount;
                        output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(target);
                        this.outputs.push(output); 
                    }
                }
                const change = count.subtract(sendcount); // 应该找零的值
                if (change.compareTo(Neo.Fixed8.Zero) > 0)
                {   // 塞入找零
                    const outputchange = new ThinNeo.TransactionOutput();
                    outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                    outputchange.value = change;
                    outputchange.assetId = assetId
                    this.outputs.push(outputchange);
                }
            }
            else
            {
                throw new Error("You don't have enough utxo;");            
            }
        }

        public getTxid()
        {
            return this.GetHash().clone().reverse().toHexString();
        }

        
    }