import {Component, OnInit, ViewChild} from '@angular/core';
import {SearchbarComponent} from '../../component/searchbar/searchbar.component';
import {Button} from 'primeng/button';
import {User, UserService} from '../../services/user.service';
import {SearchResultComponent} from '../../component/search-result/search-result.component';
import {NgForOf} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {FormControl, FormsModule} from '@angular/forms';
import { CONDITIONS, FRIEND_COUNT_OPTIONS, INTERESTS } from '../../constants/app.constants';
import {ActivatedRoute, Router} from '@angular/router';

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

  @ViewChild(SearchbarComponent) searchbarComponent!: SearchbarComponent;

  results : User[] = []
  currentUser! : User;

  selectedSituation: string = '';
  selectOptionsCondition = CONDITIONS;

  selectedAmis : string = '';
  selectOptionsAmis = FRIEND_COUNT_OPTIONS;

  selectedInterest : string = ''
  selectedOptionInterest = INTERESTS;

  constructor(private userService : UserService, private route : ActivatedRoute, private router : Router) {

    this.currentUser = this.userService.getCurrentUser() || {
      username : "",
      password : "",
      email : "",
      role : ""
    }

  }

  search() {



    this.route.queryParams.subscribe(params => {
      const searchParam = params['r'];
      if (searchParam) {
        this.results = [];
        this.userService.getUserByUsername(searchParam).subscribe({
          next : (value) => {
            this.results.push(value);
          }
        })
      } else {
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
    });
  }

  ngOnInit() {

    this.search();

  }

  resetFilters() {
    this.selectedAmis = '';
    this.selectedInterest = '';
    this.selectedSituation = '';

    this.searchbarComponent.clearSearchInput();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { r: null },
      queryParamsHandling: 'merge'
    });

    this.search();
  }
}
