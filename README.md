# My_RESTaurante
## Estrucutra del Git (GitFlow)
Como parte del control de versiones y para trabajar de la manera más eficiente y modularizada en el proyecto, se utilizará la estructura de GitFlow, la cual se explica a continuación.
### Master (Main)
- Esta rama cuenta con la versión estable del código, es decir es software listo para producción
- Para poder integrar cambios en esta rama, se debe aceptar el "Pull Request" por parte de todos los miembros.
### Release 
- Esta rama está dedicada a alojar un código estable al cual se le harán pruebas antes de enviar a la rama principal.
- Esta rama recibe el código estable de la rama "Develop".
### Develop
- Considerada la rama central de desarrollo.
- Aqui se integran todas las ramas de características del software.
### Ramas Características (Features)
- Por cada caracteísitca que se le agregue al software se creará una rama de este tipo.
- Al ser un proyecto de pequeña escala, cada rama será trabajada únicamente por un desarrollador.
- Al crear un rama característica esta se creara a raíz de develop.
### Hotfixes
- Esta es una rama intermedia entre la rama main y develop.
- Consta en un rama para arreglos rápidos de errores presentados en el master.
- Si el error requiere una solución compleja se envía de vuelta a develop.
- Una vez solucionado el error se integra al main.

Se adjunta un diagrama con el flujo y estructura de versionamiento.
![Diagrama de GitFlow](https://i0.wp.com/lanziani.com/slides/gitflow/images/gitflow_1.png)

## Convención de Commits
- Por convención se manejará los mensajes de los commits en inglés.
- Cada commit debe tener un mensaje significativo.
- Con el fin de mantener el orden, se recomienda colocar una "etiqueta" al mensaje del commit para entender el cambio.
- Las etiquetas pueden ser [ADD], [DELETE], [FIX], [UPDATE].
- Ejemplo de un mensaje sería: [ADD] GUI to the web server
