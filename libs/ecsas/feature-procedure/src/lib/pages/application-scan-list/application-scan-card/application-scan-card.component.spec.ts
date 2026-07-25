import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationScanCardComponent } from './application-scan-card.component';

describe('ApplicationScanCardComponent', () => {
  let component: ApplicationScanCardComponent;
  let fixture: ComponentFixture<ApplicationScanCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationScanCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationScanCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
