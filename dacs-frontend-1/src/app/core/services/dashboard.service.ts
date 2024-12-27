// services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenService } from './token.service';  // Para obtener el token
import { DashboardData } from '../models/dashboard.interface';  // Interfaz de datos

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:9001/bff/backend';  // URL del BFF

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  // Método para obtener los datos del cliente, progreso histórico y rutinas de entrenamiento
  getDashboardData(customerId: string): Observable<DashboardData> {
    const token = this.tokenService.getToken();  // Obtiene el token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Hacemos las llamadas a los diferentes endpoints
    const customer$ = this.http.get<any>(`${this.baseUrl}/customer/${customerId}`, { headers });
    const progress$ = this.http.get<any>(`${this.baseUrl}/historical-progress/customer/${customerId}`, { headers });
    const routines$ = this.http.get<any>(`${this.baseUrl}/training-routines`, { headers });

    console.log(`Llamadas a los endpoints para el cliente: ${customerId}`);

    return forkJoin([customer$, progress$, routines$]).pipe(
      map(([customer, progress, routines]: [any, any[], any[]]) => {
        console.log('Datos obtenidos del cliente:', customer);
        console.log('Progreso histórico del cliente:', progress);
        console.log('Rutinas de entrenamiento del cliente:', routines);

        // Componer los datos del dashboard
        const dashboardData: DashboardData = {
          nombre: customer.name,
          edad: customer.age,
          objetivoFisico: customer.goal,
          pesoInicial: progress[0]?.weightInitial || 0,  // Suponiendo que el primer progreso tiene peso inicial
          pesoActual: progress[progress.length - 1]?.weight || 0,  // Último registro de peso
          grasaCorporal: progress[progress.length - 1]?.bodyFatPercentage || 0,
          nombreEntrenador: customer.trainer?.name || 'No asignado',
          especialidad: customer.trainer?.specialty || 'No asignada',
          planEntrenamiento: routines.map((routine: any) => ({
            dia: routine.day,
            grupoMuscular: routine.muscleGroup
          })),
          progresoHistorico: progress.map((p: any) => p.weight)
        };

        console.log('Datos compuestos para el dashboard:', dashboardData);

        return dashboardData;
      })
    );
  }
}
