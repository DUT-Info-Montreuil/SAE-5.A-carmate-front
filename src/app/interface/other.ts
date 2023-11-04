import {InjectionToken} from "@angular/core";

export interface NotifierServiceInterface {
  success: (message: string) => void;
  warning: (message: string) => void;
  error: (message: string) => void;
}
export const NOTIFIER_SERVICE_TOKEN = new InjectionToken<NotifierServiceInterface>('NotifierServiceInterface');
