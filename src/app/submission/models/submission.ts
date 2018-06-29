import { Assignment } from './assignment';

export interface Submission {
  id: number;
  name: string;
  surname: string;
  gender: string;
  fiscalcode: string;
  birthplace: string;
  birthprovince: string;
  birthdate: Date;
  com_res: string;
  prov_res: string;
  via_res: string;
  civ_res: string;
  presso: string;
    
  assigments?: Assignment[];
}
