import mongoose from 'mongoose';

const LaboratorioSchema = new mongoose.Schema({
  nombre: String,
  ubicacion: String,
});

export default mongoose.models.Laboratorio || mongoose.model('Laboratorio', LaboratorioSchema);