import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed({ zoneless: false });

if (!globalThis.ResizeObserver) {
  class ResizeObserverMock {
    observe = () => undefined;
    unobserve = () => undefined;
    disconnect = () => undefined;
  }
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
}
