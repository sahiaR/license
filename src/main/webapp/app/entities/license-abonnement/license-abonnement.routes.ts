import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { LicenseAbonnementComponent } from './list/license-abonnement.component';
import { LicenseAbonnementDetailComponent } from './detail/license-abonnement-detail.component';
import { LicenseAbonnementUpdateComponent } from './update/license-abonnement-update.component';
import LicenseAbonnementResolve from './route/license-abonnement-routing-resolve.service';

const licenseAbonnementRoute: Routes = [
  {
    path: '',
    component: LicenseAbonnementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LicenseAbonnementDetailComponent,
    resolve: {
      licenseAbonnement: LicenseAbonnementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LicenseAbonnementUpdateComponent,
    resolve: {
      licenseAbonnement: LicenseAbonnementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LicenseAbonnementUpdateComponent,
    resolve: {
      licenseAbonnement: LicenseAbonnementResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default licenseAbonnementRoute;
