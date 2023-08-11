import { NgFor } from "@angular/common";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, catchError, tap, throwError } from "rxjs";
export interface Vehicle {
  brand: string;
  model: string;
  yearOfMade: number;
  horsePower: number;
  vinCode: string;
  originCountry: string;
  mileage: number;
  technicalExpirationDate: Date | null;
  insuranceExpirationDate: Date | null;
  email: string | null;
  imgUrl: string;
}
@Component({
  selector: "app-cars",
  templateUrl: "./cars.component.html",
  styleUrls: ["./cars.component.css"],
})
export class CarsComponent {
  vehicles: Vehicle[] = [];
  vehicleToAdd?: Vehicle;
  constructor(private httpClient: HttpClient, private router: Router) {
    this.getVehiclesFromBackEnd();
  }

  showAddForm1 = false;
  showAddForm2 = false;
  userEmail: string | null = localStorage.getItem("email") ?? "";

  navigateToExplotationComponent(vinCode: string): void {
    console.log(vinCode);
    this.router.navigate(["/explotation", vinCode], {
      state: { vinCode: vinCode },
    });
  }

  navigateToStatisticsComponent(vinCode: string): void {
    console.log(vinCode + "siunciu i expences componenta ");
    this.router.navigate(["/expences", vinCode], {
      state: { vinCode: vinCode },
    });
  }

  private getVehiclesFromBackEnd(): void {
    const email = localStorage.getItem("email");

    if (email) {
      this.getVehiclesByEmail(email).subscribe(
        (response: any) => {
          this.vehicles = response.vehicles;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    } else {
      alert("Email is not available.");
    }
  }

  getVehiclesByEmail(email: string): Observable<Vehicle[]> {
    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("myToken")
    );
    const params = new HttpParams().set("email", email);

    return this.httpClient.get<Vehicle[]>(
      "http://localhost:8082/vehicles/owner",
      { headers, params }
    );
  }

  public addNewVehicle(addForm: NgForm): void {
    this.vehicleToAdd = {
      brand: addForm.value.brand,
      model: addForm.value.model,
      yearOfMade: addForm.value.yearOfMade,
      horsePower: addForm.value.horsePower,
      vinCode: addForm.value.vinCode,
      originCountry: addForm.value.originCountry,
      mileage: addForm.value.mileage,
      technicalExpirationDate: addForm.value.technicalExpirationDate,
      insuranceExpirationDate: addForm.value.insuranceExpirationDate,
      email: localStorage.getItem("email"),
      imgUrl: addForm.value.imgUrl,
    };
    console.log(this.vehicleToAdd.email, "pridedamos masinos emailas")
    this.saveVehicleToBackend(addForm.value).subscribe((response: Vehicle) => {
      this.getVehiclesFromBackEnd();
    });
    
  }

  public saveVehicleToBackend(vehicleToAdd: Vehicle): Observable<Vehicle> {
    if (!vehicleToAdd) {
      throw new Error("Vehicle object is undefined.");
    }
    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("myToken")
    );
    console.log(localStorage.getItem("email"));
    console.log(vehicleToAdd.imgUrl);
    return this.httpClient.post<Vehicle>(
      "http://localhost:8082/vehicles/add",
      vehicleToAdd,
      { headers }
    );
  }

  public updateForm(vehicle: Vehicle) {
    this.vehicleToAdd = vehicle;
  }

  public update(addForm2: NgForm) {
    this.vehicleToAdd = {
      brand: addForm2.value.brand,
      model: addForm2.value.model,
      yearOfMade: addForm2.value.yearOfMade,
      horsePower: addForm2.value.horsePower,
      vinCode: addForm2.value.vinCode,
      originCountry: addForm2.value.originCountry,
      mileage: addForm2.value.mileage,
      technicalExpirationDate: addForm2.value.technicalExpirationDate,
      insuranceExpirationDate: addForm2.value.insuranceExpirationDate,
      email: this.userEmail,
      imgUrl: addForm2.value.imgUrl,
    };

    this.updateVehicleToBackEnd(addForm2.value).subscribe(
      (response: Vehicle) => {
        if (this.vehicleToAdd && response.email) {
        }
        this.getVehiclesFromBackEnd();
      }
    );

    console.log(this.vehicleToAdd);
  }

  public updateVehicleToBackEnd(
    vehicleToAddOrUpdate: Vehicle
  ): Observable<Vehicle> {
    console.log(vehicleToAddOrUpdate);
    if (!vehicleToAddOrUpdate) {
      throw new Error("Vehicle object is undefined.");
    }
    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("myToken")
    );
    console.log(vehicleToAddOrUpdate.email);
    return this.httpClient.put<Vehicle>(
      "http://localhost:8082/vehicles/",
      vehicleToAddOrUpdate,
      { headers }
    );
  }
  
  doLogout() {
    localStorage.removeItem('myToken');
    this.router.navigate(['/login']);
  }
  
}
