import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateApplicantComponent } from './create-applicant.component';

describe('CreateApplicantComponent', () => {
  let component: CreateApplicantComponent;
  let fixture: ComponentFixture<CreateApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApplicantComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateApplicantComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
