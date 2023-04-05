const { nanoid } = require("nanoid");
const books = require("./books");

const addBookByHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

   if(isSuccess){
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
    }

  return h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan.',
  }).code(500);
};


const getAllBooksByHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name !== undefined) {
      filteredBooks = filteredBooks.filter((n) =>
          n.name.toLowerCase().includes(name.toLowerCase())
      );
  }

  if (reading !== undefined) {
      filteredBooks = filteredBooks.filter(
          (n) => n.reading === !!Number(reading)
      );
  }

  if (finished !== undefined) {
      filteredBooks = filteredBooks.filter(
          (n) => n.finished === !!Number(finished)
      );
  }

  const response = h.response({
      status: 'success',
      data: {
          books: filteredBooks
              .map((n) => ({
                  id: n.id,
                  name: n.name,
                  publisher: n.publisher,
              }))
              .slice(0, 2), // membatasi array books hanya 2 objek buku
      },
  });
  response.code(200);
  return response;
};


const getBookByHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter( (n) => n.id === id)[0];

    if(book !== undefined){
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};



const editBookByHandler = (request, h) => {
    const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);

      return response;
    }

    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);

      return response;
    }

    const finished = (pageCount === readPage);

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
  
    const index = books.findIndex((note) => note.id === id);
  
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
  
      return response;
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
  
    return response;
  };



module.exports = { addBookByHandler, getAllBooksByHandler, getBookByHandler, editBookByHandler, deleteBookByIdHandler };