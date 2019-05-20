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
    readonly webSocketURL: "wss://testws.nel.group/ws/mainnet" | "wss://testws.nel.group/ws/testnet";
    updateLastWSmsgSec: () => void;
    socketInit(): void;
}
declare function TaskNotify(task: Task): void;
//# sourceMappingURL=scoket.d.ts.map