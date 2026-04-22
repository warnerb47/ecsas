import { Component, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'lib-tabs',
  standalone: true,
  imports: [],
  templateUrl: './tabs.component.html'
})
export class TabsComponent implements OnInit {
  tabs = input<string[]>([]);
  activeTabInput = input<string>('');
  activeTab = signal('');
  activeTabChange = output<string>();

  ngOnInit(): void {
    this.activeTab.set(this.activeTabInput() || this.tabs()[0] || '');
  }

  onTabClick(tab: string) {
    this.activeTab.set(tab);
    this.activeTabChange.emit(tab);
  }
}
