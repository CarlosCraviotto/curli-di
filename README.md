# Curli-DI


[![Build Status](https://travis-ci.org/CarlosCraviotto/curli-di.svg?branch=master)](https://travis-ci.com/github/CarlosCraviotto/curli-di)
[![Coverage Status](https://coveralls.io/repos/github/CarlosCraviotto/curli-di/badge.svg?branch=master&cach=ff)](https://coveralls.io/github/CarlosCraviotto/curli-di?branch=master)
[![npm version](https://badge.fury.io/js/curli-di.svg)](https://badge.fury.io/js/curli-di)
[![Dependency Status](https://david-dm.org/CarlosCraviotto/curli-di.png)](https://david-dm.org/CarlosCraviotto/curli-di)


A Dependency Injection (DI) library in typescript without using decorators.


Dependency injection is a software design pattern that implements inversion of control for resolving dependencies. A dependency is an object that can be used (a service). An injection is the passing of a dependency to a dependent object (a client) that would use it. For more information about this pattern look at: [Dependency injection](http://en.wikipedia.org/wiki/Dependency_injection) and [Inversion of control](http://en.wikipedia.org/wiki/Inversion_of_control).

### Motivation
There are a lot of dependency injection libraries for JavaScript/Typescript out there, this is not new.  The one thing we're trying to achieve here is the ability to take advantage of such a library but without coupling it into the application's domain. The main goal here is to create a library that you can use without using third part code into your domains.

### Installation

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

Sometimes we need to inject properties or other kind of values into our services, in this case we use the class ExternalDependencies as is shown here: 

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

Also to inject or use an external dependency we can use the registerServiceBuilded method in the container after we initialized it:

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

### Commands

 - `npm run build`: Build the project (dependency injection).
 - `npm run build:clean`: Delete first the dist folder and build it.
 - `npm run clean`: Delete the dist folder.
 - `npm run test`: Execute the tests.
 - `npm run test:coverage`:  Execute the tests and calculate the coverage.
 - `npm run lint`: Check the code using the rules in .eslintre.js
 - `npm run lint:fix`: Check the code and try to fix it.



### Changelog

All notable changes to this project will be documented in this section.

### 1.0.1 - 2020-04-07

#### Changed

- Remove not catching exceptions.
- Remove unused dev dependencies.

### 1.0.0 - 2020-04-06

#### Added

- Support for external dependencies declaration
- Now the properties and the external services are called with @

#### Changed

- Remove unused dependency.
- Fixed circular dependencies



### Contributing

When submitting your pull-request try to follow those guides:

- https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github
- https://medium.com/@vadimdemedes/making-your-first-contribution-de6576ddb190



### License

MIT