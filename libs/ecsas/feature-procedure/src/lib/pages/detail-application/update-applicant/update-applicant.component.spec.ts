import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { UpdateApplicantComponent } from './update-applicant.component';

describe('UpdateApplicantComponent', () => {
  let component: UpdateApplicantComponent;
  let fixture: ComponentFixture<UpdateApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateApplicantComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: { close: () => undefined } },
        { provide: DynamicDialogConfig, useValue: { data: undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateApplicantComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
