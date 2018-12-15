const { environment } = require('./src/environments/environment')

module.exports = {
  schema: {
    'https://api.github.com/graphql': {
      headers: {
        'User-Agent': 'usertron',
        'Authorization': `token ${environment.githubAccessToken}`,
      },
    },
  },
  documents: './src/app/**/*.ts',
  overwrite: true,
  require: ['ts-node/register'],
  generates: {
    './src/app/graphql-types.ts': {
      plugins: ['typescript-common', 'typescript-client'],
    },
  },
}
