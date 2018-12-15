import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { GraphQLModule } from './graphql.module'
import { GithubService } from './services/github.service'
import { UsersListComponent } from './users-list/users-list.component'
import { UsersSearchbarComponent } from './users-searchbar/users-searchbar.component'

@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    UsersSearchbarComponent
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    FormsModule,
  ],
  providers: [
    GithubService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
