import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcedureListComponent } from './procedure-list.component';

describe('ProcedureListComponent', () => {
  let component: ProcedureListComponent;
  let fixture: ComponentFixture<ProcedureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcedureListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcedureListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
