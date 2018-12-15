import { Injectable } from '@angular/core'
import { Apollo } from 'apollo-angular'
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { SearchUsers } from '../graphql-types'

const NODES_PER_PAGE = 10

const SEARCH_USERS = gql `
  query SearchUsers(
    $query: String!,
    $first: Int,
    $last: Int,
    $after: String,
    $before: String
  ) {
    search(
      type: USER,
      query: $query,
      first: $first,
      last: $last,
      after: $after,
      before: $before
    ) {
      userCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      nodes {
        ...userFields
      }
    }
  }

  fragment userFields on User {
    id
    bio
    name
    login
    avatarUrl
    email
    location
  }
`

@Injectable()
export class GithubService {
  totalPages = 0;
  currPage = 0;
  hasNextPage = false;
  hasPreviousPage = false;
  startCursor = '';
  endCursor = '';
  query = '';
  pageNodes: SearchUsers.Nodes[] = [];

  constructor(private apollo: Apollo) {}

  searchUsers(query) {
    return this.apollo.query<SearchUsers.Query, SearchUsers.Variables>({
      query: SEARCH_USERS,
      variables: { query, first: NODES_PER_PAGE }
    })
    .pipe(map((res) => {
      const { search } = res.data
      const { pageInfo } = search

      this.totalPages = Math.min(Math.ceil(search.userCount / NODES_PER_PAGE), 100)
      this.startCursor = pageInfo.startCursor
      this.endCursor = pageInfo.endCursor
      this.hasNextPage = pageInfo.hasNextPage
      this.hasPreviousPage = pageInfo.hasPreviousPage
      this.pageNodes = search.nodes
      this.query = query
      this.currPage = 1

      return this.pluckResult()
    }))
  }

  getNextUsersPage() {
    if (this.currPage + 1 === this.totalPages) {
      return Observable.create(o => o.next(this.pluckResult()))
    }

    return this.apollo.query<SearchUsers.Query, SearchUsers.Variables>({
      query: SEARCH_USERS,
      variables: { query: this.query, after: this.endCursor, first: NODES_PER_PAGE }
    })
    .pipe(map((res) => {
      const { search } = res.data
      const { pageInfo } = search

      this.startCursor = pageInfo.startCursor
      this.endCursor = pageInfo.endCursor
      this.hasNextPage = pageInfo.hasNextPage
      this.hasPreviousPage = pageInfo.hasPreviousPage
      this.pageNodes = search.nodes
      this.currPage++

      return this.pluckResult()
    }))
  }

  getPrevUsersPage() {
    if (this.currPage - 1 === 0) {
      return Observable.create(o => o.next(this.pluckResult()))
    }

    return this.apollo.query<SearchUsers.Query, SearchUsers.Variables>({
      query: SEARCH_USERS,
      variables: { query: this.query, before: this.startCursor, last: NODES_PER_PAGE }
    })
    .pipe(map((res) => {
      const { search } = res.data
      const { pageInfo } = search

      this.startCursor = pageInfo.startCursor
      this.endCursor = pageInfo.endCursor
      this.hasNextPage = pageInfo.hasNextPage
      this.hasPreviousPage = pageInfo.hasPreviousPage
      this.pageNodes = search.nodes
      this.currPage--

      return this.pluckResult()
    }))
  }

  pluckResult() {
    return {
      hasNextPage: this.hasNextPage,
      hasPreviousPage: this.hasPreviousPage,
      totalPages: this.totalPages,
      currPage: this.currPage,
      pageNodes: this.pageNodes,
    }
  }
}
