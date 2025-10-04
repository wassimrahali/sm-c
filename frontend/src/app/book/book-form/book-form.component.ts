import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  id?: number;
  file: File | null = null;
  private apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      year: [0, [Validators.required, Validators.min(0)]],
      cover_image: [null]
    });
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.bookService.getBook(this.id).subscribe(book => {
        this.bookForm.patchValue({
          title: book.title,
          author: book.author,
          year: book.year,
          cover_image: book.cover_image
        });
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    }
  }

  getImageUrl(filename: string): string {
    return filename ? `${this.apiUrl}/uploads/${filename}` : '';
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.bookForm.get('title')?.value);
    formData.append('author', this.bookForm.get('author')?.value);
    formData.append('year', this.bookForm.get('year')?.value);
    if (this.file) {
      formData.append('cover_image', this.file);
    }

    if (this.id) {
      this.bookService.updateBook(this.id, formData).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.bookService.addBook(formData).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}