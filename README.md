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

const container = new DependencyInjection(Foo);

//registering of dependencies with the classes
container.registerService("dataBase", ["dataBaseUser", "dataBasePass"], Database);
container.registerService("foo", ["dataBase"], Foo);

//creating the service
const foo = container.get("foo");

```

### Circular dependency:

```typescript
import {DependencyInjection, ExternalDependencies} from "curli-di";



class Foo {
    constructor(private database: Database, private taa: Taa) {}
}


class Taa {
    private foo: Foo;

    public injectDependencies(foo: Foo) {
        this.foo = foo;
    }
}

const container = new DependencyInjection(Foo);

//registering of dependencies with the classes
container.registerService("foo", ["dataBase", "taa"], Foo);
container.registerService("taa", ["foo"], Taa, false, Taa.prototype.injectDependencies);

//creating the service
const foo = container.get("foo");

```