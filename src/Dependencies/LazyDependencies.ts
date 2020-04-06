import {ObserverInterface} from '../Events';
import {LazyDependency} from './LazyDependency';
import {ActionCollectionEnumType} from '../Types';
import {ServicesCreatingCollection} from '../Collections';

export class LazyDependencies implements ObserverInterface {

    private lazyDependenciesCollection: Array<LazyDependency>;

    public constructor (private servicesCreatingCollection: ServicesCreatingCollection) {
        this.servicesCreatingCollection.attach(this);
        this.lazyDependenciesCollection = [];
    }

    public notify (eventName: string): void {
        const eventCut: Array<string> = this.cutEvent(eventName);

        if (eventCut[0] === ActionCollectionEnumType.Remove) {
            this.applyDoneDependency(eventCut[1]);
        }
    }

    public addDependencies (dependenciesToCheck: Array<string>, callback: any): void {
        dependenciesToCheck = this.cleanDependenciesToCheckCollection(dependenciesToCheck);
        this.lazyDependenciesCollection.push(new LazyDependency(dependenciesToCheck, callback));
    }

    private cleanDependenciesToCheckCollection (dependenciesToCheck: Array<string>): Array<string> {
        const cleanDependenciesAlreadyBenCreating: Array<string> = [];

        this.servicesCreatingCollection.getCollection().forEach((dependency: string) => {
            if (dependenciesToCheck.indexOf(dependency) !== -1) {
                cleanDependenciesAlreadyBenCreating.push(dependency);
            }
        });

        return cleanDependenciesAlreadyBenCreating;
    }

    private cutEvent (eventName: string): Array<string> {
        return eventName.split(':');
    }

    private applyDoneDependency (dependency: string): void {
        this.lazyDependenciesCollection.forEach((lazyDependency: LazyDependency, index: number) => {
            lazyDependency.dependencyHasBenBuilt(dependency);

            if (lazyDependency.applied()) {
                delete this.lazyDependenciesCollection[index];
            }
        });
    }

}
