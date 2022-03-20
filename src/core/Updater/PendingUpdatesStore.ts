interface PendingUpdate {
    name: string;
    currentMetadata: Record<string, string>;
    remoteMetadata: Record<string, string>;
}

const pendingUpdates = new Map<string, PendingUpdate>();
const listeners = new Set<(updates: PendingUpdate[]) => void>();

export default class PendingUpdateStore {
    static getPendingUpdate(name: string): PendingUpdate | undefined {
        return pendingUpdates.get(name);
    }

    static getPendingUpdates(): PendingUpdate[] {
        return [...pendingUpdates.values()];
    }

    static addPendingUpdate(
        name: string,
        currentMetadata: Record<string, string>,
        remoteMetadata: Record<string, string>
    ): void {
        if (pendingUpdates.has(name)) {
            if (
                pendingUpdates.get(name)?.remoteMetadata.version !=
                remoteMetadata.version
            ) {
                pendingUpdates.set(name, {
                    name,
                    currentMetadata,
                    remoteMetadata,
                });
                this.emit();
            }
        } else {
            pendingUpdates.set(name, {
                name,
                currentMetadata,
                remoteMetadata,
            });
            this.emit();
        }
    }

    static removePendingUpdate(name: string): void {
        pendingUpdates.delete(name);
        this.emit();
    }

    static emit(): void {
        listeners.forEach((listener) => listener(this.getPendingUpdates()));
    }

    static subscribe(
        callback: (pendingUpdates: PendingUpdate[]) => void
    ): void {
        listeners.add(callback);
    }
}
