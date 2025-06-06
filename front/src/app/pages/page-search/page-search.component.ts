import {Component, OnInit} from '@angular/core';
import {SearchbarComponent} from '../../component/searchbar/searchbar.component';
import {Button} from 'primeng/button';
import {User, UserService} from '../../services/user.service';
import {SearchResultComponent} from '../../component/search-result/search-result.component';
import {NgForOf} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-page-search',
  imports: [
    SearchbarComponent,
    Button,
    SearchResultComponent,
    NgForOf,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './page-search.component.html',
  standalone: true,
  styleUrl: './page-search.component.css'
})
export class PageSearchComponent implements OnInit{

  results : User[] = []
  currentUser! : User;

  selectedSituation: string = '';
  selectOptionsCondition = [
    { label: 'Vieux', value: 'vieux' },
    { label: 'Dépressif', value: 'depressif' },
    { label: 'Schizophrène', value: 'schizo' },
    { label: 'Maladie en phase terminale', value: 'terminal' },
    { label: 'Isolé', value: 'isole' },
    { label: 'Handicap moteur', value: 'moteur' },
    { label: 'Handicap mental', value: 'mental' },
  ];

  selectedAmis : string = '';
  selectOptionsAmis = [
    {label : '< 5', value : '-5'},
    {label : '> 5', value : '+5'},
    {label : '0', value : '0'}
  ]

  selectedInterest : string = ''
  selectedOptionInterest = [
    {label : 'Sports', value : 'sports'},
    {label : 'Jeux vidéos', value : 'jeux vidéos'},
    {label : 'Lecture', value : 'lecture'},
    {label : 'Art', value : 'art'},
    {label : 'Sieste', value : 'sieste'},
  ]

  constructor(private userService : UserService) {

    this.currentUser = this.userService.getCurrentUser() || {
      username : "",
      password : "",
      email : "",
      role : ""
    }

  }

  search() {
    this.userService.filterUsers({
      condition: this.selectedSituation || undefined,
      friendCount: this.selectedAmis || undefined,
      interest: this.selectedInterest || undefined,
    }).subscribe({
      next: (value) => {

        this.results = [];

        if (!this.currentUser) return;

        for (let u of value) {
          if (this.currentUser.role === "Aidant" || this.currentUser.role === "admin") {
            if (u.role === "Aidé") {
              this.results.push(u);
            }
          } else if (this.currentUser.role === "Aidé") {
            if (u.role === "Aidant") {
              this.results.push(u);
            }
          }
        }
      },
      error: (err) => console.error('Search failed', err)
    });
  }

  ngOnInit() {

    this.search();

  }

  resetFilters() {
    this.selectedAmis = '';
    this.selectedInterest = '';
    this.selectedSituation = '';
    this.search();
  }
}
