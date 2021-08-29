# Request form

## Description

Contains fron-end sources of feedback form for solidarity platform

## Specification

### General

| Property        |                     Value |
| --------------- | ------------------------: |
| Package manager |                       npm |
| Bundler         | Parcel (default settings) |
| CSS Style       |                   BEM mix |
| JS Style Guide  |                    Airbnb |
| CSS processors  |                         - |
| JS frameworks   |                         - |

### Dependecies

Doesn't have

## Installation and buidling

Intitialization:

```shell
git clone https://github.com/TomorroWind/request-from.git request-from
cd request-form
npm install
```

Run DEV:

```shell
npm run dev
```

Run build to get files for production:

```shell
npm run build
```

Copy contet of /request-form/dist folder to server

## Setup

Before building set up URL for API.
Go to /form-request/src/configs/config.js
Change apiBaseURL variable to a proper one.

## Next approvments

- Add validation to different contact type (email, vk, facebook)
- Store entered data after page refreshing
- Fix UI bug: two open drop downs same time
