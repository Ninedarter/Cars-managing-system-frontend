import {
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);
export interface Maintenance {
  id?: any;
  name: string;
  price: number;
  date: Date;
  vinCode?: string;
  ownerId?: number;
}

@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.css"],
})
export class StatisticsComponent implements OnInit {
  vinCode: any;
  maintenances: Maintenance[] = [];
  maintenance: Maintenance = {
    id: 0,
    name: "",
    price: 0,
    date: new Date(),
    vinCode: "",
    ownerId: 0,
  };

  @ViewChild("chartCanvas", { static: false }) chartCanvas!: ElementRef;

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
    this.createAllChart();
  }

  createAllChart() {
    const monthlyTotals = this.calculateMonthlyMaintenanceCosts(
      this.maintenances
    );
    this.createChart(monthlyTotals);
  }

  maintenancesByCar: Maintenance[] = [];
  public getMaintencesByCar(vinCode: string) {
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
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  calculateMonthlyMaintenanceCosts(maintenances: Maintenance[]): {
    [month: string]: number;
  } {
    const monthlyTotals: { [month: string]: number } = {};
    console.log("maintenances !!!", maintenances);
    for (const maintenance of maintenances) {
      const month = new Date(maintenance.date).getMonth() + 1;
      const year = new Date(maintenance.date).getFullYear();
      const key = `${year}-${month}`;

      if (!monthlyTotals[key]) {
        monthlyTotals[key] = maintenance.price;
      } else {
        monthlyTotals[key] += maintenance.price;
      }
    }

    for (const key in monthlyTotals) {
      if (monthlyTotals.hasOwnProperty(key)) {
        const totalPrice = monthlyTotals[key];
        console.log(`Total price for ${key}: ${totalPrice}`);
      }
    }
    return monthlyTotals;
  }

  createChart(monthlyTotals: { [month: string]: number }) {
    const labels = Object.keys(monthlyTotals) as string[];
    const data = Object.values(monthlyTotals);

    const canvas: HTMLCanvasElement | null = this.chartCanvas.nativeElement;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context not supported");
      return;
    }

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Maintenance cost",
            data: data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
