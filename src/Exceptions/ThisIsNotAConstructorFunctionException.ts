

export class ThisIsNotAConstructorFunctionException extends Error{
    public constructor (message: string = '') {
        super('This is not a constructor function. ' + message);
    }
};
