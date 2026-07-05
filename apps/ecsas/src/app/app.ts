import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LlamaService } from '@org/api/products';
import { SidebarComponent } from '@org/ecsas/shared-ui';

@Component({
  imports: [RouterModule, SidebarComponent],
  selector: 'ecsas-root',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected title = 'ecsas';
  private readonly _llamaService = new LlamaService();

  async ngOnInit() {
    const init = await this._llamaService.initServer();
    console.log({init});
    const response = this._llamaService.test();
    console.log({response});

  }

}
