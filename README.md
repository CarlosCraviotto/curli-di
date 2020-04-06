# Curli-DI

[![Build Status](https://travis-ci.org/CarlosCraviotto/curli-di.svg?branch=master)](https://travis-ci.com/github/CarlosCraviotto/curli-di)
[![Coverage Status](https://coveralls.io/repos/github/CarlosCraviotto/curli-di/badge.svg?branch=master&cach=ff)](https://coveralls.io/github/CarlosCraviotto/curli-di?branch=master)

A Dependency Injection (DI) library in typescript without using decorators.


## Installation

Install by `npm`

```sh
npm install --save curli-di
```
#### Basic Usage

```typescript
import {DependencyInjection} from "curli-di";
import {Database} from "database";

class Foo {
  constructor(private database: Database) {}
}

const container = new DependencyInjection();

//register the dependencies for the class
container.registerService("dataBase", [], Database);
container.registerService("foo", ["dataBase"], Foo);

//creating the service
const foo = container.get("foo");

```

### Registering external dependencies/properties:

Some time we need to inject properties or other kind of values into our services, for this we use the class ExternalDependencies like here: 

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

//register the dependencies for the class
container.registerService("dataBase", ["@dataBaseUser", "@dataBasePass"], Database);
container.registerService("foo", ["dataBase"], Foo);

//creating the service
const foo = container.get("foo");

```

As this example shows, to access to any external dependency or property we need to add the prefix @.

Also to inject or use a external dependency we can use the registerServiceBuilded method in the container after we initialized it:
  ```typescript
import {DependencyInjection} from "curli-di";

const container = new DependencyInjection();
container.registerServiceBuilded("dataBaseUser", "root");

const dataBaseUser: string = container.get("@dataBaseUser");

 ```

### Registering external dependencies/properties with an object in bulk mode:

```typescript
import {DependencyInjection, ExternalDependencies} from "curli-di";
import {Database} from "database";
import {Oauth} from "oauth";
import {Lang} from "lang";

class Foo {
  constructor(private database: Database) {}
}

// Register previous dependencies already instantiated
const externalDependencies = new ExternalDependencies();
externalDependencies.bulk({
    "dataBaseUser": "root",
    "dataBasePass": "",
    "useOauth": false,
    "languagesSupported": ['en-GB','es-MX', 'zh-HK']
});

const container = new DependencyInjection(externalDependencies);

//register the dependencies for the class
container.registerService("dataBase", ["@dataBaseUser", "@dataBasePass"], Database);
container.registerService("foo", ["dataBase"], Foo);
container.registerService("lang", ["@languagesSupported"], Lang);
container.registerService("oauth", [], Oauth);

if (container.get("@useOauth")) {
    container.get("oauth").start();
}

//creating the service
const foo = container.get("foo");

```

### Circular dependency:

To create a circular dependency between two services, one of the then will receive their dependencies with a different method than the constructor. 

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

### Registering services descriptions in different sides of the application:

If we want to split the responsibility of register services in different sides of the application we can perform it using the ExternalServicesRegister class:

```typescript
import {DependencyInjection, ExternalServicesRegister} from "curli-di";
import {Database} from "database";

class Foo {
  constructor(private database: Database) {}
}

// Register previous dependencies already instantiated
const container = new DependencyInjection(),
      externalServicesRegister = new ExternalServicesRegister();


//register the dependencies for the class
externalServicesRegister.registerService("dataBase", ["@dataBaseUser", "@dataBasePass"], Database);
externalServicesRegister.registerService("foo", ["dataBase"], Foo);

container.registerExternalServiceRegister(externalServicesRegister);

//creating the service
const foo = container.get("foo");

```


### Instantiate one or more services in a specific moment (like when we start the app) using autoInit option:

```typescript
import {DependencyInjection} from "curli-di";
import {Database} from "database";
import {Oauth} from "oauth";
import {Lang} from "lang";
import {Foo} from "foo";

const container = new DependencyInjection();

//register the dependencies for the class
container.registerService("dataBase", [], Database, true);
container.registerService("foo", [], Foo);
container.registerService("lang", [], Lang);
container.registerService("oauth", [], Oauth, true);


//start dataBase service and oauth
container.callAllServicesWithAutoInit();

```