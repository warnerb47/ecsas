import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticComponent } from './statistic.component';
import { ApplicationGateway } from '@org/ecsas/ecsas-data';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('StatisticComponent', () => {
  let component: StatisticComponent;
  let fixture: ComponentFixture<StatisticComponent>;
  let mockApplicationGateway: Partial<ApplicationGateway>;

  beforeEach(async () => {
    mockApplicationGateway = {
      getApplicationStatistics: vi.fn().mockResolvedValue({
        total: 100,
        pending: 40,
        approved: 35,
        rejected: 25,
      }),
    };

    await TestBed.configureTestingModule({
      imports: [StatisticComponent],
      providers: [
        { provide: ApplicationGateway, useValue: mockApplicationGateway },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load statistics on init', () => {
    expect(mockApplicationGateway.getApplicationStatistics).toHaveBeenCalled();
    expect(component.total()).toBe(100);
    expect(component.pending()).toBe(40);
    expect(component.approved()).toBe(35);
    expect(component.rejected()).toBe(25);
  });
});