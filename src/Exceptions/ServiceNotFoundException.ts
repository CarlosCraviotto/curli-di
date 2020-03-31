export class ServiceNotFoundException extends Error{
    public constructor (message: string = "") {
        super("Service with name '"+message+"' not found.");
    }
};