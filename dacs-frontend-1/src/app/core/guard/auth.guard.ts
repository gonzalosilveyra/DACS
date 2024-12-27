import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {

  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {

    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
      return false; // Detiene el acceso hasta que el login sea exitoso.
    }

    // Verificación de roles (opcional)
    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles && !this.roles.some(role => requiredRoles.includes(role))) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // Verifica si el token expiró y lo renueva si es posible
    const isExpired = this.keycloak.isTokenExpired();
    if (isExpired) {
      try {
        await this.keycloak.updateToken(30); // Intenta renovar el token.
      } catch (error) {
        await this.keycloak.logout(); // Si falla, cierra la sesión.
        return false;
      }
    }

    return true;
  }
}
