import {ThisIsNotAConstructorFunctionException} from "../Exceptions";

export class ServiceDescriptionItem {

    public constructor(
        private serviceName: string,
        private dependencies: Array<string>,
        private serviceFunc: object,
        private injectDependencies?: object
    ){
        this.checkIfItIsAConstructorFunction(serviceFunc);
    };

    public isThisService(serviceName: string): boolean {
        return (this.serviceName === serviceName)? true : false;
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
        return this.serviceName;
    }

    private checkIfItIsAConstructorFunction (ConstructorFunction: any) {
        if (!ConstructorFunction || !ConstructorFunction.prototype || !ConstructorFunction.prototype.constructor.name) {
            throw new ThisIsNotAConstructorFunctionException();
        }
    };
};