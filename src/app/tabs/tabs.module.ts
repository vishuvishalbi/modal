import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { ContactsPageModule } from '../contacts/contacts.module';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'detail',
        loadChildren: '../detail/detail.module#DetailPageModule'
      },
      {
        path: 'guests',
        loadChildren: '../guests/guests.module#GuestsPageModule'
      },
      {
        path: 'ticket',
        loadChildren: '../ticket/ticket.module#TicketPageModule'
      },
      { 
        path: 'media', 
        loadChildren: '../media/media.module#MediaPageModule' 
      },

    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactsPageModule,
    RouterModule.forChild(routes),
  ],
  declarations: [TabsPage],
})
export class TabsPageModule { }
