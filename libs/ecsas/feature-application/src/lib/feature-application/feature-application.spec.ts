import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureApplication } from './feature-application';

describe('FeatureApplication', () => {
  let component: FeatureApplication;
  let fixture: ComponentFixture<FeatureApplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureApplication],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureApplication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
