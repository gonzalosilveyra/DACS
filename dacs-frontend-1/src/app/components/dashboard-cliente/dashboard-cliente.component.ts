import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DashboardService } from 'app/core/services/dashboard.service';  // El servicio que creamos
import { DashboardData } from 'app/models/dashboard.interface'; // Interfaz de datos
import { KeycloakService } from 'keycloak-angular'; // Servicio de Keycloak

@Component({
  selector: 'app-dashboard-cliente',
  templateUrl: './dashboard-cliente.component.html',
  styleUrls: ['./dashboard-cliente.component.css']
})
export class DashboardClienteComponent implements OnInit {
  @ViewChild('pesoChart') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  dashboardData!: DashboardData;  // Los datos del dashboard

  constructor(
    private dashboardService: DashboardService,
    private keycloakService: KeycloakService // Inyectamos el servicio de Keycloak
  ) {}

  ngOnInit(): void {
    console.log('Iniciando la obtención de datos para el dashboard');
    this.getCustomerIdFromKeycloak();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  // Función para obtener el customerId desde Keycloak y llamar al BFF
  private getCustomerIdFromKeycloak(): void {
    const keycloakInstance = this.keycloakService.getKeycloakInstance();
    const customerId = keycloakInstance.subject;  // Obtiene el ID del usuario (sub)

    console.log('Customer ID desde Keycloak:', customerId);

    // Llamamos al servicio de Dashboard para obtener los datos del cliente
    if (customerId) {
      this.getDashboardData(customerId);
    } else {
      console.error('No se pudo obtener el customerId desde Keycloak');
    }
  }

  // Función para obtener los datos del dashboard
  private getDashboardData(customerId: string): void {
    this.dashboardService.getDashboardData(customerId).subscribe(
      (data: DashboardData) => {
        console.log('Datos recibidos para el dashboard:', data);
        this.dashboardData = data;
        this.createChart();
      },
      (error: any) => {
        console.error('Error al obtener los datos del dashboard:', error);
      }
    );
  }

  private createChart() {
    console.log('Intentando crear el gráfico...');
    const ctx = this.chartCanvas.nativeElement;

    if (this.dashboardData) {
      console.log('Datos del dashboard para el gráfico:', this.dashboardData);
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
          datasets: [{
            label: 'Peso (kg)',
            data: this.dashboardData.progresoHistorico,  // Usamos los datos de peso histórico
            backgroundColor: '#710D07',
            borderColor: 'var(--primary-color)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true },
            x: { grid: { display: false } }
          },
          plugins: { legend: { display: false } }
        }
      });
      console.log('Gráfico creado exitosamente');
    } else {
      console.log('No se pudo crear el gráfico porque no hay datos');
    }
  }
}
