import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NewProcedureComponent } from './new-procedure.component';

describe('NewProcedureComponent', () => {
  let component: NewProcedureComponent;
  let fixture: ComponentFixture<NewProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProcedureComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NewProcedureComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
