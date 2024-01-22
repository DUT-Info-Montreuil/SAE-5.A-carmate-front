import {Injectable} from "@angular/core";
import {NotifierService} from "angular-notifier";
import {NotifierServiceInterface} from "../../../interface/other.interface";

@Injectable({
  providedIn: 'root',
})
export class AngularNotifierService implements NotifierServiceInterface {
  public readonly notifier: NotifierService;
  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  error(message: string): void {
    this.notifier.notify('error', message);
  }

  success(message: string): void {
    this.notifier.notify('success', message);
  }

  warning(message: string): void {
    this.notifier.notify('warning', message);
  }
}
