import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILicenseAbonnement } from '../license-abonnement.model';
import { LicenseAbonnementService } from '../service/license-abonnement.service';

export const licenseAbonnementResolve = (route: ActivatedRouteSnapshot): Observable<null | ILicenseAbonnement> => {
  const id = route.params['id'];
  if (id) {
    return inject(LicenseAbonnementService)
      .find(id)
      .pipe(
        mergeMap((licenseAbonnement: HttpResponse<ILicenseAbonnement>) => {
          if (licenseAbonnement.body) {
            return of(licenseAbonnement.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default licenseAbonnementResolve;
