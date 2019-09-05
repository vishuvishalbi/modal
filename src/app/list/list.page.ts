import { Component, OnInit } from '@angular/core';
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ title: string; note: string; icon: string }> = [];
  public ids:any;
  public users:any;
  constructor(
    private fbs: FirebaseService
  ) {
    this.fbs.getOrder()
      .then((res) => {
        this.users = this.snapshotToObject(res);
        this.ids = Object.keys(this.users);
        
      }, console.log);

  }
  snapshotToObject(snapshot) {
    let item = snapshot.val();
    item.key = snapshot.key;
    return item;
  }
  ngOnInit() {
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
