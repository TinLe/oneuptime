import EmptyResponseData from 'Common/Types/API/EmptyResponse';
import HTTPResponse from 'Common/Types/API/HTTPResponse';
import Route from 'Common/Types/API/Route';
import URL from 'Common/Types/API/URL';
import { JSONObject } from 'Common/Types/JSON';
import API from 'Common/Utils/API';
import { NotificationHostname } from '../Config';
import Protocol from 'Common/Types/API/Protocol';
import ClusterKeyAuthorization from '../Middleware/ClusterKeyAuthorization';
import Phone from 'Common/Types/Phone';
import ObjectID from 'Common/Types/ObjectID';
import SMS from 'Common/Types/SMS/SMS';

export default class SmsService {
    public static async sendSms(
        sms: SMS,
        options: {
            projectId?: ObjectID | undefined; // project id for sms log
            from?: Phone; // from phone number
            isSensitive?: boolean; // if true, message will not be logged
            userNotificationLogTimelineId?: ObjectID;
        }
    ): Promise<HTTPResponse<EmptyResponseData>> {
        const body: JSONObject = {
            to: sms.to.toString(),
            message: sms.message,
            from: options.from?.toString(),
            projectId: options.projectId?.toString(),
            isSensitive: options.isSensitive,
            userNotificationLogTimelineId:
                options.userNotificationLogTimelineId?.toString(),
        };

        return await API.post<EmptyResponseData>(
            new URL(
                Protocol.HTTP,
                NotificationHostname,
                new Route('/sms/send')
            ),
            body,
            {
                ...ClusterKeyAuthorization.getClusterKeyHeaders(),
            }
        );
    }
}
