import { Component, OnInit } from "@angular/core";
import { Model } from "../model";
import { trigger, transition, style, animate } from "@angular/animations";
import { FirebaseService } from "../service/firebase.service";
import { CrudService } from "../crud.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  animations: [
    trigger("fade", [
      transition("void => *", [
        style({ backgroundColor: "rgb(0, 0, 0,0)", opacity: 0 }),
        animate(900),
      ]),

      transition("* => void", [
        animate(0, style({ backgroundColor: "white", opacity: 0 })),
      ]),
    ]),

    trigger("fade-left", [
      transition("void => *", [style({ marginLeft: "-300px" }), animate(200)]),
    ]),
  ],
})
export class ListComponent implements OnInit {
  isSignedIn = false;
  userEmail;
  myTasks: any;
  item: string;
  itemStatus = false;
  firstkey = false;

  model = new Model();

  constructor(
    public firebaseService: FirebaseService,
    public crudService: CrudService
  ) {}

  ngOnInit() {
    if (localStorage.getItem("user") !== null) {
      this.isSignedIn = true;
      this.userEmail = localStorage.getItem("email");
      this.myTasks = this.crudService.getTasks();
      console.log(this.myTasks);
    } else this.isSignedIn = false;
  }

  async onSignup(email: string, password: string) {
    await this.firebaseService.signup(email, password);
    if (this.firebaseService.isLoggedIn) this.isSignedIn = true;
    this.userEmail = localStorage.getItem("email");
    this.myTasks = this.crudService.getTasks();
    this.deactiveSignup();
  }

  async onSignin(email: string, password: string) {
    await this.firebaseService.signin(email, password);
    if (this.firebaseService.isLoggedIn) {
      this.isSignedIn = true;
      this.userEmail = localStorage.getItem("email");
      this.myTasks = this.crudService.getTasks();
      this.deactiveLogin();
      document.getElementById("message").innerHTML = "";
    } else {
      document.getElementById("message").innerHTML = "Invalid user information";
    }
  }

  Signout() {
    this.firebaseService.logout();

    this.ngOnInit();
    this.model.items = null;
  }

  getItems() {
    return this.myTasks;
  }

  deleteItem(itemID, i) {
    this.crudService.deleteTask(itemID);
    this.myTasks.splice(i, 1);
  }

  addItem() {
    let Record = {};
    Record["userId"] = localStorage.getItem("uid");
    Record["item"] = this.item;
    Record["status"] = this.itemStatus;

    if (localStorage.getItem("user")) {
      this.crudService
        .addTask(Record)
        .then((res) => {})
        .catch((error) => {
          console.log(error);
        });
      this.ngOnInit();

      console.log(this.myTasks);
    } else {
      alert("Please login or signup");
    }
  }

  updateStatus(id, status, i) {
    if (this.myTasks[i].data.status === false) {
      this.crudService.check(id);
      this.myTasks[i].data.status = true;
    } else {
      this.crudService.uncheck(id);
      this.myTasks[i].data.status = false;
    }
    console.log(this.myTasks[i].data.status);
  }

  setDisabledValue(id, i) {
    var bu = document.getElementById(id + "button");
    var tx = document.getElementById(id + "textarea");

    if (this.model.disabled === true) {
      this.model.disabled = false;
      bu.classList.add("editing");
      tx.classList.add("txtedit");
      tx.removeAttribute("disabled");
    } else {
      this.model.disabled = true;
      bu.classList.remove("editing");
      tx.classList.remove("txtedit");
      tx.setAttribute("disabled", "disabled");

      if (tx.innerHTML != this.myTasks[i].data.item) {
        console.log(this.myTasks[i].data.item);

        console.log("itemchenged");
      } else {
        console.log("not working");

        console.log(this.myTasks[i].data.item);
        console.log(tx.innerHTML);
      }
      this.firstkey = false;
    }

    return this.model.disabled;
  }

  changing() {
    if (this.firstkey === false) {
      this.firstkey = true;
    }
  }

  activeLogin() {
    let modal = document.getElementById("login");
    modal.classList.add("is-active");
  }

  deactiveLogin() {
    let modal = document.getElementById("login");
    modal.classList.remove("is-active");
  }

  activeSignup() {
    let modal = document.getElementById("signup");
    modal.classList.add("is-active");
  }

  deactiveSignup() {
    let modal = document.getElementById("signup");
    modal.classList.remove("is-active");
  }
}
