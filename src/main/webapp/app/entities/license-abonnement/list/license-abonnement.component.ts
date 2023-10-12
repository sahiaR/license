import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { SortService } from 'app/shared/sort/sort.service';
import { ILicenseAbonnement } from '../license-abonnement.model';
import { EntityArrayResponseType, LicenseAbonnementService } from '../service/license-abonnement.service';
import { LicenseAbonnementDeleteDialogComponent } from '../delete/license-abonnement-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-license-abonnement',
  templateUrl: './license-abonnement.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class LicenseAbonnementComponent implements OnInit {
  licenseAbonnements?: ILicenseAbonnement[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected licenseAbonnementService: LicenseAbonnementService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
  ) {}

  trackId = (_index: number, item: ILicenseAbonnement): number => this.licenseAbonnementService.getLicenseAbonnementIdentifier(item);

  ngOnInit(): void {
    this.load();
  }
  generateEncryptedTextFile(entityId: number) {
    this.licenseAbonnementService.generateEncryptedTextFileForLicenseAbonnement(entityId).subscribe(
      response => {
        const headers = response.headers;
        const contentType = headers.get('content-type');
        // @ts-ignore
        const blob = new Blob([response.body], { type: contentType });
        // @ts-ignore
        const filename = headers.get('content-disposition').split('filename=')[1];

        // Créez un lien pour le téléchargement
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = filename;

        // Cliquez sur le lien pour déclencher le téléchargement
        downloadLink.click();
      },
      error => {
        console.error('Erreur lors de la génération du fichier', error);
      },
    );
  }

  delete(licenseAbonnement: ILicenseAbonnement): void {
    const modalRef = this.modalService.open(LicenseAbonnementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.licenseAbonnement = licenseAbonnement;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations()),
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending)),
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.licenseAbonnements = this.refineData(dataFromBody);
  }

  protected refineData(data: ILicenseAbonnement[]): ILicenseAbonnement[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ILicenseAbonnement[] | null): ILicenseAbonnement[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.licenseAbonnementService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
