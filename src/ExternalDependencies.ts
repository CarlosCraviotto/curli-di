
import {ServicesCollection} from './Collections';
import {ExternalDependencyNameVO} from './VOs';

export class ExternalDependencies {

    protected dependencies: ServicesCollection = new ServicesCollection();

    public add <T> (name: string, service: T): void {
        this.dependencies.addExternalDependency(new ExternalDependencyNameVO(name), service);
    }

    public bulk <T> (externalDependencies: {[key: string]: T}): void {
        for (const key in externalDependencies) {
            this.add(key, externalDependencies[key]);
        }
    }

    public transferToCollection (servicesCollection: ServicesCollection): ServicesCollection {
        servicesCollection.combine(this.dependencies);
        return servicesCollection;
    }

}
