import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { PendingProcedureComponent } from './pending-procedure.component';
import { ProcedureGateway } from '@org/ecsas/ecsas-data';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('PendingProcedureComponent', () => {
  let component: PendingProcedureComponent;
  let fixture: ComponentFixture<PendingProcedureComponent>;
  let mockProcedureGateway: Partial<ProcedureGateway>;

  beforeEach(async () => {
    mockProcedureGateway = {
      getRecentProcedures: vi.fn().mockResolvedValue([
        {
          id: '1',
          name: 'Acte de naissance',
          description: 'Description 1',
          icon: 'pi pi-file',
        },
      ]),
    };

    await TestBed.configureTestingModule({
      imports: [PendingProcedureComponent],
      providers: [
        { provide: ProcedureGateway, useValue: mockProcedureGateway },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingProcedureComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recent procedures on init', () => {
    expect(mockProcedureGateway.getRecentProcedures).toHaveBeenCalled();
    expect(component.procedures().length).toBe(1);
  });

  it('should navigate to selected procedure', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.viewProcedure({ id: '1' });
    expect(navigateSpy).toHaveBeenCalledWith(['/procedure/detail', '1']);
  });

  it('should treat missing database table as empty procedures', async () => {
    mockProcedureGateway.getRecentProcedures = vi
      .fn()
      .mockRejectedValue(
        new Error('error returned from database: (code: 1) no such table: core_procedure'),
      );

    await component.fetchRecentProcedures();

    expect(component.error()).toBe(false);
    expect(component.procedures()).toEqual([]);
  });
});
