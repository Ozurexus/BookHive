CREATE TABLE IF NOT EXISTS books
(
    id                  INT PRIMARY KEY UNIQUE,
    isbn                VARCHAR(25) UNIQUE,
    title               TEXT,
    author              TEXT,
    year_of_publication INT,
    publisher           TEXT,
    image_url_s         TEXT,
    image_url_m         TEXT,
    image_url_l         TEXT,
    genre               TEXT,
    annotation          TEXT
);
CREATE INDEX IF NOT EXISTS books_isbn_idx ON books USING btree (isbn);
CREATE INDEX IF NOT EXISTS books_title_idx ON books USING btree (title);

CREATE TABLE IF NOT EXISTS users
(
    id            INT UNIQUE PRIMARY KEY,
    login         TEXT,
    password_hash TEXT
);
CREATE INDEX IF NOT EXISTS users_id_idx ON users USING btree (id);

CREATE TABLE IF NOT EXISTS ratings
(
    id      BIGSERIAL,
    user_id INT,
    book_id INT,
    rating  INT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS ratings_user_id_idx ON ratings USING btree (user_id);
CREATE INDEX IF NOT EXISTS ratings_user_idx_book_id_idx ON ratings USING btree (user_id, book_id);

CREATE TABLE IF NOT EXISTS books_wishes
(
    user_id INT,
    book_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
);
