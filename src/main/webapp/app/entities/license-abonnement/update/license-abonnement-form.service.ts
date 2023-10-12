import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILicenseAbonnement, NewLicenseAbonnement } from '../license-abonnement.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILicenseAbonnement for edit and NewLicenseAbonnementFormGroupInput for create.
 */
type LicenseAbonnementFormGroupInput = ILicenseAbonnement | PartialWithRequiredKeyOf<NewLicenseAbonnement>;

type LicenseAbonnementFormDefaults = Pick<NewLicenseAbonnement, 'id'>;

type LicenseAbonnementFormGroupContent = {
  id: FormControl<ILicenseAbonnement['id'] | NewLicenseAbonnement['id']>;
  startDate: FormControl<ILicenseAbonnement['startDate']>;
  endDate: FormControl<ILicenseAbonnement['endDate']>;
  societe: FormControl<ILicenseAbonnement['societe']>;
  nombreDUtilisateur: FormControl<ILicenseAbonnement['nombreDUtilisateur']>;
};

export type LicenseAbonnementFormGroup = FormGroup<LicenseAbonnementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LicenseAbonnementFormService {
  createLicenseAbonnementFormGroup(licenseAbonnement: LicenseAbonnementFormGroupInput = { id: null }): LicenseAbonnementFormGroup {
    const licenseAbonnementRawValue = {
      ...this.getFormDefaults(),
      ...licenseAbonnement,
    };
    return new FormGroup<LicenseAbonnementFormGroupContent>({
      id: new FormControl(
        { value: licenseAbonnementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      startDate: new FormControl(licenseAbonnementRawValue.startDate),
      endDate: new FormControl(licenseAbonnementRawValue.endDate),
      societe: new FormControl(licenseAbonnementRawValue.societe),
      nombreDUtilisateur: new FormControl(licenseAbonnementRawValue.nombreDUtilisateur),
    });
  }

  getLicenseAbonnement(form: LicenseAbonnementFormGroup): ILicenseAbonnement | NewLicenseAbonnement {
    return form.getRawValue() as ILicenseAbonnement | NewLicenseAbonnement;
  }

  resetForm(form: LicenseAbonnementFormGroup, licenseAbonnement: LicenseAbonnementFormGroupInput): void {
    const licenseAbonnementRawValue = { ...this.getFormDefaults(), ...licenseAbonnement };
    form.reset(
      {
        ...licenseAbonnementRawValue,
        id: { value: licenseAbonnementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LicenseAbonnementFormDefaults {
    return {
      id: null,
    };
  }
}
