import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ApolloModule, Apollo } from 'apollo-angular'
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { environment } from '../environments/environment'

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphQLModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const http = httpLink.create({
      uri: 'https://api.github.com/graphql'
    })

    const auth = setContext(() => ({
      headers: {
        'Authorization': `token ${environment.githubAccessToken}`,
      }
    }))

    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData: {
        __schema: {
          types: [
            {
              kind: 'INTERFACE',
              name: 'SearchResultItem',
              possibleTypes: [
                {
                  name: 'Organization'
                },
                {
                  name: 'User'
                }
              ]
            }
          ]
        }
      }
    })

    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache({
        dataIdFromObject: obj => obj.id,
        addTypename: false,
        fragmentMatcher,
      }),
    })
  }
}
