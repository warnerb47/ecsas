import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApplicantGateway } from '@org/ecsas/ecsas-data';
import { SearchApplicantComponent } from './search-applicant.component';

describe('SearchApplicantComponent', () => {
  let component: SearchApplicantComponent;
  let fixture: ComponentFixture<SearchApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchApplicantComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: { close: () => undefined } },
        {
          provide: ApplicantGateway,
          useValue: {
            searchApplicant: () => Promise.resolve([]),
            getApplicantById: () => Promise.resolve(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchApplicantComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
