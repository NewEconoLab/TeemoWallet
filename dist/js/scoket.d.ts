declare class SocketManager {
    socket: WebSocket;
    time: number;
    socketReadyState: number;
    blockDatas: {
        blockHeight: number;
        blockTime: number;
        blockHash: string;
        timeDiff: number;
    }[];
    lastBlockTime: number;
    lastWSmsgTime: number;
    lastWSmsgSec: number;
    reconnection: number;
    txids: string[];
    readonly webSocketURL: "wss://testwss.nel.group/ws/mainnet" | "wss://testwss.nel.group/ws/testnet";
    updateLastWSmsgSec: () => void;
    socketInit(): void;
}
declare function TaskNotify(task: Task): Promise<void>;
//# sourceMappingURL=scoket.d.ts.map