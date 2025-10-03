import { Routes } from "@angular/router";
import { BookFormComponent } from "./book/book-form/book-form.component";
import { BookComponent } from "./book/book/book.component";

export const routes: Routes = [
  { path: '', component: BookComponent },
  { path: 'add', component: BookFormComponent },
  { path: 'edit/:id', component: BookFormComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route for 404
];