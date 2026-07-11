import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcedureTypeListComponent } from './procedure-type-list.component';

describe('ProcedureTypeListComponent', () => {
  let component: ProcedureTypeListComponent;
  let fixture: ComponentFixture<ProcedureTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcedureTypeListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcedureTypeListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
