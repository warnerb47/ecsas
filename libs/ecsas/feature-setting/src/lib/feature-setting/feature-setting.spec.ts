import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureSetting } from './feature-setting';

describe('FeatureSetting', () => {
  let component: FeatureSetting;
  let fixture: ComponentFixture<FeatureSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureSetting],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureSetting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
