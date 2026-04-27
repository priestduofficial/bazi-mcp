import { z } from 'zod';

const isoDatetimeSchema = z
  .string()
  .trim()
  .min(1, 'solarDatetime is required.')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'solarDatetime must be a valid ISO datetime.');

const lunarDatetimeSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{2}:\d{2}$/, 'lunarDatetime must use YYYY-MM-DD HH:mm:ss format.');

export const baziDetailRequestSchema = z
  .object({
    solarDatetime: isoDatetimeSchema.optional(),
    lunarDatetime: lunarDatetimeSchema.optional(),
    gender: z.union([z.literal(0), z.literal(1)]).default(1),
    eightCharProviderSect: z.union([z.literal(1), z.literal(2)]).default(2),
  })
  .strict()
  .superRefine((data, ctx) => {
    const hasSolarDatetime = Boolean(data.solarDatetime);
    const hasLunarDatetime = Boolean(data.lunarDatetime);

    if (hasSolarDatetime === hasLunarDatetime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide one and only one of solarDatetime or lunarDatetime.',
        path: ['solarDatetime'],
      });
    }
  });

export const solarTimesRequestSchema = z
  .object({
    bazi: z
      .string()
      .trim()
      .min(1, 'bazi is required.')
      .refine((value) => value.split(/\s+/).length === 4, 'bazi must contain four pillars separated by spaces.'),
  })
  .strict();

export const chineseCalendarQuerySchema = z
  .object({
    solarDatetime: isoDatetimeSchema.optional(),
  })
  .strict();
