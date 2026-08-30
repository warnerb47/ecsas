import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateApplicationComponent } from './update-application.component';

describe('UpdateApplicationComponent', () => {
  let component: UpdateApplicationComponent;
  let fixture: ComponentFixture<UpdateApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateApplicationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateApplicationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
