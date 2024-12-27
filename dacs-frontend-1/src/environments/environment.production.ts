export const environment = {
    production: true,
    keycloak: {
      url: 'http://localhost:8080', 
      realm: 'master', 
      clientId: 'dacs2023-fe'
    },
    backendForFrontendUrl: 'https://mi-api-produccion.com/api', // URL de la BFF en producción
    databaseUrl: 'https://mi-api-produccion.com/api' // URL de la base de datos en producción
  };
  