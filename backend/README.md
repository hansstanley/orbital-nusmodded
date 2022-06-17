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

Backend API repository for NUSModded.

Deployed to <https://nusmodded.herokuapp.com/>

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

<details><summary>Authentication</summary>

Steps to authenticate with the backend server:

1. Register/sign in with Supabase Auth.

```javascript
const { user, session, error } = await supabase.auth.signIn({
  email: 'example@email.com',
  password: 'example-password',
});
```

2. Generate an `authToken` with `randomBytes(16).toString('hex')` (`randomBytes` is from the built in `crypto` package).

```javascript
import { randomBytes } from 'crypto';
const authToken = randomBytes(16).toString('hex');
```

3. Save `authToken` into the user's profile on Supabase (under table `profiles`).

```javascript
const user = supabase.auth.user();
const { data, error } = await supabase
  .from('profiles')
  .update({ auth_token: authToken })
  .match({ id: user.id });
```

1. Generate a hash with `bcrypt` on the `authToken` with 8 salt rounds.

```javascript
import { hashSync } from 'bcrypt';
const hash = hashSync(authToken, 8);
```

5. POST the hash to `{domain}/auth/login` (refer to route description below).

```javascript
// e.g. with Axios; adjust accordingly with your preferred HTTP client

import axios from 'axios';
// ...
const { status, data } = await axios.post(`${domain}/auth/login`, {
  username: user.username,
  password: hash,
});
const { accessToken } = data;
```

6. The request will return an `accessToken`, which are to be included in the headers as `Authorization: Bearer {accessToken}` for subsequent API calls.

```javascript
const { status, data } = await axios.get(`${domain}/user/profile`, {
  headers: { Authorization: `Bearer ${accessToken}` },
});
```

**Note:** API routes that do not require authentication are flagged as "PUBLIC", e.g.

> PUBLIC

---

#### Login

> :white_check_mark: Implemented

Authenticates the backend session.

```
POST /auth/login
```

```typescript
type body = {
  username: string;
  password: string; // Hash of authToken
};
```

Response `200 OK`:

```typescript
type body = { accessToken: string };
```

</details>

<details><summary>Users</summary>

#### Check if username is available

> :white_check_mark: Implemented

```
GET /user/check-username?username={username}
```

```typescript
type username = string;
```

Response `200 OK`:

```typescript
type body = {
  isAvailable: boolean;
};
```

#### Get user profile

> :white_check_mark: Implemented

```
GET /user/profile
```

Response `200 OK`: `Profile`

#### Edit user profile

> :white_check_mark: Implemented

```
POST /user/profile/edit
```

```typescript
type body = {
  username: string;
  avatarUrl: string; // URL
};
```

Response `200 OK`: `Profile`

</details>

<details><summary>User settings</summary>

#### Get all user settings

> :white_check_mark: Implemented

```
GET /user-settings
```

Response `200 OK`:

```typescript
type body = {
  IS_HONORS: boolean;
  MC_LIMIT: number;
  COURSE_ID: string; // UUID V4
};
```

#### Set a user setting

> :white_check_mark: Implemented

```
POST /user-settings/edit
```

```typescript
type body = {
  key: UserSettingsKey;
  value: any; // Depends on key
};
```

Response `200 OK`: `UserSettings`

</details>

<details><summary>Roadmap</summary>

#### Validate roadmap

> :x: Not implemented

Checks the roadmap for potential errors.

```
POST /roadmap/validate
```

```typescript
type body = Roadmap; // Refer to schema below
```

Response `200 OK`: `RoadmapError[]`

</details>

<details><summary>Courses</summary>

#### Get all courses

> :white_check_mark: Implemented

Returns an array of courses.

```
GET /course
```

Response `200 OK`: `Course[]`

#### Add course

> :white_check_mark: Implemented

```
POST /course/new
```

```typescript
type body = {
  title: string; // Title of the course
  department: string; // E.g. faculty, school, college
  description: string;
};
```

Response `201 CREATED`: `Course`

#### Edit course

> :white_check_mark: Implemented

