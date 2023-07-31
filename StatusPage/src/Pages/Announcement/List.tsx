import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState,
} from 'react';
import PageComponentProps from '../PageComponentProps';
import Page from '../../Components/Page/Page';
import URL from 'Common/Types/API/URL';
import JSONFunctions from 'Common/Types/JSONFunctions';
import PageLoader from 'CommonUI/src/Components/Loader/PageLoader';
import BaseAPI from 'CommonUI/src/Utils/API/API';
import { DASHBOARD_API_URL } from 'CommonUI/src/Config';
import useAsyncEffect from 'use-async-effect';
import { JSONArray, JSONObject } from 'Common/Types/JSON';
import ErrorMessage from 'CommonUI/src/Components/ErrorMessage/ErrorMessage';
import BadDataException from 'Common/Types/Exception/BadDataException';
import LocalStorage from 'CommonUI/src/Utils/LocalStorage';
import ObjectID from 'Common/Types/ObjectID';
import EventHistoryList, {
    ComponentProps as EventHistoryListComponentProps,
} from 'CommonUI/src/Components/EventHistoryList/EventHistoryList';
import { ComponentProps as EventHistoryDayListComponentProps } from 'CommonUI/src/Components/EventHistoryList/EventHistoryDayList';
import StatusPageResource from 'Model/Models/StatusPageResource';
import OneUptimeDate from 'Common/Types/Date';
import Dictionary from 'Common/Types/Dictionary';
import StatusPageAnnouncement from 'Model/Models/StatusPageAnnouncement';
import HTTPResponse from 'Common/Types/API/HTTPResponse';
import { getAnnouncementEventItem } from './Detail';
import Route from 'Common/Types/API/Route';
import EmptyState from 'CommonUI/src/Components/EmptyState/EmptyState';
import IconProp from 'Common/Types/Icon/IconProp';
import RouteMap, { RouteUtil } from '../../Utils/RouteMap';
import PageMap from '../../Utils/PageMap';
import API from '../../Utils/API';
import StatusPageUtil from '../../Utils/StatusPage';
import HTTPErrorResponse from 'Common/Types/API/HTTPErrorResponse';

const Overview: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [_statusPageResources, setStatusPageResources] = useState<
        Array<StatusPageResource>
    >([]);
    const [announcements, setAnnouncements] = useState<
        Array<StatusPageAnnouncement>
    >([]);
    const [parsedData, setParsedData] =
        useState<EventHistoryListComponentProps | null>(null);

    StatusPageUtil.checkIfUserHasLoggedIn();

    useAsyncEffect(async () => {
        try {
            if (!StatusPageUtil.getStatusPageId()) {
                return;
            }
            setIsLoading(true);

            const id: ObjectID = LocalStorage.getItem(
                'statusPageId'
            ) as ObjectID;
            if (!id) {
                throw new BadDataException('Status Page ID is required');
            }
            const response: HTTPResponse<JSONObject> =
                await BaseAPI.post<JSONObject>(
                    URL.fromString(DASHBOARD_API_URL.toString()).addRoute(
                        `/status-page/announcements/${id.toString()}`
                    ),
                    {},
                    API.getDefaultHeaders(StatusPageUtil.getStatusPageId()!)
                );
            const data: JSONObject = response.data;

            const announcements: Array<StatusPageAnnouncement> =
                JSONFunctions.fromJSONArray(
                    (data['announcements'] as JSONArray) || [],
                    StatusPageAnnouncement
                );
            const statusPageResources: Array<StatusPageResource> =
                JSONFunctions.fromJSONArray(
                    (data['statusPageResources'] as JSONArray) || [],
                    StatusPageResource
                );

            // save data. set()

            setAnnouncements(announcements);
            setStatusPageResources(statusPageResources);

            setIsLoading(false);
            props.onLoadComplete();
        } catch (err) {
            if (err instanceof HTTPErrorResponse) {
                StatusPageUtil.checkIfTheUserIsAuthenticated(err);
            }
            setError(BaseAPI.getFriendlyMessage(err));
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoading) {
            // parse data;
            setParsedData(null);
            return;
        }

        const eventHistoryListComponentProps: EventHistoryListComponentProps = {
            items: [],
        };

        const days: Dictionary<EventHistoryDayListComponentProps> = {};

        for (const announcement of announcements) {
            const dayString: string = OneUptimeDate.getDateString(
                announcement.showAnnouncementAt!
            );

            if (!days[dayString]) {
                days[dayString] = {
                    date: announcement.showAnnouncementAt!,
                    items: [],
                };
            }

            days[dayString]?.items.push(
                getAnnouncementEventItem(
                    announcement,
                    Boolean(StatusPageUtil.isPreviewPage()),
                    true
                )
            );
        }

        for (const key in days) {
            eventHistoryListComponentProps.items.push(
                days[key] as EventHistoryDayListComponentProps
            );
        }

        setParsedData(eventHistoryListComponentProps);
    }, [isLoading]);

    if (isLoading) {
        return <PageLoader isVisible={true} />;
    }

    if (error) {
        return <ErrorMessage error={error} />;
    }

    if (!parsedData) {
        return <PageLoader isVisible={true} />;
    }

    return (
        <Page
            title="Announcements"
            breadcrumbLinks={[
                {
                    title: 'Overview',
                    to: RouteUtil.populateRouteParams(
                        StatusPageUtil.isPreviewPage()
                            ? (RouteMap[PageMap.PREVIEW_OVERVIEW] as Route)
                            : (RouteMap[PageMap.OVERVIEW] as Route)
                    ),
                },
                {
                    title: 'Announcements',
                    to: RouteUtil.populateRouteParams(
                        StatusPageUtil.isPreviewPage()
                            ? (RouteMap[
                                  PageMap.PREVIEW_ANNOUNCEMENT_LIST
                              ] as Route)
                            : (RouteMap[PageMap.ANNOUNCEMENT_LIST] as Route)
                    ),
                },
            ]}
        >
            {announcements && announcements.length > 0 ? (
                <EventHistoryList {...parsedData} />
            ) : (
                <></>
            )}

            {announcements.length === 0 ? (
                <EmptyState
                    title={'No Announcements'}
                    description={'No announcements posted so far on this page.'}
                    icon={IconProp.Announcement}
                />
            ) : (
                <></>
            )}
        </Page>
    );
};

export default Overview;
