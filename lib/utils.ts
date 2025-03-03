import { clsx, type ClassValue } from "clsx"
import ky from "ky";
import { twMerge } from "tailwind-merge"
import winston from 'winston';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const joinWithAnd = (arr: string[]) => {
  if (arr.length === 0) return '';
  if (arr.length === 1) return String(arr[0]);

  const allButLast = arr.slice(0, -1);
  const last = arr[arr.length - 1];

  return allButLast.join(', ') + ' & ' + last;
};

export const formatDateWithTimezone = (date: Date) => {
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  };

  return date.toLocaleString('en-US', options as unknown as Intl.DateTimeFormatOptions);
};

export const timestamp = () => Math.floor(Date.now() / 1000);

export type RobloxStatus = {
  result: {
    status_overall: {
      updated: string
      status: string
      status_code: number
    }
    status: Array<{
      id: string
      name: string
      status: string
      status_code: number
      containers: Array<{
        id: string
        name: string
        updated: string
        status: string
        status_code: number
      }>
      updated: string
    }>
    incidents: Array<{
      name: string
      _id: string
      datetime_open: string
      messages: Array<{
        details: string
        state: number
        status: number
        datetime: string
      }>
      containers_affected: Array<{
        name: string
        _id: string
      }>
      components_affected: Array<{
        name: string
        _id: string
      }>
    }>
    maintenance: {
      active: Array<unknown>
      upcoming: Array<unknown>
    }
  }
}

// error states
//const ROBLOX_STATUS_URL = 'https://web.archive.org/web/20240716012240if_/http://hostedstatus.com/1.0/status/59db90dbcdeb2f04dadcf16d'
const ROBLOX_STATUS_URL = 'http://hostedstatus.com/1.0/status/59db90dbcdeb2f04dadcf16d'

export const robloxStatusCheck = async () => {
  const status = await ky(ROBLOX_STATUS_URL).json<RobloxStatus>();
  if (status.result.status_overall.status === "Operational") {
    return true
  } else {
    if (status.result.incidents.length >= 1) {
      const x: {
        components: string[],
        date: string
      } = {
        components: [],
        date: ""
      }
      status.result.incidents.forEach(i => {
        i.components_affected.forEach(c => {
          x.components.push(c.name)
        })
        x.date = i.datetime_open
      })
      return x
    }
  }
}

/**
 * Returns the base URL of the application.
 * - When running locally: returns "http://localhost:3000"
 * - When deployed on Vercel: returns the Vercel URL from environment variables
 */
export const getBaseUrl = () => {
  // Check if running on Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Check for custom domain set in environment variables (optional)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Default to localhost with standard Next.js port
  return "http://localhost:3000";
};


export const isJwtValid = (exp: number, bufferSeconds: number = 0): boolean => {
  if (!exp) return false;

  // Current time in seconds since Unix epoch
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  // Check if the token is still valid, considering the buffer time
  return exp > (currentTimeInSeconds - bufferSeconds);
};

export function createLogger(prefix: string) {
  return (...args: any[]) => console.log(`[${prefix}]`, ...args);
}