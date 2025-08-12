import { FastifyReply } from 'fastify';
import * as prettier from 'prettier';
import FormData from 'form-data';
import axios from 'axios';
import { BackendAPIError } from '../api/HTTPClient.js';
export default class ErrorHandler {
  static async sendErrorResponse(err: BackendAPIError, reply: FastifyReply) {
    const statusCode = typeof err.statusCode == 'number' ? err.statusCode : 503;
    const responseBody =
      statusCode !== 503
        ? err.data
        : {
            error: {
              description: 'The service is currently unavailable',
            },
          };
    if (statusCode === 503) {
      console.log('503 mapped error', err);
    }
    reply.code(statusCode).send(responseBody);

    return;
  }
  static isJSON(str: string) {
    try {
      const obj = JSON.parse(str);
      return typeof obj === 'object' && obj !== null;
    } catch (error) {
      return false;
    }
  }

  static slackMapping = (resObj: any, type: 'error' | 'success') => {
    const request = resObj.config;
    const keysToRemove = ['Accept', 'Content-Type', 'priority'];
    if (request.headers !== undefined) {
      keysToRemove.forEach(key => {
        if (request.headers) delete request.headers[key];
      });
    }
    return {
      request: type === 'success' ? resObj.statusText : resObj.response?.statusText,
      requestUrl: resObj.config.baseURL ? resObj.config.baseURL + resObj.config.url : null,
      requestMethod: resObj.config.method?.toUpperCase(),
      statusCode: type === 'success' ? resObj.status : resObj.response!.status,
      requestHeaders: JSON.stringify(request.headers),
      requestBody: request.data,
      responseBody: JSON.stringify(type === 'success' ? resObj.data : resObj.response?.data),
    };
  };

  static prettifyStringValues(obj: any): any {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        try {
          obj[key] = JSON.parse(obj[key]);
          obj[key] = this.prettifyStringValues(obj[key]);
        } catch (error) {
          // Not a valid JSON string, continue
        }
      } else if (typeof obj[key] === 'object') {
        obj[key] = this.prettifyStringValues(obj[key]);
      }
    }
    return obj;
  }
  /**
   *
   * @param error
   * @param initial_comment
   * @returns
   */
  static async uploadFileSlack(error: any, initial_comment: string, CHANNEL_ID: string) {
    const prettifiedObject = this.prettifyStringValues(error);
    const fileContents = await prettier.format(JSON.stringify(prettifiedObject, null, 4), { parser: 'json' });
    const formData = new FormData();
    const now = new Date();
    const timestamp = now.toISOString().replace(/:/g, '-');
    const filename = `log_${timestamp}.json`;
    formData.append('file', Buffer.from(fileContents), { filename });
    if (error.request) {
      initial_comment = `*REQUEST*: ${error.request}\n`;
      initial_comment += `*URL* : ${error.requestUrl}\n`;
      initial_comment += `*METHOD* : ${error.requestMethod}\n`;
      initial_comment += `*CODE* : ${error.statusCode}\n`;
    }
    formData.append('initial_comment', initial_comment);
    formData.append('channels', CHANNEL_ID);

    // Upload the file to Slack
    const response = await axios.post('https://slack.com/api/files.upload', formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
    });
    return response;
  }
  /**
   *
   * @param errorMessage
   * @param error
   * @param isSuccessLog
   */
  static async logToSlack(errorMessage: string, error: any, isSuccessLog = false) {
    try {
      const SLACK_ERROR_CHANNEL_ID = process.env.SLACK_ERROR_CHANNEL_ID;
      const SLACK_ALL_LOGS_CHANNEL_ID = process.env.SLACK_ALL_LOGS_CHANNEL_ID;
      console.info(`SLACK_ERROR_CHANNEL_ID:${SLACK_ERROR_CHANNEL_ID}`);
      console.info(`SLACK_ALL_LOGS_CHANNEL_ID:${SLACK_ALL_LOGS_CHANNEL_ID}`);
      console.info(`SLACK_BOT_TOKEN:${process.env.SLACK_BOT_TOKEN}`);
      if (!!SLACK_ERROR_CHANNEL_ID && !isSuccessLog) {
        await ErrorHandler.uploadFileSlack(error, errorMessage, SLACK_ERROR_CHANNEL_ID);
      }
      if (!!SLACK_ALL_LOGS_CHANNEL_ID) {
        await ErrorHandler.uploadFileSlack(error, errorMessage, SLACK_ALL_LOGS_CHANNEL_ID);
      }
    } catch (slackError) {
      console.error('Error posting to Slack:', slackError);
    }
  }

  static async logSdkSourceToSlack({
    mid,
    publicKey,
    sdkSource,
    host,
    client,
  }: {
    mid: string;
    publicKey: string;
    sdkSource: string;
    host: string;
    client: string;
  }) {
    try {
      const title = 'Card Integration';
      const message =
        '*Details*' +
        '```' +
        `Public Key: ${publicKey}` +
        `\nMerchant ID: ${mid}` +
        `\nSource : ${sdkSource}` +
        `\nHost : ${host}` +
        `\nClient : ${client}` +
        `\nSERVER TIME: ${new Date().toLocaleString()}` +
        '```';

      await axios.post('https://hooks.slack.com/services/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', {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: title,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: message,
            },
          },
        ],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while sending message to slack', error);
    }
  }
}
