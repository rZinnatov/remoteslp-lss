[![Build Status](https://travis-ci.org/rZinnatov/remoteml-lss.svg?branch=master)](https://travis-ci.org/rZinnatov/remoteml-lss)
[![codecov](https://codecov.io/gh/rZinnatov/remoteml-lss/branch/master/graph/badge.svg)](https://codecov.io/gh/rZinnatov/remoteml-lss)

# Overview
## Learning session service for RemoteSLP project

The service provides a client with a learning session

**Learning session** contains all the state and the results of ongoing and finished learnings


# How to run
## via Docker
```
$ docker run -p 7070:80 rzinnatov/remoteml-lss:latest
```
To ensure the service is up you can try to GET sessions of a not existing user. Empty array `[]` should be returned.
```
$ curl http://localhost:7070/api/v1/sessions/not-existing-user-id
[]
```
 
## via Node
1. Clone or download this repository
2. `$ mv example.settings.json settings.json`
3. Populate `settings.json` with real values *(see comments inside)*
4. `$ npm start`


# API

<details><summary>Error while any request</summary>
<p>

Status >=400

```js
{
    "error": "error message"
}
```

</p>
</details>

<details><summary>Get session</summary>
<p>

**Request**

`GET /session/<session-id>`

**Responses**

Status 200
```js
{
    "id": "string",
    "userId": "string",
    "state": Integer
}
```
Status 404
```js
{
    "error": "session with id '<session-id>' is not found"
}
```

</p>
</details>

<details><summary>Get all sessions of an user</summary>
<p>

**Request**

`GET /sessions/<user-id>`

**Responses**

Status 200
```js
[
    {
        "id": "string",
        "userId": "string",
        "state": Integer
    },{
        "id": "string",
        "userId": "string",
        "state": Integer
    },
...
]
```

</p>
</details>

<details><summary>Create session</summary>
<p>

**Request**

`POST /session`
```js
{
    "userId": "string"
}
```

**Responses**

Status 200
```js
{
    "id": "string",
    "userId": "string",
    "state": Integer
}
```

</p>
</details>

<details><summary>Update session</summary>
<p>

**Request**

`PUT /session`
```js
{
    "id": "string",
    "userId": "string",
    "state": Integer
}
```

**Responses**

Status 200
```js
{
    "modifiedCount": Integer
}
```

</p>
</details>

<details><summary>Delete session</summary>
<p>

**Request**

`DELETE /session/<session-id>`

**Responses**

Status 200
```js
{
    "deletedCount": Integer
}
```

</p>
</details>

<details><summary>Delete all sessions of an user</summary>
<p>

**Request**

`DELETE /sessions/<user-id>`

**Responses**

Status 200
```js
{
    "deletedCount": Integer
}
```

</p>
</details>

<details><summary>Delete all sessions</summary>
<p>

**Request**

`DELETE /sessions/`

**Responses**

Status 200
```js
{
    "deletedCount": Integer
}
```

</p>
</details>
