import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '@org/ecsas/shared-ui';
import {  DocumentManager } from '@org/api/products';

@Component({
  imports: [RouterModule, SidebarComponent],
  selector: 'ecsas-root',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected title = 'ecsas';
  private readonly _documentManager = new DocumentManager();

  ngOnInit() {
    this.initState();
  }

  async initState(){
    this._documentManager.initAppFolder();
  }
}
