import { Component } from '@angular/core'
import { GithubService } from '../services/github.service'

@Component({
  selector: 'app-users-searchbar',
  templateUrl: './users-searchbar.component.html',
  styleUrls: ['./users-searchbar.component.scss']
})
export class UsersSearchbarComponent {
  constructor(private github: GithubService) { }
}
