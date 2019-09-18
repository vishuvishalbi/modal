import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { DetailPage } from '../detail/detail.page';

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
        path: 'contacts',
        loadChildren: '../contact/contact.module#ContactPageModule'
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
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage],
  // exports : [
  //   TabsPage,
  //   DetailPage,

  // ]
})
export class TabsPageModule { }
