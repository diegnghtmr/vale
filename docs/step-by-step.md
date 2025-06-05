# Mejoras para el proyecto

## Errores actuales

- `npm run lint` falla con el mensaje `Cannot find package '@eslint/js'`.
- `npm run typecheck` arroja varios errores de TypeScript por dependencias faltantes.

Instalar todas las dependencias con `npm install` para que los comandos funcionen correctamente.

## Funcionalidades propuestas

1. **Exportar calendario**
   - Añadir un botón en la vista de `Calendar` para descargar el horario.
   - Permitir elegir entre archivos **iCal** (.ics) y **CSV**.
   - Ofrecer la opción de filtrar por semana o rango de fechas antes de exportar.
2. **Edición rápida en la lista de cursos**
   - Desde `CourseList` se podrá activar un modo de edición en línea.
   - Al hacer clic en el ícono de lápiz se mostrará un pequeño formulario en la misma fila para cambiar nombre, grupo o créditos.
   - Al guardar, la lista se actualizará sin necesidad de recargar la página.
3. **Sincronización con un backend**
   - Implementar un servicio `api.ts` que se comunique con endpoints REST.
   - Guardar cursos, preferencias de idioma y tema para que estén disponibles al iniciar sesión en diferentes dispositivos.
   - Utilizar `axios` para las peticiones y manejar posibles errores con mensajes de `toast`.
4. **Detección avanzada de solapamientos**
   - Validar en tiempo real los horarios al crear o editar un curso.
   - Mostrar un aviso claro indicando qué asignaturas entran en conflicto y en qué franja horaria.
   - Permitir corregir rápidamente el horario desde el mismo formulario.
5. **Filtro por créditos y semestre en el calendario**
   - Incluir un panel de filtros con controles para seleccionar número de créditos y semestre.
   - Los filtros afectarán tanto a `CourseList` como al calendario para ver sólo las asignaturas deseadas.
6. **Tema y lenguaje persistentes**
   - `ThemeContext` y `LanguageContext` ya guardan la selección en `localStorage`.
   - Ampliar la lógica para sincronizar estas preferencias con el backend cuando el usuario esté autenticado.
7. **Atajos de teclado**
   - Definir combinaciones como `N` para un nuevo curso, `Ctrl+S` para guardar cambios y `?` para mostrar la ayuda.
   - Documentar todos los atajos en el futuro README para facilitar su descubrimiento.
