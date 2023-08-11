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
export interface Expense {
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
  expenses: Expense[] = [];
  expense: Expense = {
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
    this.getExpensesByCar(this.vinCode);
    setTimeout(() => {
      this.getExpensesByCar(this.vinCode);
      this.createAllChart();
    }, 100);
  }

  createAllChart() {
    const monthlyTotals = this.calculateMonthlyExpenseCosts(
      this.expenses
    );
    this.createChart(monthlyTotals);
  }

  expensesByCar: Expense[] = [];
  public getExpensesByCar(vinCode: string) {
    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("myToken")
    );
    const params = new HttpParams().set("vinCode", vinCode);

    this.httpClient
      .get<Expense[]>("http://localhost:8082/expenses/", {
        headers,
        params,
      })
      .subscribe(
        (response: any) => {
          this.expenses = response.expenses;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  calculateMonthlyExpenseCosts(expenses: Expense[]): {
    [month: string]: number;
  } {
    const monthlyTotals: { [month: string]: number } = {};
    console.log("expensess !!!", expenses);
    for (const expense of expenses) {
      const month = new Date(expense.date).getMonth() + 1;
      const year = new Date(expense.date).getFullYear();
      const key = `${year}-${month}`;

      if (!monthlyTotals[key]) {
        monthlyTotals[key] = expense.price;
      } else {
        monthlyTotals[key] += expense.price;
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
            label: "monthly expenes(€)",
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
            ticks: {
              callback: (val) => {
                return '€' + val;
              },
          },
        },
      },
    },
    });

  const chartContainer = canvas.parentElement;
  if (chartContainer) {
    const chartTitle = document.createElement("h2");
    chartTitle.innerText = "Monthly Expenses ";
    chartTitle.style.textAlign = "center";
    chartTitle.style.color = "white";
    chartContainer.insertBefore(chartTitle, chartContainer.firstChild);
  }
}

doLogout() {
  localStorage.removeItem('myToken');
  this.router.navigate(['/login']);
}

  }

