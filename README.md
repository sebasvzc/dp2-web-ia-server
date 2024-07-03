# dp2-web-ia-server

Este es el frontend y backend de la web que desarrollamos.

## Despliegue

Primero hay que clonar el repositorio.

```sh
git clone https://github.com/sebasvzc/dp2-web-ia-server.git
cd dp2-web-ia-server
```

### Back-End

El sistema de empaquetado es maven, por lo que tendremos que usar esta herramienta para compilar el proyecto una vez dentro del directorio.
```sh
chmod +x deploy_web.sh
./myscript.sh 3.218.68.113/api
```

### Front-End

Para desplegar el sistema se debe correr el siguiente script, introduciendo la direccion url base a la cual se deplegara el sistema. Por ejemplo:

```sh
chmod +x deploy_web.sh
./deploy_web.sh http://3.218.68.113
```

### IA

