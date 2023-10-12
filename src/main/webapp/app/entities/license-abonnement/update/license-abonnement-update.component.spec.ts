import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LicenseAbonnementService } from '../service/license-abonnement.service';
import { ILicenseAbonnement } from '../license-abonnement.model';
import { LicenseAbonnementFormService } from './license-abonnement-form.service';

import { LicenseAbonnementUpdateComponent } from './license-abonnement-update.component';

describe('LicenseAbonnement Management Update Component', () => {
  let comp: LicenseAbonnementUpdateComponent;
  let fixture: ComponentFixture<LicenseAbonnementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let licenseAbonnementFormService: LicenseAbonnementFormService;
  let licenseAbonnementService: LicenseAbonnementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), LicenseAbonnementUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LicenseAbonnementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LicenseAbonnementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    licenseAbonnementFormService = TestBed.inject(LicenseAbonnementFormService);
    licenseAbonnementService = TestBed.inject(LicenseAbonnementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const licenseAbonnement: ILicenseAbonnement = { id: 456 };

      activatedRoute.data = of({ licenseAbonnement });
      comp.ngOnInit();

      expect(comp.licenseAbonnement).toEqual(licenseAbonnement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILicenseAbonnement>>();
      const licenseAbonnement = { id: 123 };
      jest.spyOn(licenseAbonnementFormService, 'getLicenseAbonnement').mockReturnValue(licenseAbonnement);
      jest.spyOn(licenseAbonnementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ licenseAbonnement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: licenseAbonnement }));
      saveSubject.complete();

      // THEN
      expect(licenseAbonnementFormService.getLicenseAbonnement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(licenseAbonnementService.update).toHaveBeenCalledWith(expect.objectContaining(licenseAbonnement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILicenseAbonnement>>();
      const licenseAbonnement = { id: 123 };
      jest.spyOn(licenseAbonnementFormService, 'getLicenseAbonnement').mockReturnValue({ id: null });
      jest.spyOn(licenseAbonnementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ licenseAbonnement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: licenseAbonnement }));
      saveSubject.complete();

      // THEN
      expect(licenseAbonnementFormService.getLicenseAbonnement).toHaveBeenCalled();
      expect(licenseAbonnementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILicenseAbonnement>>();
      const licenseAbonnement = { id: 123 };
      jest.spyOn(licenseAbonnementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ licenseAbonnement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(licenseAbonnementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
