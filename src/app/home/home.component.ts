import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";

export interface Owner {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  user: Owner = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  };
  constructor(private httpClient: HttpClient, private router: Router){

  }

  public register(addForm: NgForm): void{
    this.user = {
      firstName: addForm.value.firstName,
      lastName: addForm.value.lastName,
      email:addForm.value.email,
      password : addForm.value.password
    }  ; 
    console.log(this.user,"registeeeeeer");
    this.sendDataToBackEnd(this.user).subscribe((response : any)  => {

    });
    addForm.reset();
    this.router.navigate(["/login"]);
  }

  public sendDataToBackEnd(user: Owner) :Observable<Owner> {
    console.log(user,"registeeeeeer");
   return this.httpClient.post<Owner>('http://localhost:8082/api/v1/auth/register', user);
  }



}
