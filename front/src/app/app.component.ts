import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './component/header/header.component';
import {FooterComponent} from './component/footer/footer.component';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, Dialog, Button],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'mainTendue';

  display: boolean = false;

  ngOnInit() {

    const shown = localStorage.getItem('showDialog');
    console.log(shown);

    if(!shown) {
      this.display = true;
    }

  }

  showDialog() {
    localStorage.setItem('showDialog', "true")
    this.display = false;
  }

}
