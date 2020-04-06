
import {AbstractServiceStringCollection} from './AbstractServiceStringCollection';
import {DependencyInjection} from '../DependencyInjection';

export class ServicesToCallCollection extends AbstractServiceStringCollection {

    public constructor () {
        super();
    }

    public callAllServicesWithAutoInit (dependencyInjection: DependencyInjection): void {
        for (let i = 0; i < this.collection.length; i++) {
            dependencyInjection.get(this.collection[i]);
        }
        this.restartCollection();
    }

}
