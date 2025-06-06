import { Component } from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {SearchbarComponent} from '../../component/searchbar/searchbar.component';

@Component({
  selector: 'app-page-accueil',
  imports: [
    InputText,
    SearchbarComponent
  ],
  templateUrl: './page-accueil.component.html',
  standalone: true,
  styleUrl: './page-accueil.component.css'
})
export class PageAccueilComponent {

}
