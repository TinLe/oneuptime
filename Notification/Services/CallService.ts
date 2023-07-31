import ObjectID from 'Common/Types/ObjectID';
import Phone from 'Common/Types/Phone';
import {
    CallDefaultCostInCentsPerMinute,
    TwilioAccountSid,
    TwilioAuthToken,
    TwilioPhoneNumber,
} from '../Config';
import Twilio from 'twilio';
import TwilioUtil from '../Utils/Twilio';
import CallLog from 'Model/Models/CallLog';
import CallStatus from 'Common/Types/Call/CallStatus';
import CallRequest, { GatherInput, Say } from 'Common/Types/Call/CallRequest';
import { IsBillingEnabled } from 'CommonServer/Config';
import CallLogService from 'CommonServer/Services/CallLogService';
import ProjectService from 'CommonServer/Services/ProjectService';
import Project from 'Model/Models/Project';
import NotificationService from 'CommonServer/Services/NotificationService';
import logger from 'CommonServer/Utils/Logger';
import { CallInstance } from 'twilio/lib/rest/api/v2010/account/call';
import JSONWebToken from 'CommonServer/Utils/JsonWebToken';
import OneUptimeDate from 'Common/Types/Date';
import JSONFunctions from 'Common/Types/JSONFunctions';
import UserOnCallLogTimelineService from 'CommonServer/Services/UserOnCallLogTimelineService';
import UserNotificationStatus from 'Common/Types/UserNotification/UserNotificationStatus';

