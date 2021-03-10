import { Injectable } from "@angular/core";

import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  isLoggedIn = false;
  constructor(public firebaseAuth: AngularFireAuth) {}
  async signin(email: string, password: string) {
    await this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("email", res.user.email);
        localStorage.setItem("uid", res.user.uid);

        this.isLoggedIn = true;
      })
      .catch((err) => {
        console.log("Invalid userInfo");
      });
  }

  async signup(email: string, password: string) {
    await this.firebaseAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        this.isLoggedIn = true;
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("email", email);
        localStorage.setItem("uid", res.user.uid);
      })
      .catch((err) => console.log("Invalid userInfo"));
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem("user");
    window.location.reload();
  }
}
