import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_helpers';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  // {
  //   path: 'home',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  // },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: 'experiences', loadChildren: './experience/experience.module#ExperiencePageModule' },
  { path: 'home', loadChildren: './experience/experience.module#ExperiencePageModule' },
  // { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'tabs/:id', loadChildren: './tabs/tabs.module#TabsPageModule' },
  // { path: 'guests', loadChildren: './guests/guests.module#GuestsPageModule' },

  // { path: 'map', loadChildren: './map/map.module#MapPageModule' },




  // { path: 'ticket', loadChildren: './experience/ticket/ticket.module#TicketPageModule' },
  // { path: 'detail', loadChildren: './experience/detail/detail.module#DetailPageModule' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
