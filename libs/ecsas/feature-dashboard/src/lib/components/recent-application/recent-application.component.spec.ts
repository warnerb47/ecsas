import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RecentApplicationComponent } from './recent-application.component';
import { ApplicationGateway } from '@org/ecsas/ecsas-data';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('RecentApplicationComponent', () => {
  let component: RecentApplicationComponent;
  let fixture: ComponentFixture<RecentApplicationComponent>;
  let mockApplicationGateway: Partial<ApplicationGateway>;

  beforeEach(async () => {
    mockApplicationGateway = {
      filterApplications: vi.fn().mockResolvedValue([
        {
          id: '1',
          applicant: { fullName: 'John Doe' },
          procedure: { id: 'p1', name: 'Acte de naissance' },
          createdAt: '2026-08-15 10:00:00',
          status: 'PENDING',
        },
      ]),
    };

    await TestBed.configureTestingModule({
      imports: [RecentApplicationComponent],
      providers: [
        { provide: ApplicationGateway, useValue: mockApplicationGateway },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentApplicationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recent applications', () => {
    expect(mockApplicationGateway.filterApplications).toHaveBeenCalled();
    expect(component.applications().length).toBe(1);
  });

  it('should fetch applications on next page', () => {
    component.nextPage();
    expect(component.filterModel().page).toBe(2);
  });

  it('should not go below page 1', () => {
    component.previousPage();
    expect(component.filterModel().page).toBe(1);
  });

  it('should treat missing database table as empty applications', async () => {
    mockApplicationGateway.filterApplications = vi
      .fn()
      .mockRejectedValue(
        new Error('error returned from database: (code: 1) no such table: core_application'),
      );

    await component.fetchApplications();

    expect(component.error()).toBe(false);
    expect(component.applications()).toEqual([]);
  });
});
