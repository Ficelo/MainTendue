import { Routes } from '@angular/router';
import {PageAccueilComponent} from './pages/page-accueil/page-accueil.component';
import {PageChatComponent} from './pages/page-chat/page-chat.component';
import {AuthGuard} from './guards/auth.guard';
import {PageLoginComponent} from './pages/page-login/page-login.component';
import {PageProfilComponent} from './pages/page-profil/page-profil.component';
import {PageSearchComponent} from './pages/page-search/page-search.component';
import {PageCguComponent} from './pages/page-cgu/page-cgu.component';
import {PageAboutUsComponent} from './pages/page-about-us/page-about-us.component';
import {PageAdminComponent} from './pages/page-admin/page-admin.component';
import {AdminGuard} from './guards/admin.guard';

export const routes: Routes = [
  {path : "", component : PageAccueilComponent},
  {path : "chat", component : PageChatComponent, canActivate : [AuthGuard]},
  {path : "login", component : PageLoginComponent},
  {path : "profil", component : PageProfilComponent, canActivate : [AuthGuard]},
  {path : "search", component : PageSearchComponent, canActivate : [AuthGuard]},
  {path : "cgu", component : PageCguComponent},
  {path : "about-us", component : PageAboutUsComponent},
  {path : "admin", component : PageAdminComponent, canActivate : [AdminGuard]}
];
