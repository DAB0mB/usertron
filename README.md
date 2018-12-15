# Usertron

A small website to browse through users on GitHub based on Angular, Material, and Apollo.

## Run directions

(1) `$ npm install`

(2) Create a personal GitHub access token with `user:read` permissions as specified [here](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/).

(3) Add access token to the environment file: `$ vim src/environments/environment.js`.

(4) Generate GraphQL types: `$ npm run codegen`

(5) `$ npm start`


<p align="center"><img src="https://user-images.githubusercontent.com/7648874/50046753-90e4ca00-00e3-11e9-91d6-4ae545fdf886.png" alt="screenshot" width="256px"></p>
