import dayjs from 'dayjs/esm';

import { ILicenseAbonnement, NewLicenseAbonnement } from './license-abonnement.model';

export const sampleWithRequiredData: ILicenseAbonnement = {
  id: 18969,
};

export const sampleWithPartialData: ILicenseAbonnement = {
  id: 20499,
  nombreDUtilisateur: 29548,
};

export const sampleWithFullData: ILicenseAbonnement = {
  id: 28237,
  startDate: dayjs('2023-10-11'),
  endDate: dayjs('2023-10-11'),
  societe: 'ha however delightfully',
  nombreDUtilisateur: 7424,
};

export const sampleWithNewData: NewLicenseAbonnement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
