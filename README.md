# Curli-DI
A Dependency Injection (DI) library in typescript without using decorators.


## Installation

Install by `npm`

```sh
npm install --save curli-di
```
#### Usage

```typescript
import {DependencyInjection, ExternalDependencies} from "curli-di";
import {Database} from "database";


class Foo {
  constructor(private database: Database) {}
}



// Register previous dependencies already instantiated
const externalDependencies = new ExternalDependencies();
externalDependencies.add("dataBaseUser", "root");
externalDependencies.add("dataBasePass", "");

const container = new DependencyInjection(externalDependencies);

//registering of dependencies with the classes
container.registerService("dataBase", ["dataBaseUser", "dataBasePass"], Database);
container.registerService("foo", ["dataBase"], Foo);

//creating the service
const foo = container.get("foo");

```

### Circular dependency:

To create a circular dependency one of the services will receive their dependencies with a different method than the constructor. 

```typescript
import {DependencyInjection} from "curli-di";



class Foo {
    constructor(private database: Database, private taa: Taa) {}
}


class Taa {
    private foo: Foo;

    public injectDependencies(foo: Foo) {
        this.foo = foo;
    }
}

const container = new DependencyInjection();

//registering of dependencies with the classes
container.registerService("foo", ["dataBase", "taa"], Foo);
container.registerService("taa", ["foo"], Taa, false, Taa.prototype.injectDependencies);

//creating the service
const foo = container.get("foo");

```

### Adding external dependencies:

Some time we need to work with properties, externals objects, or other kind of values and inject these into our services. To do it, we have two ways: 
 - Inject these using the ExternalDependencies object before we start the container:
 ```typescript
import {DependencyInjection, ExternalDependencies} from "curli-di";

const externalDependencies = new ExternalDependencies();
externalDependencies.add("dataBaseUser", "root");
externalDependencies.add("dataBasePass", "");

const container = new DependencyInjection(externalDependencies);

const dataBaseUser: string = container.get("dataBaseUser");
```
 - Use the registerServiceBuilded method in the container after we initialized it:
  ```typescript
import {DependencyInjection} from "curli-di";

const container = new DependencyInjection();
container.registerServiceBuilded("dataBaseUser", "root");

const dataBaseUser: string = container.get("dataBaseUser");

 ```