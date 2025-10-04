import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class BookComponent implements OnInit {
  books: any[] = [];
  displayedBooks: any[] = [];
  currentPage: number = 1;
  pageSize: number = 4;
  totalPages: number = 1;
  private apiUrl = environment.apiUrl;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
      this.totalPages = Math.ceil(this.books.length / this.pageSize);
      this.updateDisplayedBooks();
    });
  }

  updateDisplayedBooks(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedBooks = this.books.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedBooks();
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
