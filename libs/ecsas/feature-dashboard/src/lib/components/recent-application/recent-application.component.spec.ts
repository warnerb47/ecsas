import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentApplicationComponent } from './recent-application.component';

describe('RecentApplicationComponent', () => {
  let component: RecentApplicationComponent;
  let fixture: ComponentFixture<RecentApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentApplicationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentApplicationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
