import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateApplicantComponent } from './create-applicant.component';

describe('CreateApplicantComponent', () => {
  let component: CreateApplicantComponent;
  let fixture: ComponentFixture<CreateApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateApplicantComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: { close: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateApplicantComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
