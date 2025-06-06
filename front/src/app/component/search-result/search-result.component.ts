import {Component, Input, OnInit} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {Button} from 'primeng/button';
import {User, UserService} from '../../services/user.service';

@Component({
  selector: 'app-search-result',
  imports: [
    Avatar,
    Button
  ],
  templateUrl: './search-result.component.html',
  standalone: true,
  styleUrl: './search-result.component.css'
})
export class SearchResultComponent implements OnInit{

  @Input() user! : User;
  currentUser! : User;
  added : boolean = false;

  constructor(private userService : UserService) {

  }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser() || {
      username : "",
      password : "",
      email : "",
      role : ""
    }
  }

  addFriend() {
    this.userService.addFriend({username_init : this.currentUser.username, username_friend : this.user.username}).subscribe({
      next: () => {
        this.added = true;
      }
    });
  }
}
