import { Component, EventEmitter, Output } from '@angular/core'
import { GithubService } from '../services/github.service'
import { UserFields } from '../graphql-types'

@Component({
  selector: 'app-users-searchbar',
  templateUrl: './users-searchbar.component.html',
  styleUrls: ['./users-searchbar.component.scss']
})
export class UsersSearchbarComponent {
  query = '';
  hasNextPage = false;
  hasPreviousPage = false;
  users: UserFields.Fragment[] = [];

  constructor(private github: GithubService) { }

  searchUsers() {
    this.github.searchUsers(this.query).subscribe((result) => {
      this.hasNextPage = result.hasNextPage
      this.hasPreviousPage = result.hasPreviousPage
      this.users = result.nodes
    })
  }

  getNextUsersPage() {
    this.github.getNextUsersPage().subscribe((result) => {
      this.hasNextPage = result.hasNextPage
      this.hasPreviousPage = result.hasPreviousPage
      this.users = result.nodes
    })
  }

  getPrevUsersPage() {
    this.github.getPrevUsersPage().subscribe((result) => {
      this.hasNextPage = result.hasNextPage
      this.hasPreviousPage = result.hasPreviousPage
      this.users = result.nodes
    })
  }
}
