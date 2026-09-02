import { Component, input, output } from '@angular/core';
import { EventExpense } from '@org/models';

const EXPENSE_CATEGORY_CLASSES: Record<string, string> = {
  Logistique: 'bg-slate-100 text-slate-500',
  Restauration: 'bg-amber-100 text-amber-700',
  Communication: 'bg-blue-100 text-blue-700',
  Distribution: 'bg-violet-100 text-violet-700',
  Autre: 'bg-slate-100 text-slate-500',
};

@Component({
  selector: 'lib-event-expense-list',
  standalone: true,
  imports: [],
  templateUrl: './event-expense-list.component.html',
})
export class EventExpenseListComponent {
  expenses = input<Partial<EventExpense>[]>([]);
  budget = input<number | undefined>(0);
  totalSpent = input(0);
  remaining = input(0);
  executionRate = input(0);

  addExpense = output<void>();
  editExpense = output<Partial<EventExpense>>();
  deleteExpense = output<Partial<EventExpense>>();

  formatAmount(value: number | undefined): string {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  }

  formatDate(value: string | undefined): string {
    if (!value) return '—';
    const parts = value.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return value;
  }

  formatEcart(planned: number | undefined, spent: number | undefined): string {
    if (planned === null || planned === undefined) return '—';
    const diff = planned - (spent ?? 0);
    if (diff === 0) return '—';
    const formatted = new Intl.NumberFormat('fr-FR').format(Math.abs(diff));
    return diff > 0 ? `+${formatted} FCFA` : `-${formatted} FCFA`;
  }

  isEcartPositive(planned: number | undefined, spent: number | undefined): boolean {
    if (planned === null || planned === undefined) return false;
    return planned - (spent ?? 0) > 0;
  }

  getCategoryClasses(category: string | undefined): string {
    if (!category) return 'bg-slate-100 text-slate-500';
    return EXPENSE_CATEGORY_CLASSES[category] ?? 'bg-slate-100 text-slate-500';
  }
}
