import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILicenseAbonnement, NewLicenseAbonnement } from '../license-abonnement.model';

export type PartialUpdateLicenseAbonnement = Partial<ILicenseAbonnement> & Pick<ILicenseAbonnement, 'id'>;

type RestOf<T extends ILicenseAbonnement | NewLicenseAbonnement> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestLicenseAbonnement = RestOf<ILicenseAbonnement>;

export type NewRestLicenseAbonnement = RestOf<NewLicenseAbonnement>;

export type PartialUpdateRestLicenseAbonnement = RestOf<PartialUpdateLicenseAbonnement>;

export type EntityResponseType = HttpResponse<ILicenseAbonnement>;
export type EntityArrayResponseType = HttpResponse<ILicenseAbonnement[]>;

@Injectable({ providedIn: 'root' })
export class LicenseAbonnementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/license-abonnements');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(licenseAbonnement: NewLicenseAbonnement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(licenseAbonnement);
    return this.http
      .post<RestLicenseAbonnement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(licenseAbonnement: ILicenseAbonnement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(licenseAbonnement);
    return this.http
      .put<RestLicenseAbonnement>(`${this.resourceUrl}/${this.getLicenseAbonnementIdentifier(licenseAbonnement)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(licenseAbonnement: PartialUpdateLicenseAbonnement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(licenseAbonnement);
    return this.http
      .patch<RestLicenseAbonnement>(`${this.resourceUrl}/${this.getLicenseAbonnementIdentifier(licenseAbonnement)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLicenseAbonnement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLicenseAbonnement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLicenseAbonnementIdentifier(licenseAbonnement: Pick<ILicenseAbonnement, 'id'>): number {
    return licenseAbonnement.id;
  }

  compareLicenseAbonnement(o1: Pick<ILicenseAbonnement, 'id'> | null, o2: Pick<ILicenseAbonnement, 'id'> | null): boolean {
    return o1 && o2 ? this.getLicenseAbonnementIdentifier(o1) === this.getLicenseAbonnementIdentifier(o2) : o1 === o2;
  }

  addLicenseAbonnementToCollectionIfMissing<Type extends Pick<ILicenseAbonnement, 'id'>>(
    licenseAbonnementCollection: Type[],
    ...licenseAbonnementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const licenseAbonnements: Type[] = licenseAbonnementsToCheck.filter(isPresent);
    if (licenseAbonnements.length > 0) {
      const licenseAbonnementCollectionIdentifiers = licenseAbonnementCollection.map(
        licenseAbonnementItem => this.getLicenseAbonnementIdentifier(licenseAbonnementItem)!,
      );
      const licenseAbonnementsToAdd = licenseAbonnements.filter(licenseAbonnementItem => {
        const licenseAbonnementIdentifier = this.getLicenseAbonnementIdentifier(licenseAbonnementItem);
        if (licenseAbonnementCollectionIdentifiers.includes(licenseAbonnementIdentifier)) {
          return false;
        }
        licenseAbonnementCollectionIdentifiers.push(licenseAbonnementIdentifier);
        return true;
      });
      return [...licenseAbonnementsToAdd, ...licenseAbonnementCollection];
    }
    return licenseAbonnementCollection;
  }

  protected convertDateFromClient<T extends ILicenseAbonnement | NewLicenseAbonnement | PartialUpdateLicenseAbonnement>(
    licenseAbonnement: T,
  ): RestOf<T> {
    return {
      ...licenseAbonnement,
      startDate: licenseAbonnement.startDate?.format(DATE_FORMAT) ?? null,
      endDate: licenseAbonnement.endDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restLicenseAbonnement: RestLicenseAbonnement): ILicenseAbonnement {
    return {
      ...restLicenseAbonnement,
      startDate: restLicenseAbonnement.startDate ? dayjs(restLicenseAbonnement.startDate) : undefined,
      endDate: restLicenseAbonnement.endDate ? dayjs(restLicenseAbonnement.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLicenseAbonnement>): HttpResponse<ILicenseAbonnement> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLicenseAbonnement[]>): HttpResponse<ILicenseAbonnement[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
