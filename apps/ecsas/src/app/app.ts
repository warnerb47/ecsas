import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '@org/ecsas/shared-ui';
import {  DatabaseRepository } from '@org/api/products';

@Component({
  imports: [RouterModule, SidebarComponent],
  selector: 'ecsas-root',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected title = 'ecsas';
  private readonly _repositoryService = new DatabaseRepository();

  ngOnInit() {
    this.initState();
  }

  async initState(){
    await this._repositoryService.initDB();
    const result = await this._repositoryService.seedQuery(`
      SELECT * FROM core_procedure_document;
      `);
    console.log({result});
  }
}
