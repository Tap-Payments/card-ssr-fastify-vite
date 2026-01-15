import { FastifyReply } from 'fastify';
import { BackendAPIError } from '../api/HTTPClient';
import axios from 'axios';
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
   */
  static async logToSlack(error: any) {
    try {
      const SLACK_ERROR_WEBHOOK_URL = process.env.SLACK_ALERTS_WEBHOOK_URL;
      console.info(`SLACK_ERROR_WEBHOOK_URL:${SLACK_ERROR_WEBHOOK_URL}`);
      if (!!SLACK_ERROR_WEBHOOK_URL) {
        let errorTtile = '';
        let errorDetails = `SERVER TIME: ${new Date().toLocaleString()} \n`;
        if (error.request) {
          const jsonDetails = {
            headers: error.config?.headers || {},
            response: error.response?.data || {},
            request: JSON.parse(error.config?.data || {}),
            errorMessage: error.message || {},
          };
          errorTtile = 'Backend API Error :octagonal_sign:';
          errorDetails += `URL: ${error.config?.baseURL}${error.config?.url}\nMETHOD: ${error.config?.method}\n \n ${JSON.stringify(jsonDetails, null, 2)}`;
        } else {
          errorTtile = 'Server Exception Error :octagonal_sign:';
          errorDetails += `error: ${JSON.stringify(error, null, 2)}\n errorMessage: ${JSON.stringify(error.message, null, 2)}`;
        }
        await axios.post(SLACK_ERROR_WEBHOOK_URL, {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: errorTtile,
                emoji: true,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Details*\n` + '```' + errorDetails + '```',
              },
            },
          ],
        });
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
