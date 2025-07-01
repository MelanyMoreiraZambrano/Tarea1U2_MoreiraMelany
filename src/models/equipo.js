import mongoose from 'mongoose';

const EquipoSchema = new mongoose.Schema({
  nombre: String,
  estado: String,
  laboratorio: { type: mongoose.Schema.Types.ObjectId, ref: 'Laboratorio' },
});

export default mongoose.models.Equipo || mongoose.model('Equipo', EquipoSchema);