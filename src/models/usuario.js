import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  edad: Number,
});

export default mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);