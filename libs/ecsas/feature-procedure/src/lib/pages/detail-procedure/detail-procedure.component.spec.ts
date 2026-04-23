import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailProcedureComponent } from './detail-procedure.component';

describe('DetailProcedureComponent', () => {
  let component: DetailProcedureComponent;
  let fixture: ComponentFixture<DetailProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProcedureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailProcedureComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
