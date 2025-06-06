import {Component, Input} from '@angular/core';
import {User, UserService} from '../../services/user.service';
import {Avatar} from 'primeng/avatar';
import {NgForOf} from '@angular/common';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-admin-result',
  imports: [
    Avatar,
    NgForOf,
    Button
  ],
  templateUrl: './admin-result.component.html',
  standalone: true,
  styleUrl: './admin-result.component.css'
})
export class AdminResultComponent {

  @Input() user! : User;
  disabled : boolean = false;

  constructor(private userService : UserService) {
  }

  suspendre() {
    //TODO : implémenter un système de ban temporaire
    this.bannir();
  }

  bannir() {

    // Ghetto de fou mais ça fera l'affaire
    let newUser = this.user;
    newUser.password = this.makePassword(50);

    this.userService.updateUser(newUser).subscribe();
    this.disabled = true;
  }

  makePassword(length : number) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
