export class LazyDependency {

    private appliedCallback = false;

    public constructor (private dependenciesToCheck: Array<string>, private callback: any) {
    }

    public dependencyHasBenBuilt (dependency: string): void {
        const index = this.dependenciesToCheck.indexOf(dependency);

        if (index !== -1) {
            // delete the dependency
            this.dependenciesToCheck.splice(index, 1);
            if (this.dependenciesToCheck.length <= 0) {
                this.applyCallback();
            }
        }
    }

    public applied (): boolean {
        return this.appliedCallback;
    }

    private applyCallback (): void {
        this.callback();
        this.appliedCallback = true;
    }

}
