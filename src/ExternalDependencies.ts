
import {ServicesList} from "./Lists/ServicesList";
import {ExternalDependencyNameVO} from "./VOs";

export class ExternalDependencies {
    protected dependencies: ServicesList = new ServicesList();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public add <T>(name: string, service: T): void {
        this.dependencies.addExternalDependency(new ExternalDependencyNameVO(name), service);
    }

    public bulk <T>(externalDependencies: {[key: string]: T}): void {
        for (let key in externalDependencies) {
            this.add(key, externalDependencies[key]);
        }
    }

    public transferToList (servicesList: ServicesList): ServicesList{
        servicesList.combine(this.dependencies);
        return servicesList;
    }
}