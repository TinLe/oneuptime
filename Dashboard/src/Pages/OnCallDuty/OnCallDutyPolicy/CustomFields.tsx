import Route from 'Common/Types/API/Route';
import ModelPage from 'CommonUI/src/Components/Page/ModelPage';
import React, { FunctionComponent, ReactElement } from 'react';
import PageMap from '../../../Utils/PageMap';
import RouteMap, { RouteUtil } from '../../../Utils/RouteMap';
import PageComponentProps from '../../PageComponentProps';
import SideMenu from './SideMenu';
import Navigation from 'CommonUI/src/Utils/Navigation';
import ObjectID from 'Common/Types/ObjectID';
import CustomFieldsDetail from 'CommonUI/src/Components/CustomFields/CustomFieldsDetail';
import OnCallDutyPolicy from 'Model/Models/OnCallDutyPolicy';
import OnCallDutyPolicyCustomField from 'Model/Models/OnCallDutyPolicyCustomField';
import ProjectUtil from 'CommonUI/src/Utils/Project';

const OnCallDutyPolicyCustomFields: FunctionComponent<PageComponentProps> = (
    _props: PageComponentProps
): ReactElement => {
    const modelId: ObjectID = Navigation.getLastParamAsObjectID(1);

    return (
        <ModelPage
            title="On-Call Policy"
            modelType={OnCallDutyPolicy}
            modelId={modelId}
            modelNameField="name"
            breadcrumbLinks={[
                {
                    title: 'Project',
                    to: RouteUtil.populateRouteParams(
                        RouteMap[PageMap.HOME] as Route,
                        { modelId }
                    ),
                },
                {
                    title: 'On-Call Duty',
                    to: RouteUtil.populateRouteParams(
                        RouteMap[PageMap.ON_CALL_DUTY] as Route,
                        { modelId }
                    ),
                },
                {
                    title: 'View On-Call Policy',
                    to: RouteUtil.populateRouteParams(
                        RouteMap[PageMap.ON_CALL_DUTY_POLICY_VIEW] as Route,
                        { modelId }
                    ),
                },
                {
                    title: 'Custom Fields',
                    to: RouteUtil.populateRouteParams(
                        RouteMap[
                            PageMap.ON_CALL_DUTY_POLICY_VIEW_CUSTOM_FIELDS
                        ] as Route,
                        { modelId }
                    ),
                },
            ]}
            sideMenu={<SideMenu modelId={modelId} />}
        >
            <CustomFieldsDetail
                title="Custom Fields"
                description="Custom fields help you add new fields to your resources in OneUptime."
                modelType={OnCallDutyPolicy}
                customFieldType={OnCallDutyPolicyCustomField}
                name="Custom Fields"
                projectId={ProjectUtil.getCurrentProject()!.id!}
                modelId={modelId}
            />
        </ModelPage>
    );
};

export default OnCallDutyPolicyCustomFields;
