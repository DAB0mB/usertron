import { Injectable } from '@angular/core'
import { Apollo } from 'apollo-angular'
import gql from 'graphql-tag'

const NODES_PER_PAGE = 10

const SEARCH_USERS = gql `
  query SearchUsers($query: String!, $after: String, $before: String) {
    search(
      query: $query,
      type: USER,
      first: ${NODES_PER_PAGE},
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
        id
        avatarUrl
        email
        location
        name
      }
    }
  }
`

@Injectable()
export class GithubService {
  private totalPages = 0;
  private currPage = 0;
  private startCursor = '';
  private endCursor = '';
  private query = '';
  private currNodes = [];

  constructor(private apollo: Apollo) {}

  searchUsers(query) {
    return this.apollo.query({
      query: SEARCH_USERS,
      variables: { query }
    })
    .subscribe((res) => {
      const { search } = res.data

      this.totalPages = Math.min(Math.ceil(search.userCount / NODES_PER_PAGE), 100)
      this.startCursor = search.startCursor
      this.endCursor = search.endCursor
      this.currNodes = search.nodes
      this.query = query
      this.currPage = 0

      return {
        totalPages: this.totalPages,
        currPage: this.currPage,
        nodes: this.currNodes,
      }
    })
  }

  getNextUsersPage() {
    if (this.currPage + 1 === this.totalPages) {
      return {
        totalPages: this.totalPages,
        currPage: this.currPage,
        nodes: this.currNodes,
      }
    }

    return this.apollo.query({
      query: SEARCH_USERS,
      variables: { query: this.query, after: this.startCursor }
    })
    .subscribe((res) => {
      const { search } = res.data

      this.startCursor = search.startCursor
      this.endCursor = search.endCursor
      this.currNodes = search.nodes
      this.currPage++

      return {
        totalPages: this.totalPages,
        currPage: this.currPage,
        nodes: search.nodes,
      }
    })
  }

  getPrevUsersPage() {
    if (this.currPage - 1 < 0) {
      return {
        totalPages: this.totalPages,
        currPage: this.currPage,
        nodes: this.currNodes,
      }
    }

    return this.apollo.query({
      query: SEARCH_USERS,
      variables: { query: this.query, before: this.endCursor }
    })
    .subscribe((res) => {
      const { search } = res.data

      this.startCursor = search.startCursor
      this.endCursor = search.endCursor
      this.currNodes = search.nodes
      this.currPage--

      return {
        totalPages: this.totalPages,
        currPage: this.currPage,
        nodes: this.currNodes,
      }
    })
  }
}
