import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class BookComponent implements OnInit {
  books: any[] = [];
  private apiUrl = 'http://localhost:5000';

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
    });
  }

  getImageUrl(filename: string): string {
    return filename ? `${this.apiUrl}/uploads/${filename}` : '';
  }

  addBook(): void {
    this.router.navigate(['/add']);
  }

  editBook(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure?')) {
      this.bookService.deleteBook(id).subscribe(() => {
        this.loadBooks();
      });
    }
  }
}