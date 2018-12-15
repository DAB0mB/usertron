import { Component, Input } from '@angular/core'
import { SearchUsers } from '../graphql-types'

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {
  @Input()
  users: SearchUsers.Nodes[] = [];
}
