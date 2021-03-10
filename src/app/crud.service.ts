import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

import { Model } from "./model";
@Injectable({
  providedIn: "root",
})
export class CrudService {
  model = new Model();
  constructor(public db: AngularFirestore) {}

  addTask(Record) {
    if (localStorage.getItem("user")) {
      return this.db.collection("Items").add(Record);
    }
  }

  deleteTask(taskID) {
    if (localStorage.getItem("user")) {
      this.db
        .collection("Items")
        .doc(taskID)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  }

  getTasks() {
    var array = [];
    if (localStorage.getItem("user")) {
      this.db
        .collection("Items")
        .ref.where("userId", "==", localStorage.getItem("uid"))
        .get()
        .then((data) => {
          data.forEach((doc) => {
            array.push({ data: doc.data(), id: doc.id });
          });
        });
    }
    return array;
  }

  check(id) {
    this.db
      .collection("Items")
      .doc("/" + id)
      .update({ status: true })
      .then(() => {
        console.log("done");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }

  uncheck(id) {
    this.db
      .collection("Items")
      .doc("/" + id)
      .update({ status: false })
      .then(() => {
        console.log("done");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }

  updateItem(id, text) {
    this.db
      .collection("Items")
      .doc("/" + id)
      .update({ item: text })
      .then(() => {
        console.log("done");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }
}
