export class ServiceNotFoundException extends Error {

    public constructor (message = '') {
        super('Service with name \'' + message + '\' not found.');
    }

}
