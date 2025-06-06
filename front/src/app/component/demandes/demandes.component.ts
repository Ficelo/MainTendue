import {Component, Input} from '@angular/core';
import {Friend, User, UserService} from '../../services/user.service';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-demandes',
  imports: [
    Button
  ],
  templateUrl: './demandes.component.html',
  standalone: true,
  styleUrl: './demandes.component.css'
})
export class DemandesComponent {

  @Input() friend! : Friend
  disabled : boolean = false;

  constructor(private userService : UserService) {
  }

  accept() {
    this.userService.approveFriend(this.friend.username_init, this.friend.username_friend).subscribe();
    this.disabled = true;
  }

  deny() {
    this.userService.removeFriend(this.friend.username_init, this.friend.username_friend).subscribe();
    this.disabled = true;
  }

}
