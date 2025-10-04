import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookComponent } from './book/book/book.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule]
})
export class AppComponent {
  title = 'my-angular-app';
}
