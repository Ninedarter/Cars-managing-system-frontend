import { Component } from "@angular/core";

export interface Owner {
  firstname: string;
  lastName: string;
  age: number;
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
    firstname: "",
    lastName: "",
    age: 0,
    email: "",
    password: "",
  };
}
