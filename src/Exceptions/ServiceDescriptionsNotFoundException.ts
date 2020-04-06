export class ServiceDescriptionsNotFoundException extends Error{
    public constructor (message: string) {
        super('Service descriptions with name ''+message+'' not found.');
    }
};
