import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportZipCardComponent } from './export-zip-card.component';

describe('ExportZipCardComponent', () => {
  let component: ExportZipCardComponent;
  let fixture: ComponentFixture<ExportZipCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportZipCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportZipCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
