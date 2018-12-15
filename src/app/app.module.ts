import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule, MatListModule, MatInputModule } from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component'
import { GraphQLModule } from './graphql.module'
import { GithubService } from './services/github.service'
import { UsersListComponent } from './users-list/users-list.component'
import { UsersExplorerComponent } from './users-explorer/users-explorer.component'

@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    UsersExplorerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GraphQLModule,
    FormsModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
  ],
  providers: [
    GithubService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
