import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ApolloModule, Apollo } from 'apollo-angular'
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
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

    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache(),
    })
  }
}
