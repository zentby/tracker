import { getInstance } from './utils';
import { Environments } from './types';
import { AppSettings } from './client';

export type Vendor = 'amplitude'; // | 'segment' | 'experiments'

export type PrivacyOptions = Record<
'city'|'country'|'device_model'|'dma'|'ip_address'|'language'|'os_name'|'os_version'|'platform'|'region'|'version_name'
, boolean>;


export type VendorAPIOptions = {
  deviceId?: string;
  // language?: string;
  logLevel?: 'DISABLE' | 'ERROR' | 'WARN' | 'INFO';
  optOut?: boolean;
  platform?: string;
  privacyOptions?: Partial<PrivacyOptions>;
}

export type Script = {
  src: string;
  integrity?: string;
}

export type ScriptByEnvironment = {
  [key in Environments]: Script[];
}

export type VendorAPI = {
  env: Environments;
  scripts: ScriptByEnvironment; 
  init: (apiKey: string, options?: VendorAPIOptions) => Promise<void>;
  track: (userData: any, eventData: any) => Promise<void>;
  getSessionId: () => undefined | number | string;
  clearUserProperties: () => void;
}

type VendorAPIs = {
  [key in Vendor]: VendorAPI
}

// api implemention, sdk integration
export const getVendorAPI = (appSettings: AppSettings) => 
{
  const { vendor: _vendor, env: _env } = appSettings;
  const apis: VendorAPIs = {
    amplitude: {
      env: _env,
      scripts: {
        development: [
          {
            src: 'https://cdn.amplitude.com/libs/amplitude-4.5.2.js'
          }
        ],
        production: [
          {
            src: 'https://cdn.amplitude.com/libs/amplitude-4.5.2-min.gz.js'
          }
        ]
      },
      init: (apiKey, options) => {
        // todo: transform options => amplitude options
        const instance = getInstance<amplitude.AmplitudeClient>();
        return new Promise((resolve, reject) => {
          if(!instance) reject();
          instance.init(apiKey, undefined, options, () => resolve());
        })
      },
      track: (userData, eventData) => {
        const instance = getInstance<amplitude.AmplitudeClient>();
        return new Promise((resolve, reject) => {
          if(!instance) reject();
          if(userData && Object.keys(userData).length > 0) {
            instance.setUserProperties(userData);
          }
          if(eventData) {
            const { eventName, ...rest } = eventData;
            instance.logEvent(eventName, rest);
          }
          resolve();
        });
      },
      getSessionId: () => {
        const instance = getInstance<amplitude.AmplitudeClient>();
        return instance && instance.getSessionId();
      },
      clearUserProperties: () => {
        const instance = getInstance<amplitude.AmplitudeClient>();
        return instance && instance.clearUserProperties();
      }
    }
  }
  return apis[_vendor];
}
