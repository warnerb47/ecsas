import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProcedureDocumentComponent } from './procedure-document.component';

describe('ProcedureDocumentComponent', () => {
  let component: ProcedureDocumentComponent;
  let fixture: ComponentFixture<ProcedureDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcedureDocumentComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: { close: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcedureDocumentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
