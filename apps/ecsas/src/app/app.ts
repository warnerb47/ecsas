import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '@org/ecsas/shared-ui';
import {  RepositoryService } from '@org/api/products';

@Component({
  imports: [RouterModule, SidebarComponent],
  selector: 'ecsas-root',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected title = 'ecsas';
  private readonly _repositoryService = inject(RepositoryService);

  ngOnInit() {
    this.initState();
  }

  async initState(){
    console.log('init state')
    await this._repositoryService.initDB();
    const procedures = await this._repositoryService.getProcedures();
    console.log({procedures});
  }
}
