import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../license-abonnement.test-samples';

import { LicenseAbonnementFormService } from './license-abonnement-form.service';

describe('LicenseAbonnement Form Service', () => {
  let service: LicenseAbonnementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenseAbonnementFormService);
  });

  describe('Service methods', () => {
    describe('createLicenseAbonnementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLicenseAbonnementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            societe: expect.any(Object),
            nombreDUtilisateur: expect.any(Object),
          }),
        );
      });

      it('passing ILicenseAbonnement should create a new form with FormGroup', () => {
        const formGroup = service.createLicenseAbonnementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            societe: expect.any(Object),
            nombreDUtilisateur: expect.any(Object),
          }),
        );
      });
    });

    describe('getLicenseAbonnement', () => {
      it('should return NewLicenseAbonnement for default LicenseAbonnement initial value', () => {
        const formGroup = service.createLicenseAbonnementFormGroup(sampleWithNewData);

        const licenseAbonnement = service.getLicenseAbonnement(formGroup) as any;

        expect(licenseAbonnement).toMatchObject(sampleWithNewData);
      });

      it('should return NewLicenseAbonnement for empty LicenseAbonnement initial value', () => {
        const formGroup = service.createLicenseAbonnementFormGroup();

        const licenseAbonnement = service.getLicenseAbonnement(formGroup) as any;

        expect(licenseAbonnement).toMatchObject({});
      });

      it('should return ILicenseAbonnement', () => {
        const formGroup = service.createLicenseAbonnementFormGroup(sampleWithRequiredData);

        const licenseAbonnement = service.getLicenseAbonnement(formGroup) as any;

        expect(licenseAbonnement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILicenseAbonnement should not enable id FormControl', () => {
        const formGroup = service.createLicenseAbonnementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLicenseAbonnement should disable id FormControl', () => {
        const formGroup = service.createLicenseAbonnementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
