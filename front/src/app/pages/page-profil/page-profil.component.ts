import {Component, OnInit} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {Friend, User, UserService} from '../../services/user.service';
import {NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {DemandesComponent} from '../../component/demandes/demandes.component';

@Component({
  selector: 'app-page-profil',
  imports: [
    InputText,
    Button,
    NgIf,
    RouterLink,
    DemandesComponent,
    NgForOf
  ],
  templateUrl: './page-profil.component.html',
  standalone: true,
  styleUrl: './page-profil.component.css'
})
export class PageProfilComponent implements OnInit{

  user! : User;
  isAdmin : boolean = false;
  demandes : Friend[] = [];

  constructor(private userService : UserService) {

    this.user = userService.getCurrentUser() || {
      username : "",
      password : "",
      email : "",
      role : ""
    }

    if(this.user.role == "admin"){
      this.isAdmin = true;
    }

  }

  ngOnInit() {
    this.userService.getFriends(this.user.username).subscribe({
      next: (value) => {
        this.demandes = []
        for(let friend  of value) {
          if(!friend.active && friend.username_init != this.user.username){
            this.demandes.push(friend);
          }
        }
      }
    })
  }

}
