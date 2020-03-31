
import {ServicesList} from "./Lists/ServicesList";

export class ExternalDependencies {
    protected dependencies: ServicesList = new ServicesList();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public add (name: string, service: any): void {
        this.dependencies.add(name, service);
    }

    public transferToList (servicesList: ServicesList): ServicesList{
        servicesList.combine(this.dependencies);
        return servicesList;
    }
}