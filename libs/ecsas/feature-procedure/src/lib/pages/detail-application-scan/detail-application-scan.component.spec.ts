import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailApplicationScanComponent } from './detail-application-scan.component';

describe('DetailApplicationScanComponent', () => {
  let component: DetailApplicationScanComponent;
  let fixture: ComponentFixture<DetailApplicationScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailApplicationScanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailApplicationScanComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
