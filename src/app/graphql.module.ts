import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ApolloModule, Apollo } from 'apollo-angular'
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'

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
        'Authorization': 'token 6552a4da088068989fec43ea6c8c91369969db16',
      }
    }))

    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache(),
    })
  }
}
