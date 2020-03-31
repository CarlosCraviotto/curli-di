import {ServiceDescriptionItem} from "./ServiceDescriptionItem";
import {ServiceDescriptionsNotFoundException} from "../Exceptions";

export class ServicesDescriptionList {
    private list: Array<ServiceDescriptionItem>;

    public constructor() {
        this.list = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public add (serviceName: string, dependencies: Array<string>, serviceFunc: object, injectDependencies?: object): void {

        if (this.exist(serviceName)) {
            throw new Error("The service with name " + serviceName + " already registered.");
        } else {
            this.list.push(new ServiceDescriptionItem(serviceName, dependencies, serviceFunc, injectDependencies));
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public find (serviceName: string): ServiceDescriptionItem {
         const serviceDescription = this.list.find((serviceItem: ServiceDescriptionItem) => {
            return serviceItem.isThisService(serviceName);
        });

        if (!(serviceDescription instanceof ServiceDescriptionItem)){
            throw new ServiceDescriptionsNotFoundException(serviceName);
        }

        return serviceDescription;
    }

    public exist (name: string): boolean {
        let exist: boolean = true;
        try {
            this.find(name);
        } catch (e) {
            if (!(e instanceof ServiceDescriptionsNotFoundException)) {
                throw e;
            } else {
                exist = false;
            }
        }
        return exist;
    }

    public remove(serviceName: string): void {
        this.list.forEach((serviceDescription: ServiceDescriptionItem, index) => {
            if (serviceDescription.isThisService(serviceName)) {
                this.list.splice(index, 1);
            }
        });
    }

    public edit(serviceName: string, callback: any) {
        this.list.forEach((serviceDescription: ServiceDescriptionItem)=>{
            if (serviceDescription.isThisService(serviceName)) {
                callback(serviceDescription);
            }
        });
    }
}