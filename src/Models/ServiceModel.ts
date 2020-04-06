export class ServiceModel {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public constructor (protected name: string, protected service: any) {
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getService (): any {
        return this.service;
    }

    public getName (): string {
        return this.name;
    }

    public isThisService (name: string): boolean {
        return (this.name === name) ? true : false;
    }

}
