import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationStatisticsCardComponent } from './application-statistics-card.component';

describe('ApplicationStatisticsCardComponent', () => {
  let component: ApplicationStatisticsCardComponent;
  let fixture: ComponentFixture<ApplicationStatisticsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationStatisticsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationStatisticsCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
