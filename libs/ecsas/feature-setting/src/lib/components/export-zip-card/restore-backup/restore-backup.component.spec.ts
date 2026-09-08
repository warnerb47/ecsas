import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { RestoreBackupComponent } from './restore-backup.component';

describe('RestoreBackupComponent', () => {
  let component: RestoreBackupComponent;
  let fixture: ComponentFixture<RestoreBackupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestoreBackupComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: { close: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestoreBackupComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
