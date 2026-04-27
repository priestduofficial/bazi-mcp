import { Router } from 'express';
import { getBaziDetail, getChineseCalendar, getSolarTimes } from '../index.js';
import { handleApiError, sendSuccess } from './response.js';
import { baziDetailRequestSchema, chineseCalendarQuerySchema, solarTimesRequestSchema } from './schemas.js';

const serviceVersion = '0.1.0';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'bazi-mcp-api',
    version: serviceVersion,
  });
});

apiRouter.post('/api/bazi/detail', async (req, res) => {
  try {
    const input = baziDetailRequestSchema.parse(req.body);
    const result = await getBaziDetail(input);
    return sendSuccess(res, result);
  } catch (error) {
    return handleApiError(res, error);
  }
});

apiRouter.post('/api/bazi/solar-times', async (req, res) => {
  try {
    const input = solarTimesRequestSchema.parse(req.body);
    const result = await getSolarTimes(input);
    return sendSuccess(res, result);
  } catch (error) {
    return handleApiError(res, error);
  }
});

apiRouter.get('/api/calendar/chinese', (req, res) => {
  try {
    const input = chineseCalendarQuerySchema.parse(req.query);
    const result = getChineseCalendar(input.solarDatetime);
    return sendSuccess(res, result);
  } catch (error) {
    return handleApiError(res, error);
  }
});
