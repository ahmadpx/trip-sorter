# Trip Sorter

## Available Scripts

In the project directory, you can run:

```
# run app in development
$ npm run dev

# run unit tests
$ npm run test

# build the app for production
$ npm run build

# eject create react app config files
$ npm run eject
```

## Terminology

There are some some terminology need to be known:

#### Leg

leg is a model for a single trip between two cities for ex: `London => Paris`

#### Route

route is an array of legs to complete a continues path from `origin` to `destination`

#### Trip

trip is a model for a continues path from `origin` to `destination` contain data related to the full path for ex: `London => Amsterdam => Warsaw`

## Project Structure

```
/public
/src
    /components
    /icons
    /db             => just to contain the response
    /models         => modlels for the response
    /utils          => utility functions to handle the business logic
    App.js
    constants.js
    index.js
```
