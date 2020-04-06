
export class StringVO {

    protected readonly _value: string;

    public constructor(value: string) {
        this._value = this.format(value);
    }

    public getValue(): string {
        return this._value;
    }

    protected format(value: string): string {
        value = value.trim();
        this.validate(value);
        return value;
    }

    protected validate(value: string): void {
        if (value === '') {
            this.throwEmptyValueException();
        }
    }

    protected throwEmptyValueException(): never {
        throw new Error('Empty value');
    }

}
