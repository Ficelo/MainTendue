import { Component } from '@angular/core';
import {AbstractControl, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {FloatLabel} from 'primeng/floatlabel';
import {NgIf} from '@angular/common';
import {Button} from 'primeng/button';
import {Condition, User, UserService} from '../../services/user.service';
import {RadioButton} from 'primeng/radiobutton';
import {CascadeSelect} from 'primeng/cascadeselect';
import {DropdownModule} from 'primeng/dropdown';

@Component({
  selector: 'app-page-login',
  imports: [
    ReactiveFormsModule,
    InputText,
    FloatLabel,
    NgIf,
    Button,
    RadioButton,
    CascadeSelect,
    FormsModule,
    DropdownModule
  ],
  templateUrl: './page-login.component.html',
  standalone: true,
  styleUrl: './page-login.component.css'
})
export class PageLoginComponent {

  login: boolean = true;
  user : User;
  selectedRole: string = 'Aidant';

  selectedSituation: string = '';
  selectOptions = [
    { label: 'Vieux', value: 'vieux' },
    { label: 'Dépressif', value: 'depressif' },
    { label: 'Schizophrène', value: 'schizo' },
    { label: 'Maladie en phase terminale', value: 'terminal' },
    { label: 'Isolé', value: 'isole' },
    { label: 'Handicap moteur', value: 'moteur' },
    { label: 'Handicap Mental', value: 'mental' },
  ];

  usernameLoginControl = new FormControl("");
  passwordLoginControl = new FormControl("");

  usernameControl = new FormControl("");
  passwordControl = new FormControl("");
  protected emailControl = new FormControl("", [Validators.required, this.atSymbolValidator]);

  atSymbolValidator(control: AbstractControl) {
    const value = control.value;
    return value && value.includes('@') ? null : { missingAt: true };
  }

  constructor(private userService : UserService) {

    this.user = {
      username : "",
      password : "",
      email : "",
      role : ""
    }

  }




  connectUser(username : string = "", password : string = "") {

    if(username == "" && password == ""){
      this.userService.login(this.usernameLoginControl.value || "", this.passwordLoginControl.value || "").subscribe();
    }

    this.userService.login(username, password).subscribe();

  }

  changeLogin() {
    this.login = !this.login;
  }

  createUser() {

    this.user.password = this.passwordControl.value || "";
    this.user.username = this.usernameControl.value || "";
    this.user.email = this.emailControl.value || "";

    this.user.role = this.selectedRole;

    this.userService.createUser(this.user).subscribe({
      next : (val) => {
        console.log(val);

        let condition : Condition = {username : this.user.username, condition : this.selectedSituation}
        this.userService.addCondition(condition).subscribe();

        this.connectUser(this.user.username, this.user.password);
      }
    })

  }

  getFormCompletedLogIn() {
    return !!(this.usernameLoginControl.value && this.passwordLoginControl.value);
  }

  getFormCompletedSignIn() {
    return !!(this.usernameControl.value && this.emailControl.value && this.passwordControl.value);
  }

}
