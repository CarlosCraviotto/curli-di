import {IObserver} from "../Events/IObserver";
import {LazyDependency} from "./LazyDependency";
import {ActionListEnumType} from "../Lists/ActionListEnumType";
import {ServicesCreatingList} from "../Lists";

export class LazyDependencies implements IObserver {

    private lazyDependenciesList: Array<LazyDependency>;

    public constructor(private servicesCreatingList: ServicesCreatingList) {
        this.servicesCreatingList.attach(this);
        this.lazyDependenciesList = [];
    }

    public notify(eventName: string): void {
        const eventCut: Array<string> = this.cutEvent(eventName);

        if (eventCut[0] === ActionListEnumType.Remove){
            this.applyDoneDependency(eventCut[1]);
        }
    }

    public addDependencies(dependenciesToCheck: Array<string>, callback: any): void {
        dependenciesToCheck = this.cleanDependenciesToCheckList(dependenciesToCheck);
        this.lazyDependenciesList.push(new LazyDependency(dependenciesToCheck, callback));
    }

    private cleanDependenciesToCheckList(dependenciesToCheck: Array<string>): Array<string>{
        const cleanDependenciesAlreadyBenCreating: Array<string> = [];

        this.servicesCreatingList.getList().forEach((dependency: string) => {
            if (dependenciesToCheck.indexOf(dependency) !== -1){
                cleanDependenciesAlreadyBenCreating.push(dependency);
            }
        });

        return cleanDependenciesAlreadyBenCreating;
    }

    private cutEvent(eventName: string): Array<string> {
        return eventName.split(":");
    }

    private applyDoneDependency(dependency: string) {
        this.lazyDependenciesList.forEach((lazyDependency: LazyDependency, index: number) => {
            lazyDependency.dependencyHasBenBuilt(dependency);

            if (lazyDependency.applied()){
                delete this.lazyDependenciesList[index];
            }
        });
    }
}