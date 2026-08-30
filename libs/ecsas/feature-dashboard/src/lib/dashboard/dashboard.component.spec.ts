import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ApplicationGateway, ProcedureGateway } from '@org/ecsas/ecsas-data';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: ApplicationGateway,
          useValue: {
            getApplicationStatistics: vi.fn().mockResolvedValue({
              total: 0,
              pending: 0,
              approved: 0,
              rejected: 0,
            }),
            filterApplications: vi.fn().mockResolvedValue([]),
          },
        },
        {
          provide: ProcedureGateway,
          useValue: {
            getRecentProcedures: vi.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});