export default class CallService {
    public static async makeCall(
        callRequest: CallRequest,
        options: {
            projectId?: ObjectID | undefined; // project id for sms log
            from: Phone; // from phone number
            isSensitive?: boolean; // if true, message will not be logged
            userOnCallLogTimelineId?: ObjectID | undefined; // user notification log timeline id
        }
    ): Promise<void> {
        TwilioUtil.checkEnvironmentVariables();

        const client: Twilio.Twilio = Twilio(TwilioAccountSid, TwilioAuthToken);

        const callLog: CallLog = new CallLog();
        callLog.toNumber = callRequest.to;
        callLog.fromNumber = options.from || new Phone(TwilioPhoneNumber);
        callLog.callData =
            options && options.isSensitive
                ? { message: 'This call is sensitive and is not logged' }
                : JSON.parse(JSON.stringify(callRequest));
        callLog.callCostInUSDCents = 0;

        if (options.projectId) {
            callLog.projectId = options.projectId;
        }

        let project: Project | null = null;

        try {
            // make sure project has enough balance.

            if (options.projectId && IsBillingEnabled) {
                project = await ProjectService.findOneById({
                    id: options.projectId,
                    select: {
                        smsOrCallCurrentBalanceInUSDCents: true,
                        enableCallNotifications: true,
                        lowCallAndSMSBalanceNotificationSentToOwners: true,
                        name: true,
                        notEnabledSmsOrCallNotificationSentToOwners: true,
                    },
                    props: {
                        isRoot: true,
                    },
                });

                if (!project) {
                    callLog.status = CallStatus.Error;
                    callLog.statusMessage = `Project ${options.projectId.toString()} not found.`;
                    await CallLogService.create({
                        data: callLog,
                        props: {
                            isRoot: true,
                        },
                    });
                    return;
                }

                if (!project.enableCallNotifications) {
                    callLog.status = CallStatus.Error;
                    callLog.statusMessage = `Call notifications are not enabled for this project. Please enable Call notifications in Project Settings.`;

                    await CallLogService.create({
                        data: callLog,
                        props: {
                            isRoot: true,
                        },
                    });

                    if (!project.notEnabledSmsOrCallNotificationSentToOwners) {
                        await ProjectService.updateOneById({
                            data: {
                                notEnabledSmsOrCallNotificationSentToOwners:
                                    true,
                            },
                            id: project.id!,
                            props: {
                                isRoot: true,
                            },
                        });
                        await ProjectService.sendEmailToProjectOwners(
                            project.id!,
                            'Call notifications not enabled for ' +
                                (project.name || ''),
                            `We tried to make a call to ${callRequest.to.toString()}. <br/> <br/> This Call was not sent because call notifications are not enabled for this project. Please enable call notifications in Project Settings.`
                        );
                    }
                    return;
                }

                // check if auto recharge is enabled and current balance is low.
                let updatedBalance: number =
                    project.smsOrCallCurrentBalanceInUSDCents!;
                try {
                    updatedBalance =
                        await NotificationService.rechargeIfBalanceIsLow(
                            project.id!
                        );
                } catch (err) {
                    logger.error(err);
                }

                project.smsOrCallCurrentBalanceInUSDCents = updatedBalance;

                if (!project.smsOrCallCurrentBalanceInUSDCents) {
                    callLog.status = CallStatus.LowBalance;
                    callLog.statusMessage = `Project ${options.projectId.toString()} does not have enough Call balance.`;
                    await CallLogService.create({
                        data: callLog,
                        props: {
                            isRoot: true,
                        },
                    });

                    if (!project.lowCallAndSMSBalanceNotificationSentToOwners) {
                        await ProjectService.updateOneById({
                            data: {
                                lowCallAndSMSBalanceNotificationSentToOwners:
                                    true,
                            },
                            id: project.id!,
                            props: {
                                isRoot: true,
                            },
                        });
                        await ProjectService.sendEmailToProjectOwners(
                            project.id!,
                            'Low SMS and Call Balance for ' +
                                (project.name || ''),
                            `We tried to make a call to ${callRequest.to.toString()}. This call was not made because project does not have enough balance to make calls. Current balance is ${
                                (project.smsOrCallCurrentBalanceInUSDCents ||
                                    0) / 100
                            } USD. Required balance to send this SMS should is ${
                                CallDefaultCostInCentsPerMinute / 100
                            } USD. Please enable auto recharge or recharge manually.`
                        );
                    }
                    return;
                }

                if (
                    project.smsOrCallCurrentBalanceInUSDCents <
                    CallDefaultCostInCentsPerMinute
                ) {
                    callLog.status = CallStatus.LowBalance;
                    callLog.statusMessage = `Project does not have enough balance to make this call. Current balance is ${
                        project.smsOrCallCurrentBalanceInUSDCents / 100
                    } USD. Required balance is ${
                        CallDefaultCostInCentsPerMinute / 100
                    } USD to make this call.`;
                    await CallLogService.create({
                        data: callLog,
                        props: {
                            isRoot: true,
                        },
                    });
                    if (!project.lowCallAndSMSBalanceNotificationSentToOwners) {
                        await ProjectService.updateOneById({
                            data: {
                                lowCallAndSMSBalanceNotificationSentToOwners:
                                    true,
                            },
                            id: project.id!,
                            props: {
                                isRoot: true,
                            },
                        });
                        await ProjectService.sendEmailToProjectOwners(
                            project.id!,
                            'Low SMS and Call Balance for ' +
                                (project.name || ''),
                            `We tried to make a call to ${callRequest.to.toString()}. This call was not made because project does not have enough balance to make a call. Current balance is ${
                                project.smsOrCallCurrentBalanceInUSDCents / 100
                            } USD. Required balance is ${
                                CallDefaultCostInCentsPerMinute / 100
                            } USD to make this call. Please enable auto recharge or recharge manually.`
                        );
                    }
                    return;
                }
            }

            const twillioCall: CallInstance = await client.calls.create({
                twiml: this.generateTwimlForCall(callRequest),
                to: callRequest.to.toString(),
                from:
                    options && options.from
                        ? options.from.toString()
                        : TwilioPhoneNumber.toString(), // From a valid Twilio number
            });

            callLog.status = CallStatus.Success;
            callLog.statusMessage = 'Call ID: ' + twillioCall.sid;

            if (IsBillingEnabled && project) {
                callLog.callCostInUSDCents = CallDefaultCostInCentsPerMinute;

                if (twillioCall && parseInt(twillioCall.duration) > 60) {
                    callLog.callCostInUSDCents = Math.ceil(
                        Math.ceil(parseInt(twillioCall.duration) / 60) *
                            CallDefaultCostInCentsPerMinute
                    );
                }

                project.smsOrCallCurrentBalanceInUSDCents = Math.floor(
                    project.smsOrCallCurrentBalanceInUSDCents! -
                        CallDefaultCostInCentsPerMinute
                );

                await ProjectService.updateOneById({
                    data: {
                        smsOrCallCurrentBalanceInUSDCents:
                            project.smsOrCallCurrentBalanceInUSDCents,
                        notEnabledSmsOrCallNotificationSentToOwners: false, // reset this flag
                    },
                    id: project.id!,
                    props: {
                        isRoot: true,
                    },
                });
            }
        } catch (e: any) {
            callLog.callCostInUSDCents = 0;
            callLog.status = CallStatus.Error;
            callLog.statusMessage =
                e && e.message ? e.message.toString() : e.toString();
        }

        if (options.projectId) {
            await CallLogService.create({
                data: callLog,
                props: {
                    isRoot: true,
                },
            });
        }

        if (options.userOnCallLogTimelineId) {
            await UserOnCallLogTimelineService.updateOneById({
                data: {
                    status:
                        callLog.status === CallStatus.Success
                            ? UserNotificationStatus.Sent
                            : UserNotificationStatus.Error,
                    statusMessage: callLog.statusMessage!,
                },
                id: options.userOnCallLogTimelineId,
                props: {
                    isRoot: true,
                },
            });
        }
    }

    public static generateTwimlForCall(callRequest: CallRequest): string {
        const response: Twilio.twiml.VoiceResponse =
            new Twilio.twiml.VoiceResponse();

        for (const item of callRequest.data) {
            if ((item as Say).sayMessage) {
                response.say((item as Say).sayMessage);
            }

            if ((item as GatherInput) && (item as GatherInput).numDigits > 0) {
                response.say((item as GatherInput).introMessage);

                response.gather({
                    numDigits: (item as GatherInput).numDigits,
                    timeout: (item as GatherInput).timeoutInSeconds || 5,
                    action: (item as GatherInput).responseUrl
                        .addQueryParam(
                            'token',
                            JSONWebToken.signJsonPayload(
                                JSONFunctions.serialize(
                                    (item as GatherInput)
                                        .onInputCallRequest as any
                                ),
                                OneUptimeDate.getDayInSeconds()
                            )
                        )
                        .toString(),
                    method: 'POST',
                });

                response.say((item as GatherInput).noInputMessage);
            }
        }

        response.hangup();

        return response.toString();
    }
}
