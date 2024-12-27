import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { catchError, tap } from 'rxjs/operators'; // Importa tap y catchError para el manejo de logs y errores

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:9001'; // Base URL del BFF

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  /**
   * Método para obtener el rol de un usuario basado en su email.
   * @param email Correo del usuario.
   * @returns Observable con la respuesta del backend.
   */
  getUserRole(email: string): Observable<any> {
    const token = this.tokenService.getToken(); // Obtiene el token almacenado

    // Verificar si el token está disponible
    if (!token) {
      console.warn('No se encontró un token para el usuario.');
      return new Observable(); // Retorna un observable vacío si no hay token
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Agrega un log antes de hacer la solicitud para ver el token y los datos que se envían
    console.log('Realizando solicitud GET a BFF con token:', token);
    console.log('Email del usuario que se enviará al backend:', email);

    return this.http.get<any>(`${this.baseUrl}/user-role?email=${email}`, { headers }).pipe(
      tap(response => {
        // Log de la respuesta
        console.log('Respuesta del backend (rol del usuario):', response);
      }),
      catchError(error => {
        // Log del error
        console.error('Error al hacer la solicitud GET:', error);
        throw error; // Re-throw error para ser manejado donde se llama
      })
    );
  }
}
