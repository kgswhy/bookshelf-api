const {  addBookByHandler,
  getAllBooksByHandler,
  getBookByHandler,
  editBookByHandler,
  deleteBookByIdHandler, } = require("./handler");

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookByHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksByHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookByHandler,
      },
      {
        method: 'PUT',
        path: '/books/{id}',
        handler: editBookByHandler,
      },
      {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBookByIdHandler,
      },
];

module.exports = routes;