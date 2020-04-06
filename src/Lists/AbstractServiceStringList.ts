import {ServiceNotFoundException} from "../Exceptions";
import {EventEmitter} from "../Events";
import {ActionListEnumType} from "./ActionListEnumType";


export abstract class AbstractServiceStringList extends EventEmitter{
    protected list: Array<string> = [];

    protected constructor() {
        super();
        this.restartList();
    }

    public add(serviceName: string): void {
        if (!this.exist(serviceName)) {
            this.list.push(serviceName);
            this.sendNotification(ActionListEnumType.Add, serviceName);
        }
    }

    public find(serviceName: string): string {
        const serviceNameFound: string | undefined = this.list.find((serviceItem: string) => {
            return serviceItem === serviceName;
        });

        if (!serviceNameFound) {
            throw new ServiceNotFoundException(serviceNameFound);
        }
        return serviceNameFound;
    }

    public exist(serviceName: string): boolean {
        let exist: boolean = true;
        try {
            this.find(serviceName);
        } catch (e) {
            exist = false;
        }
        return exist;
    }

    public getList(): Array<string> {
        return this.list;
    }

    public remove(serviceName: string): void {
        this.list.splice(this.list.indexOf(serviceName), 1);
        this.sendNotification(ActionListEnumType.Remove, serviceName);
    }

    public restartList(): void {
        this.list = [];
    }

    private sendNotification(action: string, serviceName: string) {
        this.notify(action + ":" + serviceName);
    }

}