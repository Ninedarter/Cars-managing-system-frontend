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

export interface Expense {
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
  expenses: Expense[] = [];
  expense: Expense = {
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
    this.getExpensesByCar(this.vinCode);
  }

  public getExpensesByCar(vinCode: string): void {
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
          this.totalPrice = this.getTotalPrice(this.expenses);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  public addNewExpense(addForm: NgForm): void {
    this.expense = {
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
      .post<Expense[]>(
        "http://localhost:8082/expenses/add",
        this.expense,
        { headers }
      )
      .subscribe(
        (response: any) => {
          this.expenses = response.expenses;
          this.getExpensesByCar(this.vinCode);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  public getTotalPrice(expenses: Expense[]): number {
    let total: number = 0;
    expenses.forEach((expense: Expense) => {
      total = total + expense.price;
    });
    return total;
  }

  public selectedExpense: Expense | null = null;

  public deleteSelectedExpense(expense: Expense): void {
    expense.vinCode = this.vinCode;
    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("myToken")
    );

    this.httpClient
      .delete("http://localhost:8082/expenses/" + expense.id, {
        headers,
      })
      .subscribe(
        (response: any) => {
          this.getExpensesByCar(expense.vinCode);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  isVisible: boolean = false;
  public showModal(expense: Expense) {
    this.isVisible = true;
    this.expense = expense;
  }

  public updateExpense(addForm: NgForm): void {
    this.selectedExpense = {
      id: this.expense.id,
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
      .put<Expense>(
        "http://localhost:8082/expenses/",
        this.selectedExpense,
        { headers }
      )
      .subscribe((response: any) => {
        this.getExpensesByCar(this.selectedExpense?.vinCode);
      });

    addForm.reset();
  }

  public updateExpensesToBackend(expenseToUpdate: Expense) {
    if (!expenseToUpdate) {
      throw new Error("Vehicle object is undefined.");
    }
    const headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + localStorage.getItem("myToken")
    );
    this.httpClient.put<Expense>(
      "http://localhost:8082/expenses/",
      expenseToUpdate,
      { headers }
    );
  }


  doLogout() {
    localStorage.removeItem('myToken');
    this.router.navigate(['/login']);
  }
}
