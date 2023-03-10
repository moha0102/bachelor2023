import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { EditProspectInput } from '../../../api/prospects/inputs';
import { EditProspectPayload } from '../../../api/prospects/payloads';
import { EDIT_PROSPECT, GET_SELLER_PROSPECTS } from '../../../api/prospects/queries';
import { Prospect } from '../../../logic/interfaces';
import { defaultMessagePlacement } from '../../../logic/toast';
import { EditableField } from '../../Utils/EditableField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProspectDescriptionProps {
    prospect: Prospect;
    sellerId: number;
}

const contentStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRight: '1px solid',
    padding: '0px 15px 0px 15px',
    height: '100%',
    fontSize: 12,
    backgroundImage: 'linear-gradient(to right, white , #f8f9f9)',
    overflow: 'hidden',
    boxsizing: 'content-box'
};

const centeredSpan = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
};

export const ProspectDescription: React.FC<ProspectDescriptionProps> = ({ prospect, sellerId }) => {
    const [editProspect] = useMutation<EditProspectPayload, { input: EditProspectInput }>(EDIT_PROSPECT, {
        refetchQueries: [
            {
                query: GET_SELLER_PROSPECTS,
                variables: { id: sellerId },
            },
        ],
        awaitRefetchQueries: true,
    });

    const editFunctionWrapper = (p: Prospect) => {
        let input: EditProspectInput = { id: p.id, customerName: p.customerName, projectName: p.projectName };
        editProspect({ variables: { input: input } })
            .then((res) => {
                toast.success('Prospektet ble redigert', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            })
            .catch((e) => {
                toast.error('Noe gikk galt ved redigering av prospektet', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            });
    };
    return (
        <div style={contentStyle}>
            <div>
                <span style={centeredSpan}>Kunde:</span>
                <span style={centeredSpan}>
                    <EditableField
                        objectToEdit={prospect}
                        fieldName={'customerName'}
                        fieldToEdit={prospect.customerName}
                        editCallBack={editFunctionWrapper}
                        width={70}
                    />
                </span>
            </div>

            <div>
                <span style={centeredSpan}>Prosjekt:</span>
                <span style={centeredSpan}>
                    {' '}
                    <EditableField
                        objectToEdit={prospect}
                        fieldName={'projectName'}
                        fieldToEdit={prospect.projectName}
                        editCallBack={editFunctionWrapper}
                        width={70}
                    />
                </span>
            </div>
        </div>
    );
};
