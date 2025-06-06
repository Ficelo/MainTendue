import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {User, UserService} from '../../services/user.service';
import {NgIf} from '@angular/common';
import {Avatar} from 'primeng/avatar';

@Component({
  selector: 'app-header',
  imports: [
    Button,
    RouterLink,
    NgIf,
    Avatar
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  user! : User;

  constructor(protected userService : UserService) {
  }

  ngOnInit() {

    this.user = this.userService.getCurrentUser() || {
      username : "?",
      password : "",
      email : "",
      role : ""
    }

  }

}
