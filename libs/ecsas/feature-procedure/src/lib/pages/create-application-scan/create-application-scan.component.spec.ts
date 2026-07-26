import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateApplicationScanComponent } from './create-application-scan.component';

describe('CreateApplicationScanComponent', () => {
  let component: CreateApplicationScanComponent;
  let fixture: ComponentFixture<CreateApplicationScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApplicationScanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateApplicationScanComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
