import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ILicenseAbonnement } from '../license-abonnement.model';

@Component({
  standalone: true,
  selector: 'jhi-license-abonnement-detail',
  templateUrl: './license-abonnement-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class LicenseAbonnementDetailComponent {
  @Input() licenseAbonnement: ILicenseAbonnement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
