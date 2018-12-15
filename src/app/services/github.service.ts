import { Injectable } from '@angular/core'
import { Apollo } from 'apollo-angular'
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { SearchUsers } from '../graphql-types'

// Note that this can't be used directly in the document because codegen
// can't process string interpolations
const NODES_PER_PAGE = 10

const SEARCH_USERS = gql `
  query SearchUsers($query: String!, $after: String, $before: String) {
    search(
      query: $query,
      type: USER,
      first: 10,
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
    avatarUrl
    email
    location
    name
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
  currNodes: SearchUsers.Nodes[] = [];

  constructor(private apollo: Apollo) {}

  searchUsers(query) {
    return this.apollo.query<SearchUsers.Query, SearchUsers.Variables>({
      query: SEARCH_USERS,
      variables: { query }
    })
    .pipe(map((res) => {
      const { search } = res.data
      const { pageInfo } = search

      this.totalPages = Math.min(Math.ceil(search.userCount / NODES_PER_PAGE), 100)
      this.startCursor = pageInfo.startCursor
      this.endCursor = pageInfo.endCursor
      this.hasNextPage = pageInfo.hasNextPage
      this.hasPreviousPage = pageInfo.hasPreviousPage
      this.currNodes = search.nodes
      this.query = query
      this.currPage = 1

      return {
        hasNextPage: this.hasNextPage,
        hasPreviousPage: this.hasPreviousPage,
        totalPages: this.totalPages,
        currPage: this.currPage,
        nodes: this.currNodes
      }
    }))
  }

  getNextUsersPage() {
    if (this.currPage + 1 === this.totalPages) {
      return Observable.create(o => o.next({
        hasNextPage: this.hasNextPage,
        hasPreviousPage: this.hasPreviousPage,
        totalPages: this.totalPages,
        currPage: this.currPage,
        nodes: this.currNodes,
      }))
    }

    return this.apollo.query<SearchUsers.Query, SearchUsers.Variables>({
      query: SEARCH_USERS,
      variables: { query: this.query, after: this.startCursor }
    })
    .pipe(map((res) => {
      const { search } = res.data
      const { pageInfo } = search

      this.startCursor = pageInfo.startCursor
      this.endCursor = pageInfo.endCursor
      this.hasNextPage = pageInfo.hasNextPage
      this.hasPreviousPage = pageInfo.hasPreviousPage
      this.currNodes = search.nodes
      this.currPage++

      return {
        hasNextPage: this.hasNextPage,
        hasPreviousPage: this.hasPreviousPage,
        totalPages: this.totalPages,
        currPage: this.currPage,
        nodes: search.nodes,
      }
    }))
  }

  getPrevUsersPage() {
    if (this.currPage - 1 === 0) {
      return Observable.create(o => o.next({
        hasNextPage: this.hasNextPage,
        hasPreviousPage: this.hasPreviousPage,
        totalPages: this.totalPages,
        currPage: this.currPage,
        nodes: this.currNodes,
      }))
    }

    return this.apollo.query<SearchUsers.Query, SearchUsers.Variables>({
      query: SEARCH_USERS,
      variables: { query: this.query, before: this.endCursor }
    })
    .pipe(map((res) => {
      const { search } = res.data
      const { pageInfo } = search

      this.startCursor = pageInfo.startCursor
      this.endCursor = pageInfo.endCursor
      this.hasNextPage = pageInfo.hasNextPage
      this.hasPreviousPage = pageInfo.hasPreviousPage
      this.currNodes = search.nodes
      this.currPage--

      return {
        hasNextPage: this.hasNextPage,
        hasPreviousPage: this.hasPreviousPage,
        totalPages: this.totalPages,
        currPage: this.currPage,
        nodes: this.currNodes,
      }
    }))
  }
}
