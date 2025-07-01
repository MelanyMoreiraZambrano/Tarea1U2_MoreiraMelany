import Usuario from './models/usuario.js';
import Laboratorio from './models/laboratorio.js';
import Equipo from './models/equipo.js';

export default async function runQueries() {
  // 1. Listar todos los usuarios
  const usuarios = await Usuario.find();
  console.log('Usuarios:', usuarios);

  // 2. Buscar laboratorios que tengan equipos disponibles
  const equiposDisponibles = await Equipo.find({ estado: 'disponible' }).populate('laboratorio');
  const laboratoriosDisponibles = equiposDisponibles.map(e => e.laboratorio);
  console.log('Laboratorios con equipos disponibles:', laboratoriosDisponibles);

  // 3. Contar cantidad de equipos por estado
  const countDisponibles = await Equipo.countDocuments({ estado: 'disponible' });
  const countOcupados = await Equipo.countDocuments({ estado: 'ocupado' });
  console.log('Equipos disponibles:', countDisponibles, 'Equipos ocupados:', countOcupados);

  // 4. Buscar usuarios cuyo correo termine en @espe.edu.ec
  const usuariosCorreo = await Usuario.find({ correo: { $regex: /@espe\.edu\.ec$/ } });
  console.log('Usuarios con correo @espe.edu.ec:', usuariosCorreo);

  // 5. Promedio de equipos por laboratorio (aggregate)
  const promedioEquipos = await Equipo.aggregate([
    { $group: { _id: '$laboratorio', total: { $sum: 1 } } },
    { $group: { _id: null, promedio: { $avg: '$total' } } }
  ]);
  console.log('Promedio de equipos por laboratorio:', promedioEquipos[0]?.promedio || 0);

  // Relaciones: populate
  const equipo = await Equipo.findOne().populate('laboratorio');
  console.log('Equipo con laboratorio:', equipo);
}