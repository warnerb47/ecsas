import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  ButtonComponent,
  DateInputComponent,
  DropdownComponent,
  NumberInputComponent,
  TextInputComponent,
} from '@org/ecsas/shared-ui';
import { EventExpense } from '@org/models';

@Component({
  selector: 'lib-event-expense-form',
  imports: [
    FormField,
    TextInputComponent,
    DropdownComponent,
    NumberInputComponent,
    DateInputComponent,
    ButtonComponent,
  ],
  templateUrl: './event-expense-form.component.html',
})
export class EventExpenseFormComponent implements OnInit {
  private readonly _dialogRef = inject(DynamicDialogRef);
  private readonly _dialogConfig = inject(DynamicDialogConfig);
  expense = signal<Partial<EventExpense> | null>(null);

  categories = [
    { label: 'Logistique', value: 'Logistique' },
    { label: 'Restauration', value: 'Restauration' },
    { label: 'Communication', value: 'Communication' },
    { label: 'Distribution', value: 'Distribution' },
    { label: 'Autre', value: 'Autre' },
  ];

  model = signal<ExpenseFormModel>({
    label: this.expense()?.label ?? '',
    category: this.expense()?.category ?? 'Logistique',
    planned: this.expense()?.planned ?? 0,
    spent: this.expense()?.spent ?? 0,
    date: this.expense()?.date ?? '',
  });

  expenseForm = form(this.model, (f) => {
    required(f.label, { message: 'Le poste est requis' });
  });

    ngOnInit() {
      this.initFormState();
    }

    async initFormState() {
      const expense: Partial<EventExpense> | null = this._dialogConfig.data;
      if (expense) {
        this.expense.set(expense);
        this.model.update(value => ({
          ...value, ...expense
        }));
      }
    }

  async submit() {
    await submit(this.expenseForm, async () => {
      if (this.expenseForm().valid()) {
        const model = this.model();
        this._dialogRef?.close({
          id: this.expense()?.id ?? '',
          label: model.label,
          category: model.category,
          planned: model.planned,
          spent: model.spent,
          date: model.date,
        } as Partial<EventExpense>);
      }
    });
  }
}

interface ExpenseFormModel {
  label: string;
  category: string;
  planned: number;
  spent: number;
  date: string;
}
