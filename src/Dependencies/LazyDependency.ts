export class LazyDependency {

    private appliedCallback: boolean = false;

    public constructor(private dependenciesToCheck: Array<string>, private callback: any) {
    }

    public dependencyHasBenBuilt(dependency: string): void {
        const index = this.dependenciesToCheck.indexOf(dependency);

        if (index !== -1) {
            //delete the dependency
            this.dependenciesToCheck.splice(index, 1);
            if (this.dependenciesToCheck.length <= 0) {
                this.applyCallback();
            }
        }
    }

    public applied() {
        return this.appliedCallback;
    }

    private applyCallback() {
        this.callback();
        this.appliedCallback = true;
    }
}