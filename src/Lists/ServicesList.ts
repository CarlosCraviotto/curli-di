import {ServiceItem} from "./ServiceItem";
import {ServiceNotFoundException} from "../Exceptions";

export class ServicesList {
    private list: Array<ServiceItem>;

    public constructor() {
        this.list = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public add (name: string, service: any): void {

        if (this.exist(name)) {
            throw new Error("The service with name " + name + " already exist.");
        } else {
            this.list.push(new ServiceItem(name, service));
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public find (name: string): ServiceItem {
         const service = this.list.find((serviceItem: ServiceItem) => {
            return serviceItem.isThisService(name);
        });

        if (!(service instanceof ServiceItem)){
            throw new ServiceNotFoundException(service);
        }

        return service;
    }

    public exist (name: string): boolean {
        let exist: boolean = true;
        try {
            this.find(name);
        } catch (e) {
            if (!(e instanceof ServiceNotFoundException)) {
                throw e;
            } else {
                exist = false;
            }
        }
        return exist;
    }

    public getList (): Array<ServiceItem> {
        return this.list;
    }

    public combine (servicesList: ServicesList): ServicesList {
        const list = servicesList.getList();
        list.forEach((serviceItem: ServiceItem) => {
            this.add(serviceItem.getName(), serviceItem.getService());
        });
        return this;
    }

    public convertToListOfNames (): Array<string> {
        const list: Array<string> = [];
        this.list.forEach((serviceItem: ServiceItem) => {
            list.push(serviceItem.getName());
        });
        return list;
    }
}