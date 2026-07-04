import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationStatisticsComponent } from './application-statistics.component';

describe('ApplicationStatisticsComponent', () => {
  let component: ApplicationStatisticsComponent;
  let fixture: ComponentFixture<ApplicationStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationStatisticsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationStatisticsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
