
import {StringVO} from './StringVO';

export class ServiceNameVO extends StringVO {

    protected validate (value: string): void {
        super.validate(value);
        if (value[0] === '@') {
            throw new Error('This service name (' + value + ') is not a valid name');
        }
    }

    protected throwEmptyValueException (): never {
        throw new Error('Empty service name value.');
    }

}
