import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { useMutation } from '@apollo/client';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { AddConsultantPayload, ADD_CONSULTANT } from '../../api/consultants';
import { Box, Breadcrumbs, InputAdornment, Link, OutlinedInput } from '@mui/material';
import { ModalSlett } from '../seller/SlettModal';
import { ConsultantContainer } from './ConsultantContainer';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ConsultantDisplay } from './ConsultantDisplay';
import { Form, useNavigate } from 'react-router-dom';
import { ModalConsultant } from './ModalConsultant'
import { GET_CONSULTANTS_INFO } from '../../api/contract/queries';

interface ConsultantNoId {
    firstName: string;
    lastName: string;
    employmentDate: string;
    resignationDate?: any;
    workdays: number;
}

function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}


interface ModalConsultantProps {
    onClose: () => void;
}

export const AddForm: React.FC<ModalConsultantProps> = ({onClose}) => {

    //Date shenanigans
    let d = new Date();
    //Get todays date
    let today =
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        d.getDate().toString().padStart(2, '0');

    let defaultConsultant: ConsultantNoId = {
        firstName: '',
        lastName: '',
        employmentDate: today,
        resignationDate: null,
        workdays: 0,
    };

    const outsideRef = React.useRef(null);
    const navigate = useNavigate();

    const [currentConsultant, setCurrentConsultant] = useState<ConsultantNoId>(defaultConsultant);
    const [displayValidation, setDisplayValidation] = useState<string>('');
    const [addConsultant] = useMutation<AddConsultantPayload, { input: ConsultantNoId }>(
        ADD_CONSULTANT, {
            refetchQueries: [
                {
                    query: GET_CONSULTANTS_INFO,
                },
            ],
            awaitRefetchQueries: true,
        }
    );

    //Adds or removes validation field on resignationDate depending on if its empty or not
    useEffect(() => {
        resignationDateValidationToggle();
    });

    const resignationDateValidationToggle = () => {
        let isValidatedStr = '';

        //returns true if its a valid end date, false if its not
        let isValidResignationDate = isValidEndDate(
            currentConsultant.resignationDate ? currentConsultant.resignationDate : ''
        );

        //Checks if date is not empty and is a valid endDate
        if (currentConsultant.resignationDate && currentConsultant.resignationDate !== '' && isValidResignationDate) {
            isValidatedStr = 'is-valid';
        } else if (
            currentConsultant.resignationDate &&
            currentConsultant.resignationDate !== '' &&
            !isValidResignationDate
        ) {
            isValidatedStr = 'is-invalid';
        }

        setDisplayValidation(isValidatedStr);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setCurrentConsultant((prevConsultant) => ({
            ...prevConsultant,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (isValidConsultant()) {
            addConsultant({ variables: { input: currentConsultant } })
                .then((res) => {
                    toast.success('Konsulent opprettet', {
                        position: toast.POSITION.BOTTOM_RIGHT
                    })
                    onClose();
                })
                .catch((err) => {
                    toast.error('Noe gikk galt med oppretting av en konsulent.', {
                        position: toast.POSITION.BOTTOM_RIGHT
                    })
                });
        }
    };

    const isValidText = (s: string) => {
        return s !== '';
    };

    //checks only if the start date is empty
    const isValidStartDate = (s: string) => {
        if (s === '') {
            return false;
        }
        return true;
    };

    const isValidEndDate = (s: string) => {
        if (s === '') {
            return true;
        }

        // If the startdate doesnt exist, any valid date is a valid start date
        if (currentConsultant.employmentDate === '') {
            //change to date when its ready
            return isValidText(s);
        } else {
            // assumes startdate is formatted correctly
            let tempSD = new Date(currentConsultant.employmentDate);
            // assumes enddate is formatted correctly
            let tempED = new Date(s);
            return tempED > tempSD;
        }
    };

    const isValidConsultant = (): boolean => {
        let hasTruthyValues =
            currentConsultant.firstName &&
            currentConsultant.lastName &&
            isValidStartDate(currentConsultant.employmentDate);

        let resignDate = currentConsultant.resignationDate?.toString();
        if (hasTruthyValues) {
            if (resignDate !== '') {
                return (
                    isValidText(currentConsultant.employmentDate) &&
                    isValidEndDate(currentConsultant.resignationDate ? currentConsultant.resignationDate : '')
                );
            } else {
                return isValidText(currentConsultant.employmentDate);
            }
        }
        return false;
    };

    return (
        <Box>
            <Box>
                <form>
                    <FormGroup>
                        <Label for='firstName'>Konsulent</Label><br />
                        <Input
                            type='text'
                            id='firstName'
                            valid={isValidText(currentConsultant.firstName)}
                            invalid={!isValidText(currentConsultant.firstName)}
                            value={currentConsultant.firstName}
                            onChange={handleChange}
                            name='firstName'
                        />
                    </FormGroup>
                    <FormGroup>
                    <Label for='lastName'>Etternavn</Label><br />
                        <Input
                            type='text'
                            id='lastName'
                            valid={isValidText(currentConsultant.lastName)}
                            invalid={!isValidText(currentConsultant.lastName)}
                            value={currentConsultant.lastName}
                            onChange={handleChange}
                            name='lastName'
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for='employmentDate'>Start dato:</Label>
                        <Input
                            type='date'
                            id='inpEmploymentDate'
                            valid={isValidStartDate(currentConsultant.employmentDate)}
                            invalid={!isValidStartDate(currentConsultant.employmentDate)}
                            value={currentConsultant.employmentDate}
                            onChange={handleChange}
                            name='inpEmploymentDate'
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for='resignationDate'>Slutt dato:</Label>
                        <Input
                            type='date'
                            id='inpResignationDate'
                            className={displayValidation}
                            value={currentConsultant.resignationDate ? currentConsultant.resignationDate : ''}
                            onChange={handleChange}
                            name='inpResignationDate'
                        />
                    </FormGroup>

                    <Button color='primary' onClick={ handleSubmit } disabled={!isValidConsultant()}>
                        Legg til
                    </Button>
                </form>


            </Box>
        </Box>
    );

}