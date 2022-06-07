<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API

The backend that supports this API has not yet been deployed.

<details><summary>Courses</summary>

#### Get all courses

> :white_check_mark: Implemented

Returns an array of courses.

```
GET /course
```

Response `200 OK`: `Course[]`.

#### Add course

> :white_check_mark: Implemented

```
POST /course/new
```

```typescript
type body = {
  name: string; // Name of the course
  department: string; // E.g. faculty, school, college
  description: string;
};
```

Response `201 CREATED`: `Course`.

#### Get course info

> :white_check_mark: Implemented

```
GET /course/{courseId}
```

```typescript
type courseId = string; // UUID V4
```

Response `200 OK`: `Course`.

#### Delete course

> :white_check_mark: Implemented

```
DELETE /course/{courseId}
```

```typescript
type courseId = string; // UUID V4
```

Response `200 OK`: `Course`.

#### Get course modules

> :white_check_mark: Implemented

Returns an array of modules associated to the course.

```
GET /course/{courseId}/modules
```

```typescript
type courseId = string; // UUID V4
```

Repsonse `200 OK`: `Mod[]`.

#### Get course module groups

> :white_check_mark: Implemented

Returns an array of module groups associated to the course.

```
GET /course/{courseId}/module-groups
```

```typescript
type courseId = string; // UUID V4
```

Response `200 OK`: `ModGroup[]`.

#### Add modules to course

> :white_check_mark: Implemented

```
POST /course/{courseId}/add-modules
```

```typescript
type courseId = string; // UUID V4
type body = {
  type: string; // Type of module to the course
  moduleCodes: string[]; // Module codes to add
};
```

Response `200 OK`:

```typescript
type body = {
  bound: ModuleCode[];
};

type ModuleCode = string;
```

#### Remove modules from course

> :white_check_mark: Implemented

```
POST /course/{courseId}/remove-modules
```

```typescript
type courseId = string; // UUID V4
type body = {
  moduleCodes: string[]; // Module codes to remove
};
```

Response `200 OK`:

```typescript
type body = {
  count: number; // Number of modules removed
};
```

</details>

<details><summary>Modules</summary>

#### Get module information

> :white_check_mark: Implemented

```
GET /module/{moduleCode}
```

```typescript
type moduleCode = string;
```

Response `200 OK`: `Mod`.

</details>

## Schemas

### Course

```typescript
type Course = {
  id: string; // UUID V4
  name: string;
  department: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
```

### Mod (module)

```
{}
```

### ModGroup (module group)

```typescript
type ModGroup = {
  id: string; // UUID V4
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
