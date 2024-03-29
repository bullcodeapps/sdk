import { formatRelative, format, parseISO } from 'date-fns';
import { StringSchema } from 'yup';

import { isValidCPF, isValidCNPJ } from '@brazilian-utils/brazilian-utils';

export type WeekDays = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/*
 * Get the next available day based on week day
 */
export const getNextAvailableDay = (weekDay: WeekDays) => {
  var now = new Date();
  now.setDate(now.getDate() + ((weekDay + (7 - now.getDay())) % 7));
  return now;
};

export const delay = (ms: number) => new Promise<void>((resolve, reject) => setTimeout(resolve, ms));

export function currencyFormat(amount: number, decimalCount = 2, decimal = ',', thousands = '.') {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';

    let i = parseInt(Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return `R$ ${negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount
        ? decimal +
        Math.abs(amount - Number(i))
          .toFixed(decimalCount)
          .slice(2)
        : '')
      }`;
  } catch (e) {
    console.log(e);
    return 'Valor inválido';
  }
}

export type UnitSystemType = 'metric' | 'imperial';
export enum UnitSystem {
  METRIC = 'metric',
  IMPERIAL = 'imperial',
}

export enum MetricUnitName {
  MILIMITER = 'mm',
  CENTIMETER = 'cm',
  METER = 'm',
  KILOMETER = 'km',
  MEGAMETERS = 'Mm',
}

export enum ImperialUnitName {
  INCH = 'in',
  FOOT = 'ft',
  YARD = 'yd',
  MILE = 'mi',
  NAUTICAL_MILE = 'nm',
}

export enum MetricUnitLevel {
  MILIMITER,
  CENTIMETER,
  METER,
  KILOMETER,
  MEGAMETERS,
}

export enum ImperialUnitLevel {
  INCH,
  FOOT,
  YARD,
  MILE,
  NAUTICAL_MILE,
}

export type UnitLevels = MetricUnitLevel | ImperialUnitLevel;

export function distanceFormat(value: number, level: UnitLevels = MetricUnitLevel.CENTIMETER, unitSystem: UnitSystemType = 'metric') {
  let unit;
  if (unitSystem === UnitSystem?.METRIC) {
    unit = Object.values(MetricUnitName)[level];
  } else {
    unit = Object.values(ImperialUnitName)[level];
  }
  return unit === UnitSystem?.METRIC ? `${value} ${unit}` : `${value} ${unit}`;
}

const patterns = [
  /(Z)$/, // Z
  /([+-])(\d{2})$/, // ±hh
  /([+-])(\d{2}):?(\d{2})$/, // ±hh:mm or ±hhmm
  /(UTC|(?:[a-zA-Z]+\/[a-zA-Z_]+(?:\/[a-zA-Z_]+)?))$/, // IANA time zone
];

/**
* Returns true if it matches any of the time zone offset formats
*
* @param {string} timezoneString
* @returns {boolean}
*/
function hasTimezone(timezoneString: string) {
  return patterns.some((pattern) => pattern.exec(timezoneString));
}

/**
 * This function assumes that an input with a time zone has to be treated as UTC.
 * This is helpful to correct dates stored in database with the wrong time zone.
 *
 * @param {string} dateStr
 * @returns {Date} date object with the adjustments from the target time zone
 */
export function utcDate(dateStr: string): Date {
  const ts = Date.parse(dateStr);
  if (!ts) {
    throw new Error('Invalid Date');
  }

  const date = new Date(ts);
  if (hasTimezone(dateStr)) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 6e4);
  }

  return date;
}

export const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const uncapitalizeFirstLetter = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

export function getFirstWord(str: string) {
  if (!str) {
    return;
  }
  const splittedStr = str?.split(' ');
  return splittedStr[0];
}

export const formatDateRelative = (date) =>
  formatRelative(date, new Date(), {
    locale: (window as any).__dateLocale__,
  });


export function formatDate(date: string, withHour?: boolean) {
  const dateFormat = withHour ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy';
  return date && format(parseISO(date), dateFormat);
}

export function formatTime(date: string) {
  return date && format(parseISO(date), 'HH:mm');
}

export function formatDateWithTime(date: string) {
  return date && format(parseISO(date), "dd/MM/yyyy 'às' HH:mm");
}

export function emptyStringToNull(value: any, originalValue: any) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return null;
  }
  return value;
}

export function numberOrUndefined(value: any, originalValue: any) {
  if (Number.isNaN(parseInt(originalValue))) {
    return undefined;
  }
  return Number(value);
}

export const LightenDarkenColor = (color: string, percent: number) => {
  color = color.replace('#', '');
  var num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
    (G < 255 ? (G < 1 ? 0 : G) : 255)
  )
    .toString(16)
    .slice(1)}`;
};

export const getValueInTwoDigitsFormat = (value) => {
  return `0${value}`.slice(-2);
};


const WEEK_DAYS = {
  0: "Domingo",
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado"
};

export const getDetailedDateString = (date: Date, weekDays: typeof WEEK_DAYS) => {
  const weekDay = weekDays[date.getDay()] || WEEK_DAYS[date.getDay()];

  const day = getValueInTwoDigitsFormat(date.getDate());
  const month = getValueInTwoDigitsFormat(date.getMonth() + 1);
  const hours = getValueInTwoDigitsFormat(date.getHours());
  const minutes = getValueInTwoDigitsFormat(date.getMinutes());

  return `${day}/${month} • ${weekDay} • ${hours}h${minutes}`;
};

/**
 * @deprecated Please always prefer using Util classes
 *
 * @param enumerator
 */
export const getEnumStringArray = (enumerator: Object) => {
  const enumSize = Object.keys(enumerator).length / 2;
  return Object.keys(enumerator).splice(enumSize, enumSize);
};

export function yupValidateCPF(message = 'CPF Inválido') {
  //@ts-ignore
  return this.test('test-cpf', message, (value, context) => {
    const { path, createError, resolve } = context;

    if (value) {
      if (!isValidCPF(value)) {
        return createError({ path, message });
      }

      return resolve(true);
    }

    return resolve(true);
  });
}

export function yupValidateCNPJ(message = 'CNPJ Inválido') {
  //@ts-ignore
  return this.test('test-cnpj', message, (value, context) => {
    const { path, createError, resolve } = context;

    if (value) {
      if (!isValidCNPJ(value)) {
        return createError({ path, message });
      }

      return resolve(true);
    }

    return resolve(true);
  });
}
