import { Component, EventEmitter, Output } from '@angular/core'
import { GithubService } from '../services/github.service'
import { UserFields } from '../graphql-types'

@Component({
  selector: 'app-users-explorer',
  templateUrl: './users-explorer.component.html',
  styleUrls: ['./users-explorer.component.scss'],
})
export class UsersExplorerComponent {
  query = '';
  hasNextPage = false;
  hasPreviousPage = false;
  totalUsers = 0;
  users: UserFields.Fragment[] = [];

  constructor(private github: GithubService) { }

  searchUsers() {
    this.github.searchUsers(this.query).subscribe((result) => {
      this.hasNextPage = result.hasNextPage
      this.hasPreviousPage = result.hasPreviousPage
      this.users = result.pageNodes
      this.totalUsers = result.totalNodes
    })
  }

  getNextUsersPage() {
    this.github.getNextUsersPage().subscribe((result) => {
      this.hasNextPage = result.hasNextPage
      this.hasPreviousPage = result.hasPreviousPage
      this.users = result.pageNodes
    })
  }

  getPrevUsersPage() {
    this.github.getPrevUsersPage().subscribe((result) => {
      this.hasNextPage = result.hasNextPage
      this.hasPreviousPage = result.hasPreviousPage
      this.users = result.pageNodes
    })
  }
}
