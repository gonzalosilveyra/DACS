# **MUSCLEHUB**
 Repositorio del proyecto para la asignatura Desarrollo de Aplicaciones Cliente-Servidor

 **IMPORTANTE**: Este proyecto se encuentra aún en desarrollo, por lo que la aplicación no es totalmente funcional.

 Este proyecto tiene como objetivo facilitar la gestión de rutinas de entrenamiento de gimnasio mediante la asignación de las mismas por parte de los entrenadores a sus clientes.
 Además, tiene como finalidad la visualización del progreso del cliente mediante un gráfico de barras, teniendo en cuenta principalmente la variable PESO, la cual va evolucionando con el paso del tiempo.

 En cuanto a su arquitectura, la aplicación se desarrolla en Angular 16 para la parte del Front, utilizamos base de datos PostgreSQL y Keycloak para la autenticación, la API WGER para traer ejercicios e información relevante sobre los mismos, y para la gestión de solicitudes optamos por dividir el Backend en tres microservicios:

1. ms Backend for Frontend (BFF): primera capa del flujo de solicitudes para poder traer datos desde el back sin interactuar directamente con la base de datos y/o la API. Es el microservicio que interactúa con los dos microservicios restantes.
2. ms Conector: microservicio encargado de recolectar los datos desde la API WGER, ya sean nombres de ejercicios, imágenes, nombres, etc.
3. ms Backend: este microservicio se encarga de la interacción con la base de datos Postgres, donde se alojan datos de clientes, entrenadores, ejercicios, progreso historico de cada cliente, rutinas, etc.


