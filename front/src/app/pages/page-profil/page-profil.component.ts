import {Component, OnInit} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {Friend, User, UserService} from '../../services/user.service';
import {NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {DemandesComponent} from '../../component/demandes/demandes.component';
import {AbstractControl, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Chip} from 'primeng/chip';
import {INTERESTS} from '../../constants/app.constants';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-page-profil',
  imports: [
    InputText,
    Button,
    NgIf,
    RouterLink,
    DemandesComponent,
    NgForOf,
    ReactiveFormsModule,
    Chip,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './page-profil.component.html',
  standalone: true,
  styleUrl: './page-profil.component.css'
})
export class PageProfilComponent implements OnInit{

  user! : User;
  isAdmin : boolean = false;
  demandes : Friend[] = [];
  interests : string[] = [];

  selectedInterest : string = ''
  selectedOptionInterest = INTERESTS;

  interestControl = new FormControl("");
  protected emailControl = new FormControl("");
  passwordControl = new FormControl("", [Validators.required, this.atSymbolValidator]);

  atSymbolValidator(control: AbstractControl) {
    const value = control.value;
    return value && value.includes('@') ? null : { missingAt: true };
  }

  constructor(private userService : UserService) {

    this.user = userService.getCurrentUser() || {
      username : "",
      password : "",
      email : "",
      role : ""
    }

    this.emailControl.setValue(this.user.email);
    this.passwordControl.setValue(this.user.password);

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
    });

    this.userService.getInterests(this.user.username).subscribe({
      next : (value) => {
        this.interests = value;
      }
    })
  }

  updateUser() {
    if (this.emailControl.value && this.passwordControl.value) {
      let newUser: User = {
        ...this.user,
        email: this.emailControl.value || "",
        password: this.passwordControl.value || ""
      };

      this.userService.updateUser(newUser).subscribe({
        next: () => {
          this.user = newUser;
          this.userService.setCurrentUser(newUser);
        }
      });
    }
  }

  addInterest() {

    if(this.selectedInterest != ""){
      this.interests.push(this.selectedInterest|| "");
      this.userService.addInterest({username : this.user.username, interest: this.selectedInterest || ""}).subscribe();
      this.interestControl.setValue("");

    }

  }

  deleteInterest(interest : string) {
    this.userService.removeInterest({username : this.user.username, interest : interest}).subscribe();
  }

}
