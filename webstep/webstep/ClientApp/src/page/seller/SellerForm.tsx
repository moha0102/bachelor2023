import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { AddSellerPayload, ADD_SELLER } from '../../api/sellers';
import { useMutation } from '@apollo/client';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { Modal } from '../Utils/ModalComponent';
import './Seller.css'
import { Prospects, SellerInterface, SellerContainer } from './SellerContainer';
import { ModalSlett } from './SlettModal';

interface SellerNoId {
    fullName: string;
    email: string;
    employmentDate: string;
    resignationDate?: any;
}

interface Selger {
    seller: SellerInterface;
    refetch: () => {};
    prospects: Prospects[];
}

export const SellerForm: React.FC<Selger> = ({ seller, refetch, prospects }) => {
    const [isModalOpen, setModalState] = React.useState(false);

    const toggleModal = () => setModalState(!isModalOpen);

    //Date shenanigans
    let d = new Date();
    //Get todays date
    let today =
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        d.getDate().toString().padStart(2, '0');

    // you dont put id yourself
    let defaultSeller: SellerNoId = {
        fullName: '',
        email: '',
        employmentDate: today,
        resignationDate: null,
    };

    const [currentSeller, setCurrentSeller] = useState<SellerNoId>(defaultSeller);
    const [displayValidation, setDisplayValidation] = useState<string>('');
    const [addSeller] = useMutation<AddSellerPayload, { input: SellerNoId }>(ADD_SELLER);

    //Adds or removes validation field on resignationDate depending on if its empty or not
    useEffect(() => {
        resignationDateValidationToggle();
    });

    const resignationDateValidationToggle = () => {
        let isValidatedStr = '';

        //returns true if its a valid end date, false if its not
        let isValidResignationDate = isValidEndDate(currentSeller.resignationDate ? currentSeller.resignationDate : '');

        //Checks if date is not empty and is a valid endDate
        if (currentSeller.resignationDate && currentSeller.resignationDate !== '' && isValidResignationDate) {
            isValidatedStr = 'is-valid';
        } else if (currentSeller.resignationDate && currentSeller.resignationDate !== '' && !isValidResignationDate) {
            isValidatedStr = 'is-invalid';
        }

        setDisplayValidation(isValidatedStr);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setCurrentSeller((prevSeller) => ({
            ...prevSeller,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (isValidSeller()) {
            // console.log(currentSeller);
            addSeller({ variables: { input: currentSeller } })
                .then((res) => {
                    refetch();
                    toast.success('Selger opprettet', {
                        position: toast.POSITION.BOTTOM_RIGHT
                    })
                })
                .catch((err) => {
                    toast.error('Noe gikk galt med oppretting av en selger.', {
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
        if (currentSeller.employmentDate === '') {
            //change to date when its ready
            return isValidText(s);
        } else {
            // assumes startdate is formatted correctly
            let tempSD = new Date(currentSeller.employmentDate);
            // assumes enddate is formatted correctly
            let tempED = new Date(s);
            return tempED > tempSD;
        }
    };

    const isValidSeller = (): boolean => {
        let hasTruthyValues =
            currentSeller.fullName && currentSeller.email && isValidStartDate(currentSeller.employmentDate);

        let resignDate = currentSeller.resignationDate?.toString();
        if (hasTruthyValues) {
            if (resignDate !== '') {
                return (
                    isValidText(currentSeller.employmentDate) &&
                    isValidEndDate(currentSeller.resignationDate ? currentSeller.resignationDate : '')
                );
            } else {
                return isValidText(currentSeller.employmentDate);
            }
        }
        return false;
    };

    return (
            <form>
                <FormGroup>
                    <Label for='fullName'>Navn:</Label><br />
                    <Input
                        type='text'
                        id='fullName'
                        valid={isValidText(currentSeller.fullName)}
                        invalid={!isValidText(currentSeller.fullName)}
                        value={currentSeller.fullName}
                        onChange={handleChange}
                        name='fullName'
                    />
                </FormGroup>
                <FormGroup>
                    <Label for='email'>Email</Label><br />
                    <Input
                        type='text'
                        id='email'
                        valid={isValidText(currentSeller.email)}
                        invalid={!isValidText(currentSeller.email)}
                        value={currentSeller.email}
                        onChange={handleChange}
                        name='email'
                    />
                </FormGroup>

                <FormGroup>
                    <Label for='employmentDate'>Start dato</Label><br />
                    <Input
                        type='date'
                        id='employmentDate'
                        valid={isValidStartDate(currentSeller.employmentDate)}
                        invalid={!isValidStartDate(currentSeller.employmentDate)}
                        value={currentSeller.employmentDate}
                        onChange={handleChange}
                        name='employmentDate'
                    />
                </FormGroup>

                <FormGroup>
                    <Label for='resignationDate'>Slutt dato</Label><br />
                    <Input
                        type='date'
                        id='resignationDate'
                        className={displayValidation}
                        value={currentSeller.resignationDate ? currentSeller.resignationDate : ''}
                        onChange={handleChange}
                        name='resignationDate'
                    />
                </FormGroup>

                <div className='formButtons'>
                <Button id='btnB' onClick={handleSubmit} disabled={!isValidSeller()}>
                    Legg til
                </Button>
                
                </div>
            </form> );}