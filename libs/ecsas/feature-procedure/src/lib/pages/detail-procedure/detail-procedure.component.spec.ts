import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { DetailProcedureComponent } from './detail-procedure.component';

describe('DetailProcedureComponent', () => {
  let component: DetailProcedureComponent;
  let fixture: ComponentFixture<DetailProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProcedureComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            snapshot: { paramMap: convertToParamMap({}) },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailProcedureComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
