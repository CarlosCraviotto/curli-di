
export class LazyDependency {

    private appliedCallback: boolean = false;

    public constructor (private dependenciesToCheck: Array<string>, private callback: any){
    }

    public dependencyHasBenBuilt(dependency: string){
        const index = this.dependenciesToCheck.indexOf(dependency);

        if (index !== -1){
            //delete this.dependenciesToCheck[index];
            this.dependenciesToCheck.splice (index, 1);
            if (this.dependenciesToCheck.length <= 0){
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