interface PendingUpdate {
    name: string;
    currentMetadata: Record<string, string>;
    remoteMetadata: Record<string, string>;
}
export default class PendingUpdateStore {
    static getPendingUpdate(name: string): PendingUpdate | undefined;
    static getPendingUpdates(): PendingUpdate[];
    static addPendingUpdate(name: string, currentMetadata: Record<string, string>, remoteMetadata: Record<string, string>): void;
    static removePendingUpdate(name: string): void;
    static emit(): void;
    static subscribe(callback: (pendingUpdates: PendingUpdate[]) => void): void;
}
export {};
