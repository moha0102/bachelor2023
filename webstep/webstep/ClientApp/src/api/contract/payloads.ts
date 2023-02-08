import { Project } from '../../logic/interfaces';
import { Vacancy, ConsultantCapacity } from './types';

// Custom base interfaces for contract/consultant api calls
export interface Consultant {
    id: number;
    projects: Project[];
    firstName: string;
    lastName: string;
    employmentDate: string;
    resignationDate?: any;
    workdays: number;
}

export interface GetConsultantCapacityPayload {
    consultantsCapacity: { items: ConsultantCapacity[] };
}

export interface GetConsultantVacancyPayload {
    consultant: [
        {
            vacancies: Vacancy[];
        }
    ];
}

export interface GetConsultantContractsPayload {
    consultant: Consultant[];
}

export interface EditContractPayload {
    contract: { id: number };
}

export interface GetConsultantIDsPayload {
    consultants: { items: [{ id: number }] };
}

export interface AddProjectPayload {
    addProject: { project: { id: number } };
}

export interface EditProjectPayload {
    editProject: { project: { id: number } };
}

export interface AddContractPayload {
    contract: { id: number };
}

export interface EditVacancyPayload {
    vacancy: { id: number };
}

export interface AddVacancyPayload {
    vacancy: { id: number };
}