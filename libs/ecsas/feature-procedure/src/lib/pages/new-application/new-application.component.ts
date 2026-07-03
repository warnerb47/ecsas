import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  BreadcrumbItem,
  TopbarComponent,
  ButtonComponent,
  UploadDocumentCardComponent,
  PdfViewerComponent,
} from '@org/ecsas/shared-ui';
import { DialogService } from 'primeng/dynamicdialog';
import { SearchApplicantComponent } from './search-applicant/search-applicant.component';
import { CreateApplicantComponent } from './create-applicant/create-applicant.component';
import { Applicant, Source } from '@org/models';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'lib-new-application-component',
  imports: [
    TopbarComponent,
    RouterLink,
    ButtonComponent,
    DatePipe,
    UploadDocumentCardComponent,
  ],
  providers: [DialogService],
  templateUrl: './new-application.component.html',
})
export class NewApplicationComponent implements OnDestroy {
  private readonly _dialogService = inject(DialogService);
  private readonly _unsubscribe = new Subject<void>();

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Procédures', route: '/procedure' },
    { label: 'Nouvelle demande', route: '/procedure/new-application' },
  ];

  quartiers = [
    { label: 'Yoff Layenne', value: 'yoff_layenne' },
    { label: 'Ndénate', value: 'ndenate' },
    { label: 'Dagoudane', value: 'dagoudane' },
    { label: 'Mbenguène', value: 'mbenguene' },
  ];

  applicant = signal<Partial<Applicant> | null>(null);

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  searchApplicant() {
    this._dialogService
      .open(SearchApplicantComponent, {
        header: 'Rechercher un bénéficiaire',
        width: '40vw',
        height: '70vh',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe((result) => {
        this.applicant.set(result);
      });
  }

  createApplicant() {
    this._dialogService
      .open(CreateApplicantComponent, {
        header: 'Ajouter un bénéficiaire',
        width: '40vw',
        focusOnShow: false,
        closable: true,
        closeOnEscape: true,
      })
      ?.onClose.pipe(takeUntil(this._unsubscribe))
      .subscribe((result) => {
        if (!result) return;
        this.applicant.set(result);
        console.log({ result });
      });
  }

  displaySource(source: Partial<Source>) {
    this._dialogService.open(PdfViewerComponent, {
      header: source.name,
      width: '80vw',
      height: '100vh',
      focusOnShow: false,
      closable: true,
      closeOnEscape: true,
      maximizable: true,
      data: source,
    });
  }
}
