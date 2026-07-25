import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationScanListComponent } from './application-scan-list.component';

describe('ApplicationScanListComponent', () => {
  let component: ApplicationScanListComponent;
  let fixture: ComponentFixture<ApplicationScanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationScanListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationScanListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
