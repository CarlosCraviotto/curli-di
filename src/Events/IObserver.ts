export interface IObserver {
    notify(eventName: string): void;
}