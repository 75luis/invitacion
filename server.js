const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Middleware para manejar solicitudes JSON
app.use(express.static(path.join(__dirname))); // Sirve archivos estáticos como agregar.html

// Ruta para obtener todos los invitados
app.get('/guests', (req, res) => {
  fs.readFile('invitados.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo invitados.json:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    // Parseamos el archivo JSON, asegurándonos de que sea un array
    let guests = [];
    try {
      guests = JSON.parse(data);
      if (!Array.isArray(guests)) {
        guests = [];
      }
    } catch (e) {
      console.error('Error parseando JSON:', e);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    res.json(guests); // Devolvemos la lista de invitados
  });
});

// Ruta para agregar un nuevo invitado
app.post('/add-guest', (req, res) => {
  const newGuest = req.body;

  fs.readFile('invitados.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo invitados.json:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    let guests = [];
    try {
      guests = JSON.parse(data);
      if (!Array.isArray(guests)) {
        guests = [];
      }
    } catch (e) {
      console.error('Error parseando JSON:', e);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    // Verificar si ya existe un invitado con el mismo código
    const existingGuest = guests.find(guest => guest.codigo === newGuest.codigo);
    if (existingGuest) {
      return res.status(400).json({ message: 'Ya existe un invitado con este código.' });
    }

    guests.push(newGuest); // Agregar el nuevo invitado

    // Sobrescribir el archivo con los nuevos datos
    fs.writeFile('invitados.json', JSON.stringify(guests, null, 2), (err) => {
      if (err) {
        console.error('Error escribiendo en invitados.json:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      res.json({ message: 'Invitado agregado exitosamente' });
    });
  });
});

// Ruta para editar un invitado
app.put('/edit-guest/:index', (req, res) => {
  const index = parseInt(req.params.index, 10); // Convierte el índice a entero
  const updatedGuest = req.body;

  fs.readFile('invitados.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo invitados.json:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    let guests = [];
    try {
      guests = JSON.parse(data);
      if (!Array.isArray(guests)) {
        guests = [];
      }
    } catch (e) {
      console.error('Error parseando JSON:', e);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (index >= 0 && index < guests.length) {
      guests[index] = updatedGuest; // Actualiza al invitado en el índice correspondiente

      // Sobrescribir el archivo con los nuevos datos
      fs.writeFile('invitados.json', JSON.stringify(guests, null, 2), (err) => {
        if (err) {
          console.error('Error escribiendo en invitados.json:', err);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.json({ message: 'Invitado editado exitosamente' });
      });
    } else {
      res.status(404).json({ message: 'Invitado no encontrado' });
    }
  });
});

// Ruta para eliminar un invitado
app.delete('/delete-guest/:index', (req, res) => {
  const index = parseInt(req.params.index, 10); // Convierte el índice a entero

  fs.readFile('invitados.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error leyendo invitados.json:', err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    let guests = [];
    try {
      guests = JSON.parse(data);
      if (!Array.isArray(guests)) {
        guests = [];
      }
    } catch (e) {
      console.error('Error parseando JSON:', e);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    if (index >= 0 && index < guests.length) {
      guests.splice(index, 1); // Elimina al invitado en el índice especificado

      // Sobrescribir el archivo con los nuevos datos
      fs.writeFile('invitados.json', JSON.stringify(guests, null, 2), (err) => {
        if (err) {
          console.error('Error escribiendo en invitados.json:', err);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.json({ message: 'Invitado eliminado exitosamente' });
      });
    } else {
      res.status(404).json({ message: 'Invitado no encontrado' });
    }
  });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
