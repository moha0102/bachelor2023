import { gql } from '@apollo/client';

export const GET_CONSULTANT_CAPACITY = gql`
    query GetConsultantCapacity($startYear: Int!, $endYear: Int!, $id: Int!) {
        consultantsCapacity(startYear: $startYear, endYear: $endYear, consultantId: $id) {
            items {
                consultant {
                    id
                    firstName
                    lastName
                    employmentDate
                    resignationDate
                    workdays
                }
                capacity {
                    week
                    days
                }
            }
        }
    }
`;

export const GET_CONSULTANT_VACANCY = gql`
    query GetConsultantVacancy($id: Int!) {
        consultant(id: $id) {
            vacancies {
                id
                daysOfWeek
                planned
                startYear
                startWeek
                endYear
                endWeek
            }
        }
    }
`;

export const GET_CONSULTANT_CONTRACTS = gql`
    query GetConsultantContracts($id: Int!) {
        consultant(id: $id) {
            id
            projects {
                id
                customerName
                projectName
                hourlyRate
                contracts {
                    id
                    startYear
                    startWeek
                    endYear
                    endWeek
                    daysOfWeek
                }
            }
            firstName
            lastName
            employmentDate
            resignationDate
            workdays
        }
    }
`;

export const GET_CONSULTANT_IDS = gql`
    query {
        consultants {
            items {
                id
            }
        }
    }
`;

export const EDIT_CONTRACT = gql`
    mutation EditContract($input: EditContractInput) {
        editContract(input: $input) {
            contract {
                id
            }
        }
    }
`;

export const DELETE_CONTRACT = gql`
    mutation DeleteContract($input: DeleteContractInput) {
        deleteContract(input: $input) {
            contract {
                id
            }
        }
    }
`;

export const ADD_PROJECT = gql`
    mutation AddProject($input: AddProjectInput) {
        addProject(input: $input) {
            project {
                id
            }
        }
    }
`;

export const EDIT_PROJECT = gql`
    mutation EditProject($input: EditProjectInput) {
        editProject(input: $input) {
            project {
                id
            }
        }
    }
`;

export const ADD_CONTRACT = gql`
    mutation AddContract($input: AddContractInput) {
        addContract(input: $input) {
            contract {
                id
            }
        }
    }
`;

export const EDIT_VACANCY = gql`
    mutation EditVacancy($input: EditVacancyInput) {
        editVacancy(input: $input) {
            vacancy {
                id
            }
        }
    }
`;

export const DELETE_VACANCY = gql`
    mutation DeleteVacancy($input: DeleteVacancyInput) {
        deleteVacancy(input: $input) {
            vacancy {
                id
            }
        }
    }
`;

export const ADD_VACANCY = gql`
    mutation AddVacancy($input: AddVacancyInput) {
        addVacancy(input: $input) {
            vacancy {
                id
            }
        }
    }
`;