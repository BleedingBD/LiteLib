export default class Updater {
    static checkForUpdate(metadata: Record<string, string>): Promise<boolean | undefined>;
    private static fetchMetadata;
}
