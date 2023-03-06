import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import { AddContractPayload, GetConsultantContractsPayload, GetTeamContractPayload } from '../../../api/contract/payloads';
import { AddContractInput, GetConsultantContractsInput } from '../../../api/contract/inputs';
import { ADD_CONTRACT, GET_CONSULTANT_CAPACITY, GET_CONSULTANT_CONTRACTS, GET_TEAMCONS_CONTRACTS } from '../../../api/contract/queries';
import { Loading } from '../../Utils/Loading';
import { CalendarRow } from '../../CalendarSystem/CalendarRow';
import { ProjectDescription } from './ProjectDescription';
import { CalendarTimelineGrid } from '../../CalendarSystem/CalendarTimelineGrid';
import { ContractEventContainer } from './ContractEventContainer';
import { CalendarTimelineBackground } from '../../CalendarSystem/CalendarTimelineBackground';
import { constants } from '../../../logic/constants';
import { getDefaultNewContract } from '../../../api/contract/logic';
import { toast } from 'react-toastify';
import { defaultMessagePlacement } from '../../../logic/toast';
import { isContractValid } from '../../../logic/validationFunctions';
import { cachedDataVersionTag } from 'v8';

let arr: {} = {} ;

interface ConsultantContractRowListProps {
    consultantId: number;
}

export const ConsultantContractRowList: React.FC<ConsultantContractRowListProps> = ({ consultantId }) => {

    const { loading, error, data } = useQuery<GetTeamContractPayload, GetConsultantContractsInput>(
        GET_TEAMCONS_CONTRACTS,
        {
            variables: { id: consultantId },
            pollInterval: 3000
        }
    );

        const [addContract] = useMutation<AddContractPayload, { input: AddContractInput }>(ADD_CONTRACT, {
        refetchQueries: [
            {
                query: GET_CONSULTANT_CONTRACTS,
                variables: { id: consultantId },
            },
            {
                query: GET_CONSULTANT_CAPACITY,
                variables: { startYear: constants.currentYear, endYear: constants.currentYear + 2, id: consultantId },
            },
        ],
        awaitRefetchQueries: true,
        });

    

    const addContractWrapper = (id: number) => {
        let defaultContract = getDefaultNewContract(id);
        addContract({ variables: { input: defaultContract } })
            .then((res) => {
                toast.success('Kontrakt opprettet', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            })
            .catch((e) => {
                toast.error('Noe gikk galt ved oppretting av kontrakten', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            });
    };

    
    return (
        <>
            {!loading && !error && data ? (
                data.team[0].projects.map(
                    (project) => 
                        project.contracts.length > 0 && (
                            <CalendarRow
                                key={uuidv4()}
                                sidebarContent={<ProjectDescription project={project} consultantId={consultantId} />}
                                timelineContent={
                                    <CalendarTimelineGrid>
                                        {project.contracts.map((contract) => {
                                            return (
                                                isContractValid(contract) && (
                                                    <ContractEventContainer
                                                        contract={contract}
                                                        key={uuidv4()}
                                                        consultantId={consultantId}
                                                       
                                                    />
                                                )
                                            );
                                        })}
                                        <CalendarTimelineBackground
                                            column={1}
                                            onClick={() => addContractWrapper(project.id)}
                                            key={uuidv4()}
                                        />
                                    </CalendarTimelineGrid>
                                }
                            />
                        ) 
                )
            ) : (
                <Loading />
            )}
        </>
    );
};
