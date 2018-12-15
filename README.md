# Usertron

A small app for browsing through users on GitHub based on Angular, Material, and Apollo.

## Run instructions

(1) `$ npm install`

(2) Create a personal GitHub access token with `read:org` & `read:org` permissions as specified [here](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/).

(3) Add access token to the environment file: `$ vim src/environments/environment.js`.

(4) Generate GraphQL types: `$ npm run codegen`

(5) `$ npm start`

<p align="center"><img src="https://user-images.githubusercontent.com/7648874/50047350-38ff9080-00ee-11e9-853a-7efcd87bd150.png" alt="screenshot" width="256px"></p>
