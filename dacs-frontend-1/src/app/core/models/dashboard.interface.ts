// models/dashboard.interface.ts
export interface DashboardData {
  nombre: string;
  edad: number;
  objetivoFisico: string;
  pesoInicial: number;
  pesoActual: number;
  grasaCorporal: number;
  nombreEntrenador: string;
  especialidad: string;
  planEntrenamiento: {
    dia: string;
    grupoMuscular: string;
  }[];
  progresoHistorico: number[];  // Datos de progreso histórico (peso mensual o similar)
}
