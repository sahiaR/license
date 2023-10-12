import dayjs from 'dayjs/esm';

export interface ILicenseAbonnement {
  id: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  societe?: string | null;
  nombreDUtilisateur?: number | null;
}

export type NewLicenseAbonnement = Omit<ILicenseAbonnement, 'id'> & { id: null };
