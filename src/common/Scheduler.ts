type Task = () => void;
let runningTask: Promise<void> = Promise.resolve();
const queue: Task[] = [];

export default class Scheduler {
    public static schedule(callback: Task) {
        queue.push(callback);
    }

    public static scheduleAsync(callback: Task) {
        queue.push(async ()=>callback());
    }
    
    public static async flush(): Promise<void> {
        return runningTask = runningTask.finally(() => {
            const task = queue.shift();
            if (task) return task();
        });
    }
}
