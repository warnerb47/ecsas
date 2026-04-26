import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailApplicationComponent } from './detail-application.component';

describe('DetailApplicationComponent', () => {
  let component: DetailApplicationComponent;
  let fixture: ComponentFixture<DetailApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailApplicationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailApplicationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
