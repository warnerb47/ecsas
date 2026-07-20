import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BackupService } from '@org/api/products';
import { SidebarComponent } from '@org/ecsas/shared-ui';

@Component({
  imports: [RouterModule, SidebarComponent],
  selector: 'ecsas-root',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected title = 'ecsas';
  private readonly _backupService = new BackupService();

  ngOnInit(): void {
    this._backupService.createBackup();
  }
}
