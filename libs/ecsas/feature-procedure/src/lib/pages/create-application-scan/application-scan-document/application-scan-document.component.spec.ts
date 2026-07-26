import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationScanDocumentComponent } from './application-scan-document.component';

describe('ApplicationScanDocumentComponent', () => {
  let component: ApplicationScanDocumentComponent;
  let fixture: ComponentFixture<ApplicationScanDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationScanDocumentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationScanDocumentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
