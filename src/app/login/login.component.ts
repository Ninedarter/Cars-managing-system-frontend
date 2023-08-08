import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

export interface AuthRequest {
  email: string;
  password: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  myTokenObject: any = "";
  tokenStringValue: string = "";
  ownerId: number = 0;

  constructor(private httpClient: HttpClient, private router: Router) {}

  public doLogin() {
    let tokenResponse = this.getAuthTokenFromBackend();
    tokenResponse.subscribe((data) => {
      this.myTokenObject = data;
      this.router.navigate(["/cars"]);
      const responseObject = JSON.parse(this.myTokenObject);
      this.tokenStringValue = responseObject.token;
      localStorage.setItem("myToken", this.tokenStringValue);
      let securedEndpointResponse = this.getVehiclesByOwner(
        this.tokenStringValue
      );
      securedEndpointResponse.subscribe((data) => {});
    });
  }

  public getAuthTokenFromBackend(): Observable<Object> {
    const encryptedLoginAndPass = btoa(this.email + ":" + this.password);
    const headers = new HttpHeaders().set(
      "Authorization",
      "Basic " + encryptedLoginAndPass
    );
    const requestBody: AuthRequest = {
      email: this.email,
      password: this.password,
    };
    localStorage.setItem("email", this.email);
    return this.httpClient.post(
      "http://localhost:8082/api/v1/auth/authenticate",
      requestBody,
      { headers, responseType: "text" as "json" }
    );
  }

  public getVehiclesByOwner(tokenValue: string) {
    console.log("Calling another endpoint with this token: " + tokenValue);
    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + tokenValue
    );
    const params = new HttpParams().set("email", this.email);

    return this.httpClient.get("http://localhost:8082/vehicles/owner", {
      headers,
      params,
      responseType: "text" as "json",
    });
  }
}
