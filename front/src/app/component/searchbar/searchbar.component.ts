import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-searchbar',
  imports: [
    FloatLabel,
    InputText,
    ReactiveFormsModule
  ],
  templateUrl: './searchbar.component.html',
  standalone: true,
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent {

  searchControl = new FormControl("");

  constructor(protected router : Router, private route : ActivatedRoute) {
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      const searchParam = params['r'];
      if (searchParam) {
        this.searchControl.setValue(searchParam);
      }
    });

  }

  rechercher() {
    this.router.navigate(["search"], {queryParams : {r : this.searchControl.value}})
  }

  clearSearchInput() {
    this.searchControl.setValue('');
  }

}
