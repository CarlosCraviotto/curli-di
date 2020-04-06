
export class ThisIsNotAConstructorFunctionException extends Error {

    public constructor (message = '') {
        super('This is not a constructor function. ' + message);
    }

}
