import {Component, OnInit} from '@angular/core';
import {User, UserService} from '../../services/user.service';
import {Avatar} from 'primeng/avatar';
import {Button} from 'primeng/button';
import {NgForOf} from '@angular/common';
import {AdminResultComponent} from '../../component/admin-result/admin-result.component';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-page-admin',
  imports: [
    Avatar,
    Button,
    NgForOf,
    AdminResultComponent,
    FloatLabel,
    InputText,
    ReactiveFormsModule
  ],
  templateUrl: './page-admin.component.html',
  standalone: true,
  styleUrl: './page-admin.component.css'
})
export class PageAdminComponent implements OnInit{

  users : User[] = [];
  searchControl = new FormControl("");

  constructor(private userService : UserService) {
  }

  ngOnInit() {

    this.userService.getAllUsers().subscribe({
      next : (value) => {
        this.users = value;
      }
    })

  }

  rechercher() {

  }

}
