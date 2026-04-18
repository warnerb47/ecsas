import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureProcedure } from './feature-procedure';

describe('FeatureProcedure', () => {
  let component: FeatureProcedure;
  let fixture: ComponentFixture<FeatureProcedure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureProcedure],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureProcedure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
