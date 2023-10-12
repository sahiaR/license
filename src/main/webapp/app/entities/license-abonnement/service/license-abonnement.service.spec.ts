import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ILicenseAbonnement } from '../license-abonnement.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../license-abonnement.test-samples';

import { LicenseAbonnementService, RestLicenseAbonnement } from './license-abonnement.service';

const requireRestSample: RestLicenseAbonnement = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.format(DATE_FORMAT),
  endDate: sampleWithRequiredData.endDate?.format(DATE_FORMAT),
};

describe('LicenseAbonnement Service', () => {
  let service: LicenseAbonnementService;
  let httpMock: HttpTestingController;
  let expectedResult: ILicenseAbonnement | ILicenseAbonnement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LicenseAbonnementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a LicenseAbonnement', () => {
      const licenseAbonnement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(licenseAbonnement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LicenseAbonnement', () => {
      const licenseAbonnement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(licenseAbonnement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LicenseAbonnement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LicenseAbonnement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LicenseAbonnement', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLicenseAbonnementToCollectionIfMissing', () => {
      it('should add a LicenseAbonnement to an empty array', () => {
        const licenseAbonnement: ILicenseAbonnement = sampleWithRequiredData;
        expectedResult = service.addLicenseAbonnementToCollectionIfMissing([], licenseAbonnement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(licenseAbonnement);
      });

      it('should not add a LicenseAbonnement to an array that contains it', () => {
        const licenseAbonnement: ILicenseAbonnement = sampleWithRequiredData;
        const licenseAbonnementCollection: ILicenseAbonnement[] = [
          {
            ...licenseAbonnement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLicenseAbonnementToCollectionIfMissing(licenseAbonnementCollection, licenseAbonnement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LicenseAbonnement to an array that doesn't contain it", () => {
        const licenseAbonnement: ILicenseAbonnement = sampleWithRequiredData;
        const licenseAbonnementCollection: ILicenseAbonnement[] = [sampleWithPartialData];
        expectedResult = service.addLicenseAbonnementToCollectionIfMissing(licenseAbonnementCollection, licenseAbonnement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(licenseAbonnement);
      });

      it('should add only unique LicenseAbonnement to an array', () => {
        const licenseAbonnementArray: ILicenseAbonnement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const licenseAbonnementCollection: ILicenseAbonnement[] = [sampleWithRequiredData];
        expectedResult = service.addLicenseAbonnementToCollectionIfMissing(licenseAbonnementCollection, ...licenseAbonnementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const licenseAbonnement: ILicenseAbonnement = sampleWithRequiredData;
        const licenseAbonnement2: ILicenseAbonnement = sampleWithPartialData;
        expectedResult = service.addLicenseAbonnementToCollectionIfMissing([], licenseAbonnement, licenseAbonnement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(licenseAbonnement);
        expect(expectedResult).toContain(licenseAbonnement2);
      });

      it('should accept null and undefined values', () => {
        const licenseAbonnement: ILicenseAbonnement = sampleWithRequiredData;
        expectedResult = service.addLicenseAbonnementToCollectionIfMissing([], null, licenseAbonnement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(licenseAbonnement);
      });

      it('should return initial array if no LicenseAbonnement is added', () => {
        const licenseAbonnementCollection: ILicenseAbonnement[] = [sampleWithRequiredData];
        expectedResult = service.addLicenseAbonnementToCollectionIfMissing(licenseAbonnementCollection, undefined, null);
        expect(expectedResult).toEqual(licenseAbonnementCollection);
      });
    });

    describe('compareLicenseAbonnement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLicenseAbonnement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLicenseAbonnement(entity1, entity2);
        const compareResult2 = service.compareLicenseAbonnement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLicenseAbonnement(entity1, entity2);
        const compareResult2 = service.compareLicenseAbonnement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLicenseAbonnement(entity1, entity2);
        const compareResult2 = service.compareLicenseAbonnement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
