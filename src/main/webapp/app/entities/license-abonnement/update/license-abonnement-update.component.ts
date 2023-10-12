import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ILicenseAbonnement } from '../license-abonnement.model';
import { LicenseAbonnementService } from '../service/license-abonnement.service';
import { LicenseAbonnementFormService, LicenseAbonnementFormGroup } from './license-abonnement-form.service';

@Component({
  standalone: true,
  selector: 'jhi-license-abonnement-update',
  templateUrl: './license-abonnement-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LicenseAbonnementUpdateComponent implements OnInit {
  isSaving = false;
  licenseAbonnement: ILicenseAbonnement | null = null;

  editForm: LicenseAbonnementFormGroup = this.licenseAbonnementFormService.createLicenseAbonnementFormGroup();

  constructor(
    protected licenseAbonnementService: LicenseAbonnementService,
    protected licenseAbonnementFormService: LicenseAbonnementFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ licenseAbonnement }) => {
      this.licenseAbonnement = licenseAbonnement;
      if (licenseAbonnement) {
        this.updateForm(licenseAbonnement);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const licenseAbonnement = this.licenseAbonnementFormService.getLicenseAbonnement(this.editForm);
    if (licenseAbonnement.id !== null) {
      this.subscribeToSaveResponse(this.licenseAbonnementService.update(licenseAbonnement));
    } else {
      this.subscribeToSaveResponse(this.licenseAbonnementService.create(licenseAbonnement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILicenseAbonnement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(licenseAbonnement: ILicenseAbonnement): void {
    this.licenseAbonnement = licenseAbonnement;
    this.licenseAbonnementFormService.resetForm(this.editForm, licenseAbonnement);
  }
}
