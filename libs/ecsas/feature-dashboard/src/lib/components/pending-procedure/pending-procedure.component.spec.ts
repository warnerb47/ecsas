import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingProcedureComponent } from './pending-procedure.component';

describe('PendingProcedureComponent', () => {
  let component: PendingProcedureComponent;
  let fixture: ComponentFixture<PendingProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingProcedureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingProcedureComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
