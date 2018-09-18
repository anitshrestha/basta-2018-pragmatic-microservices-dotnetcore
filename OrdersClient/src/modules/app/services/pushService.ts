import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { SecurityService } from "./securityService";
import { ConfigService } from "./configService";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";

@Injectable()
export class PushService {
  private _hubConnection: HubConnection;

  public orderShipping: BehaviorSubject<string> = new BehaviorSubject(null);
  public orderCreated: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    private _securityService: SecurityService,
    private _config: ConfigService
  ) {}

  public start(): void {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(
        this._config.SignalRBaseUrl +
          "ordersHub" +
          "?authorization=" +
          this._securityService.accessToken
      )
      .configureLogging(LogLevel.Information)
      .build();

    this._hubConnection.on("orderCreated", () => {
      this.orderCreated.next(null);
    });

    this._hubConnection.on("shippingCreated", orderId => {
      this.orderShipping.next(orderId);
    });

    this._hubConnection
      .start()
      .then(() => console.log("SignalR connection established."))
      .catch(err =>
        console.error("SignalR connection not established. " + err)
      );
  }

  public stop(): void {
    if (this._hubConnection) {
      this._hubConnection.stop();
    }

    this._hubConnection = undefined;
  }
}
