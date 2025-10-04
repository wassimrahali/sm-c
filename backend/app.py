from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# ---------- PostgreSQL configuration (Neon) ----------
app.config['SQLALCHEMY_DATABASE_URI'] = (
    'postgresql://neondb_owner:npg_6Cb1JqYymahD@ep-crimson-moon-ad9o64dg-pooler.c-2.us-east-1.aws.neon.tech/'
    'neondb?sslmode=require&channel_binding=require'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ---------- File upload configuration ----------
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)
CORS(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# ---------- Database model ----------
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    cover_image = db.Column(db.String(200), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'year': self.year,
            'cover_image': self.cover_image
        }

# ---------- Initialize the database ----------
with app.app_context():
    db.create_all()

# ---------- Routes ----------
@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books])

@app.route('/books/<int:id>', methods=['GET'])
def get_book(id):
    book = Book.query.get_or_404(id)
    return jsonify(book.to_dict())


@app.route('/books', methods=['POST'])
def add_book():
    if 'title' not in request.form or 'author' not in request.form or 'year' not in request.form:
        return jsonify({'error': 'Missing fields'}), 400

    try:
        year = int(request.form['year'])
    except ValueError:
        return jsonify({'error': 'Year must be an integer'}), 400

    cover_image_filename = None
    if 'cover_image' in request.files:
        file = request.files['cover_image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            cover_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(cover_image_path)
            cover_image_filename = filename

    new_book = Book(
        title=request.form['title'],
        author=request.form['author'],
        year=year,
        cover_image=cover_image_filename
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify(new_book.to_dict()), 201

@app.route('/books/<int:id>', methods=['PUT'])
def update_book(id):
    book = Book.query.get_or_404(id)
    data = request.form if request.form else request.get_json()

    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    if 'year' in data:
        try:
            book.year = int(data['year'])
        except ValueError:
            return jsonify({'error': 'Year must be an integer'}), 400

    if 'cover_image' in request.files:
        file = request.files['cover_image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            cover_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(cover_image_path)
            if book.cover_image and os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], book.cover_image)):
                os.remove(os.path.join(app.config['UPLOAD_FOLDER'], book.cover_image))
            book.cover_image = filename

    db.session.commit()
    return jsonify(book.to_dict())

@app.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get_or_404(id)
    if book.cover_image and os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], book.cover_image)):
        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], book.cover_image))
    db.session.delete(book)
    db.session.commit()
    return '', 204

@app.route('/uploads/<filename>', methods=['GET'])
def get_image(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        return send_file(file_path)
    return jsonify({'error': 'Image not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