```
POST /course/{courseId}/edit
```

```typescript
type courseId = string; // UUID V4

type body = {
  title?: string; // Title of the course
  department?: string; // E.g. faculty, school, college
  description?: string;
};
```

Response `200 OK`: `Course`

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

Response `200 OK`: `Course`

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

Response `200 OK`: `ModGroup[]`

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

<details><summary>Module groups</summary>

#### Get all module groups

> :white_check_mark: Not Implemented

```
GET /module-group
```

Response `200 OK`: `ModGroup[]`

#### Add module group

> :white_check_mark: Not Implemented

```
POST /module-group/new
```

```typescript
type body = {
  name: string; // Name of module group
  description: string;
  minimum?: number; // Minimum number of modules a student needs to take in this module group
  maximum?: number; // Maximum number of modules a student can take in this module group
};
```

Response `201 CREATED`: `ModGroup`

#### Edit module group

> :white_check_mark: Not Implemented

```
POST /module-group/{groupId}/edit
```

```typescript
type groupId = string; // UUID V4

type body = {
  name?: string;
  description?: string;
  minimum?: number;
  maximum?: number;
};
```

Response `200 OK`: `ModGroup`

#### Delete module group

> :white_check_mark: Not Implemented

```
DELETE /module-group/{groupId}
```

```typescript
type groupId = string; // UUID V4
```

Response `200 OK`: `ModGroup`

#### Get module group info

> :white_check_mark: Not Implemented

```
GET /module-group/{groupId}
```

```typescript
type groupId = string; // UUID V4
```

Response `200 OK`: `ModGroup`

#### Get modules belonging to a module group

> :white_check_mark: Not Implemented

```
GET /module-group/{groupId}/modules
```

```typescript
type groupId = string; // UUID V4
```

Response `200 OK`: `Mod[]`

#### Add modules to module group

> :white_check_mark: Not Implemented

```
POST /module-group/{groupId}/add-modules
```

```typescript
type groupId = string; // UUID V4

type body = {
  moduleCodes: string[]; // Module codes to add
};
```

Response `200 OK`:

```typescript
type body = {
  bound: string[]; // Array of module codes added
};
```

#### Remove modules from module group

> :white_check_mark: Not Implemented

```
POST /module-group/{groupId}/remove-modules
```

```typescript
type groupId = string; // UUID V4

type body = {
  moduleCodes: string[]; // Modules codes to remove
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

#### Get all modules

> PUBLIC
> :white_check_mark: Implemented

```
GET /module
```

Response `200 OK`: `Mod[]`

#### Get module information

> PUBLIC
> :white_check_mark: Implemented

```
GET /module/{moduleCode}
```

```typescript
type moduleCode = string;
```

Response `200 OK`: [Module schema from NUSMods](https://api.nusmods.com/v2/#/Modules/get__acadYear__modules__moduleCode__json)

</details>

## Schemas

### Course

```typescript
type Course = {
  id: string; // UUID V4
  title: string;
  department: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
```

### Mod (module)

```typescript
type Mod = {
  moduleCode: string;
  title: string;
};
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

### Roadmap

```typescript
type Roadmap = {
  years: Year[];
};
```

### RoadmapError (roadmap issues)

```typescript
type RoadmapError = {
  mods?: Mod[]; // Affected modules
  modGroups?: ModGroup[]; // Affected module groups
  message: string; // Message to describe the issue
};
```

### Year

```typescript
type Year = {
  id: number;
  semesters: Semester[];
};
```

### Semester

```typescript
type Semester = {
  id: 1 | 2 | 3 | 4;
  mods: Mod[];
};
```

### Profile

```typescript
type Profile = {
  id: string; // UUID V4
  username: string;
  avatarUrl: string; // URL
};
```

### UserSettings (user settings)

```typescript
type UserSettings = {
  key: UserSettingsKey;
  value: any; // Depends on key
  profileId: string; // UUIDV V4
};

type UserSettingsKey = 'COURSE_ID' | 'IS_HONORS' | 'MC_LIMIT';
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
