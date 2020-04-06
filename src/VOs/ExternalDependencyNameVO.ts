import {ServiceNameVO} from "./ServiceNameVO";

export class ExternalDependencyNameVO extends ServiceNameVO {

    protected format(value: string): string {
        value = super.format(value);
        value = "@" + value;
        return value;
    }
}