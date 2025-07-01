import mongoose from 'mongoose';
import dotenv from 'dotenv'; 
import express from 'express';
import Usuario from './models/usuario.js';
import Laboratorio from './models/laboratorio.js';
import Equipo from './models/equipo.js';

dotenv.config();

const app = express();
app.use(express.json());

// ADICIONAL: Ingresar datos desde postman
// Crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Crear un nuevo laboratorio
app.post('/laboratorios', async (req, res) => {
  try {
    const laboratorio = new Laboratorio(req.body);
    await laboratorio.save();
    res.status(201).json(laboratorio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Crear un nuevo equipo
app.post('/equipos', async (req, res) => {
  try {
    const equipo = new Equipo(req.body);
    await equipo.save();
    res.status(201).json(equipo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Consultas solicitadas por el docente
// 1. Listar todos los usuarios
app.get('/usuarios', async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// 2. Buscar laboratorios que tengan equipos disponibles
app.get('/laboratorios/disponibles', async (req, res) => {
  const equiposDisponibles = await Equipo.find({ estado: 'disponible' }).populate('laboratorio');
  const laboratorios = equiposDisponibles.map(e => e.laboratorio);
  res.json(laboratorios);
});

// 3. Contar cantidad de equipos por estado
app.get('/equipos/estado/:estado', async (req, res) => {
  const count = await Equipo.countDocuments({ estado: req.params.estado });
  res.json({ estado: req.params.estado, cantidad: count });
});

// 4. Buscar usuarios cuyo correo termine en @espe.edu.ec
app.get('/usuarios/correo/espe', async (req, res) => {
  const usuarios = await Usuario.find({ correo: { $regex: /@espe\.edu\.ec$/ } });
  res.json(usuarios);
});

// 5. Promedio de equipos por laboratorio
app.get('/equipos/promedio', async (req, res) => {
  const promedio = await Equipo.aggregate([
    { $group: { _id: '$laboratorio', total: { $sum: 1 } } },
    { $group: { _id: null, promedio: { $avg: '$total' } } }
  ]);
  res.json({ promedio: promedio[0]?.promedio || 0 });
});

// Relaciones: populate
app.get('/equipos/:id', async (req, res) => {
  const equipo = await Equipo.findById(req.params.id).populate('laboratorio');
  res.json(equipo);
});

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  if (await Usuario.countDocuments() === 0) {
    const lab1 = await Laboratorio.create({ nombre: 'Lab Computo', ubicacion: 'Edificio A' });
    const lab2 = await Laboratorio.create({ nombre: 'Lab Redes', ubicacion: 'Edificio B' });

    await Usuario.create([
      { nombre: 'Melany', correo: 'melany@espe.edu.ec', edad: 22 },
      { nombre: 'Rosmery', correo: 'rosmery@espe.edu.ec', edad: 23 },
      { nombre: 'Paulo', correo: 'paulo@espe.edu.ec', edad: 21 }
    ]);

    await Equipo.create([
      { nombre: 'PC-01', estado: 'disponible', laboratorio: lab1._id },
      { nombre: 'PC-02', estado: 'ocupado', laboratorio: lab1._id },
      { nombre: 'Router', estado: 'disponible', laboratorio: lab2._id }
    ]);
  }

  app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
  });
}

main();