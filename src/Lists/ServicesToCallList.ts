
import {AbstractServiceStringList} from './AbstractServiceStringList';
import {DependencyInjection} from './../DependencyInjection';

export class ServicesToCallList extends AbstractServiceStringList {

    public constructor() {
        super();
    }

    public callAllServicesWithAutoInit(dependencyInjection: DependencyInjection) {
        for (let i = 0; i < this.list.length; i++) {
            dependencyInjection.get(this.list[i]);
        }
        this.restartList();
    }
}
