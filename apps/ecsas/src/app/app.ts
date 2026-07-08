import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LlamaService } from '@org/api/products';
import { SidebarComponent } from '@org/ecsas/shared-ui';

@Component({
  imports: [RouterModule, SidebarComponent],
  selector: 'ecsas-root',
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  protected title = 'ecsas';
  private _llamaService = new LlamaService();

  async ngOnInit() {
    await this._llamaService.startLlamaServer();
  }

  ngOnDestroy() {
    this._llamaService.stopLlamaServer();
  }


}
