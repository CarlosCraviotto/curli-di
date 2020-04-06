import {ThisIsNotAConstructorFunctionException} from '../Exceptions';
import {ServiceNameDescriptionVO} from '../VOs';

export class ServiceDescriptionModel {

    public constructor (
        private serviceName: ServiceNameDescriptionVO,
        private dependencies: Array<string>,
        private serviceFunc: object,
        private injectDependencies?: object
    ) {
        this.checkIfItIsAConstructorFunction(serviceFunc);
    }

    public isThisService (serviceName: ServiceNameDescriptionVO): boolean {
        return (this.serviceName.getValue() === serviceName.getValue()) ? true : false;
    }

    public getDependencies (): Array<string> {
        return this.dependencies;
    }

    public setDependencies (dependencies: Array<string>): void {
        this.dependencies = dependencies;
    }

    public getServiceFunc (): object {
        return this.serviceFunc;
    }

    public getInjectDependencies (): object|undefined {
        return this.injectDependencies;
    }

    public getServiceName (): string {
        return this.serviceName.getValue();
    }

    private checkIfItIsAConstructorFunction (ConstructorFunction: any): any|never {
        if (
            !ConstructorFunction ||
            !ConstructorFunction.prototype ||
            !ConstructorFunction.prototype.constructor.name
        ) {
            throw new ThisIsNotAConstructorFunctionException();
        }
    }

}
