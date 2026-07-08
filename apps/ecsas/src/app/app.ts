import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LlamaService } from '@org/api/products';
import { SidebarComponent } from '@org/ecsas/shared-ui';
import { Command, Child } from '@tauri-apps/plugin-shell';

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
