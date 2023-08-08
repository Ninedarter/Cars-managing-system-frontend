import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

import { Observable, filter } from "rxjs";

export interface Maintenance {
  id?: any;
  name: string;
  price: number;
  date: Date;
  vinCode?: any;
  ownerId?: number;
}

@Component({
  selector: "app-explotation-costs",
  templateUrl: "./explotation-costs.component.html",
  styleUrls: ["./explotation-costs.component.css"],
})
export class ExplotationCostsComponent implements OnInit {
  vinCode: any = "";
  totalPrice: number = 0;
  maintenances: Maintenance[] = [];
  maintenance: Maintenance = {
    id: 0,
    name: "",
    price: 0,
    date: new Date(),
    vinCode: "",
    ownerId: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.vinCode = params.get("vinCode");
    });
    this.getMaintencesByCar(this.vinCode);
  }

  public getMaintencesByCar(vinCode: string): void {
    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("myToken")
    );
    const params = new HttpParams().set("vinCode", vinCode);

    this.httpClient
      .get<Maintenance[]>("http://localhost:8082/maintenances/", {
        headers,
        params,
      })
      .subscribe(
        (response: any) => {
          this.maintenances = response.maintenances;
          this.totalPrice = this.getTotalPrice(this.maintenances);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  public addNewMaintenance(addForm: NgForm): void {
    this.maintenance = {
      name: addForm.value.name,
      price: addForm.value.price,
      date: addForm.value.date,
      vinCode: this.vinCode,
      ownerId: 0,
    };

    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("myToken")
    );
    this.httpClient
      .post<Maintenance[]>(
        "http://localhost:8082/maintenances/add",
        this.maintenance,
        { headers }
      )
      .subscribe(
        (response: any) => {
          this.maintenances = response.maintenances;
          this.getMaintencesByCar(this.vinCode);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  public getTotalPrice(maintenances: Maintenance[]): number {
    let total: number = 0;
    maintenances.forEach((maintenance: Maintenance) => {
      total = total + maintenance.price;
    });
    return total;
  }

  public selectedMaintenance: Maintenance | null = null;

  public deleteSelectedMaintenance(maintenance: Maintenance): void {
    maintenance.vinCode = this.vinCode;
    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("myToken")
    );

    this.httpClient
      .delete("http://localhost:8082/maintenances/" + maintenance.id, {
        headers,
      })
      .subscribe(
        (response: any) => {
          this.getMaintencesByCar(maintenance.vinCode);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  isVisible: boolean = false;
  public showModal(maintenance: Maintenance) {
    this.isVisible = true;
    this.maintenance = maintenance;
  }

  public updateMaintenance(addForm: NgForm): void {
    this.selectedMaintenance = {
      id: this.maintenance.id,
      name: addForm.value.name,
      price: addForm.value.price,
      date: addForm.value.date,
      vinCode: this.vinCode,
    };

    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("myToken")
    );
    this.httpClient
      .put<Maintenance>(
        "http://localhost:8082/maintenances/",
        this.selectedMaintenance,
        { headers }
      )
      .subscribe((response: any) => {
        this.getMaintencesByCar(this.selectedMaintenance?.vinCode);
      });

    addForm.reset();
  }

  public updateMaintenancesToBackend(maintenanceToUpdate: Maintenance) {
    if (!maintenanceToUpdate) {
      throw new Error("Vehicle object is undefined.");
    }
    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("myToken")
    );
    this.httpClient.put<Maintenance>(
      "http://localhost:8082/maintenances/",
      maintenanceToUpdate,
      { headers }
    );
  }
}
