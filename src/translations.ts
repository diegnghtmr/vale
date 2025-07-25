export const translations = {
  en: {
    common: {
      language: "Language",
      english: "English",
      spanish: "Spanish",
      appTitle: "vale",
      appDescription: "Versatile Academic Logistics Environment",
      languageChangeError: "Failed to change language",
      languageChanged: "Changed to English",
      changingTheme: "Switching to {{theme}} mode...",
      darkMode: "dark",
      lightMode: "light"
    },
    courseForm: {
      title: "Course Details",
      courseName: "Course Name",
      courseNamePlaceholder: "e.g., Mathematics 101",
      credits: "Credits",
      creditsPlaceholder: "e.g., 3",
      semester: "Semester",
      semesterPlaceholder: "e.g., 2",
      timeSlot: "Time Slot",
      timeSlotDay: "Day (Diurna)",
      timeSlotNight: "Night (Nocturna)",
      group: "Group",
      groupPlaceholder: "e.g., 1A",
      classroom: "Classroom",
      classroomPlaceholder: "e.g., D4-401 AULA",
      details: "Details",
      detailsPlaceholder: "e.g., Python Language, Additional information",
      schedule: "Schedule",
      addCourse: "Add Course",
      updateCourse: "Update Course",
      updateSuccess: "Course updated successfully!",
      addSuccess: "Course added successfully!",
      submit: "Save Course",
      cancel: "Cancel",
      addTimeSlot: "Add Time Slot",
      remove: "Remove",
      day: "Day",
      startTime: "Start Time",
      endTime: "End Time",
      noTimeSlots: "No time slots added yet. Click \"Add Time Slot\" to begin.",
      errorNoTimeSlot: "Please add at least one time slot",
      days: {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday"
      }
    },
    courseList: {
      title: "Courses",
      noCourses: "No courses available",
      deleteSuccess: "Course deleted successfully!",
      completed: "\"{{name}}\" marked as completed!",
      uncompleted: "\"{{name}}\" marked as incomplete!",
      completedMultiple: "{{count}} courses of \"{{name}}\" marked as completed!",
      uncompletedMultiple: "{{count}} courses of \"{{name}}\" marked as incomplete!",
      courseCount_one: "{{count}} course",
      courseCount_other: "{{count}} courses",
      actions: {
        edit: "Edit",
        delete: "Delete",
        addToCalendar: "Add to Calendar",
        removeFromCalendar: "Remove from Calendar",
        save: "Save",
        cancel: "Cancel"
      }
    },
    courseFilters: {
      title: "Filters",
      semester: "Semester",
      timeSlot: "Time Slot",
      credits: "Credits",
      allSemesters: "All Semesters",
      allTimeSlots: "All Time Slots",
      allCredits: "All Credits",
      searchByName: "Search by name",
      semesterNumber: "Semester {{number}}",
      creditValue_one: "{{count}} Credit",
      creditValue_other: "{{count}} Credits"
    },
    fileUpload: {
      dragAndDrop: "Drag and drop a JSON or CSV file here, or click to select",
      dropHere: "Drop the file here...",
      browse: "Browse files",
      uploading: "Uploading...",
      success: "File uploaded successfully!",
      supportedFormats: "Only JSON and CSV files are supported",
      readAborted: "File reading was aborted",
      readError: "File reading has failed",
      invalidFormat: "Invalid file format: expected an array of courses",
      unknownError: "Unknown error occurred",
      processingError: "Error processing file: {{error}}",
      missingColumns: "Missing required columns: {{columns}}",
      missingData: "Row {{row}}: Missing required data",
      invalidDay: "Row {{row}}: Invalid day \"{{day}}\"",
      invalidTimeSlot: "Row {{row}}: Invalid time slot \"{{timeSlot}}\". Must be \"day\" or \"night\"",
      invalidTimeFormat: "Row {{row}}: Invalid time format",
      invalidCourse: "Invalid course",
      unnamedCourse: "Unnamed course",
      uploadSchedule: "Import"
    },
    periodSelector: {
      title: "Load Academic Period",
      selectPeriod: "-- Select period --",
      loading: "Loading...",
      loadingData: "Loading academic period data...",
      helpText: "Select a period to automatically load available courses"
    },
    calendar: {
      title: "Schedule",
      today: "Today",
      month: "Month",
      week: "Week",
      day: "Day",
      totalCredits: "Total Credits",
      scheduledCourses: "Scheduled Courses",
      scheduledCoursesCount_one: "{{count}} Scheduled Course",
      scheduledCoursesCount_other: "{{count}} Scheduled Courses",
      conflictDetected: "Schedule Conflict Detected:",
      courseToAdd: "Course to add",
      conflictsWith: "Conflicts with",
      timeOverlap: "Time overlap",
      existingSlot: "Existing slot",
      selectDifferentTime: "Please select a different time slot for this course.",
      courseAdded: "Course added to calendar!",
      courseRemoved: "Course removed from calendar!",
      eventDetails: {
        title: "Event Details",
        course: "Course",
        schedule: "Schedule",
        day: "Day",
        time: "Time",
        classroom: "Classroom",
        credits: "Credits",
        details: "Additional Details"
      }
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Manage your academic subjects progress",
      completedSubjects: "Completed Subjects",
      totalSubjects: "Total Subjects",
      completedCredits: "Completed Credits",
      progress: "Progress",
      overallProgress: "Overall Progress",
      filters: "Filters",
      semester: "Semester",
      status: "Status",
      search: "Search",
      allSemesters: "All semesters",
      allStatuses: "All statuses",
      completed: "Completed",
      pending: "Pending",
      searchPlaceholder: "Search by name...",
      resetFilters: "Clear Filters",
      subjects: "Subjects",
      subjectsFound: "subjects found",
      noSubjects: "No subjects found with the applied filters",
      semesterLabel: "Semester",
      creditsLabel: "Credits",
      statusLabel: "Status",
      groupLabel: "Group",
      markComplete: "Mark Complete",
      markIncomplete: "Mark Incomplete",
      semesterNumber: "Semester {{number}}"
    },
    github: {
      title: "Open Source Project",
      subtitle: "Help us grow!",
      description: "Vale is an open source project that helps students manage their academic schedules. If you find it useful, please consider giving us a star on GitHub!",
      starButton: "Star on GitHub",
      badgeText: "Star us!"
    }
  },
  es: {
    common: {
      language: "Idioma",
      english: "Inglés",
      spanish: "Español",
      appTitle: "vale",
      appDescription: "Entorno Logístico Académico Versátil",
      languageChangeError: "Error al cambiar el idioma",
      languageChanged: "Cambiado a Español",
      changingTheme: "Cambiando a modo {{theme}}...",
      darkMode: "oscuro",
      lightMode: "claro"
    },
    courseForm: {
      title: "Detalles del Curso",
      courseName: "Nombre del Curso",
      courseNamePlaceholder: "ej., Matemáticas 101",
      credits: "Créditos",
      creditsPlaceholder: "ej., 3",
      semester: "Semestre",
      semesterPlaceholder: "ej., 2",
      timeSlot: "Jornada",
      timeSlotDay: "Diurna",
      timeSlotNight: "Nocturna",
      group: "Grupo",
      groupPlaceholder: "ej., 1A",
      classroom: "Aula",
      classroomPlaceholder: "ej., D4-401 AULA",
      details: "Detalles",
      detailsPlaceholder: "ej., Lenguaje Python, Información adicional",
      schedule: "Horario",
      addCourse: "Agregar Curso",
      updateCourse: "Actualizar Curso",
      updateSuccess: "¡Curso actualizado exitosamente!",
      addSuccess: "¡Curso agregado exitosamente!",
      submit: "Guardar Curso",
      cancel: "Cancelar",
      addTimeSlot: "Agregar Horario",
      remove: "Eliminar",
      day: "Día",
      startTime: "Hora de Inicio",
      endTime: "Hora de Fin",
      noTimeSlots: "No hay horarios agregados. Haz clic en \"Agregar Horario\" para comenzar.",
      errorNoTimeSlot: "Por favor agrega al menos un horario",
      days: {
        monday: "Lunes",
        tuesday: "Martes",
        wednesday: "Miércoles",
        thursday: "Jueves",
        friday: "Viernes",
        saturday: "Sábado"
      }
    },
    courseList: {
      title: "Cursos",
      noCourses: "No hay cursos disponibles",
      deleteSuccess: "¡Curso eliminado exitosamente!",
      completed: "\"{{name}}\" marcado como completado!",
      uncompleted: "\"{{name}}\" marcado como incompleto!",
      completedMultiple: "{{count}} cursos de \"{{name}}\" marcados como completados!",
      uncompletedMultiple: "{{count}} cursos de \"{{name}}\" marcados como incompletos!",
      courseCount_one: "{{count}} curso",
      courseCount_other: "{{count}} cursos",
      actions: {
        edit: "Editar",
        delete: "Eliminar",
        addToCalendar: "Agregar al Calendario",
        removeFromCalendar: "Quitar del Calendario",
        save: "Guardar",
        cancel: "Cancelar"
      }
    },
    courseFilters: {
      title: "Filtros",
      semester: "Semestre",
      timeSlot: "Jornada",
      credits: "Créditos",
      allSemesters: "Todos los Semestres",
      allTimeSlots: "Todas las Jornadas",
      allCredits: "Todos los Créditos",
      searchByName: "Buscar por nombre",
      semesterNumber: "Semestre {{number}}",
      creditValue_one: "{{count}} Crédito",
      creditValue_other: "{{count}} Créditos"
    },
    fileUpload: {
      dragAndDrop: "Arrastra y suelta un archivo JSON o CSV aquí, o haz clic para seleccionar",
      dropHere: "Suelta el archivo aquí...",
      browse: "Explorar archivos",
      uploading: "Subiendo...",
      success: "¡Archivo subido exitosamente!",
      supportedFormats: "Solo se admiten archivos JSON y CSV",
      readAborted: "La lectura del archivo fue interrumpida",
      readError: "La lectura del archivo ha fallado",
      invalidFormat: "Formato de archivo inválido: se esperaba un array de cursos",
      unknownError: "Ocurrió un error desconocido",
      processingError: "Error procesando archivo: {{error}}",
      missingColumns: "Faltan columnas requeridas: {{columns}}",
      missingData: "Fila {{row}}: Faltan datos requeridos",
      invalidDay: "Fila {{row}}: Día inválido \"{{day}}\"",
      invalidTimeSlot: "Fila {{row}}: Jornada inválida \"{{timeSlot}}\". Debe ser \"day\" o \"night\"",
      invalidTimeFormat: "Fila {{row}}: Formato de hora inválido",
      invalidCourse: "Curso inválido",
      unnamedCourse: "Curso sin nombre",
      uploadSchedule: "Importar"
    },
    periodSelector: {
      title: "Cargar Período Académico",
      selectPeriod: "-- Seleccionar período --",
      loading: "Cargando...",
      loadingData: "Cargando datos del período académico...",
      helpText: "Selecciona un período para cargar automáticamente los cursos disponibles"
    },
    calendar: {
      title: "Calendario",
      today: "Hoy",
      month: "Mes",
      week: "Semana",
      day: "Día",
      totalCredits: "Créditos Totales",
      scheduledCourses: "Cursos Programados",
      scheduledCoursesCount_one: "{{count}} Curso Programado",
      scheduledCoursesCount_other: "{{count}} Cursos Programados",
      conflictDetected: "Conflicto de Horario Detectado:",
      courseToAdd: "Curso a agregar",
      conflictsWith: "Conflicto con",
      timeOverlap: "Superposición de tiempo",
      existingSlot: "Horario existente",
      selectDifferentTime: "Por favor selecciona un horario diferente para este curso.",
      courseAdded: "¡Curso agregado al calendario!",
      courseRemoved: "¡Curso removido del calendario!",
      eventDetails: {
        title: "Detalles del Evento",
        course: "Curso",
        schedule: "Horario",
        day: "Día",
        time: "Hora",
        classroom: "Aula",
        credits: "Créditos",
        details: "Detalles Adicionales"
      }
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Gestiona el progreso de tus materias académicas",
      completedSubjects: "Materias Completadas",
      totalSubjects: "Total de Materias",
      completedCredits: "Créditos Completados",
      progress: "Progreso",
      overallProgress: "Progreso General",
      filters: "Filtros",
      semester: "Semestre",
      status: "Estado",
      search: "Buscar",
      allSemesters: "Todos los semestres",
      allStatuses: "Todos los estados",
      completed: "Completada",
      pending: "Pendiente",
      searchPlaceholder: "Buscar por nombre...",
      resetFilters: "Limpiar Filtros",
      subjects: "Materias",
      subjectsFound: "materias encontradas",
      noSubjects: "No se encontraron materias con los filtros aplicados",
      semesterLabel: "Semestre",
      creditsLabel: "Créditos",
      statusLabel: "Estado",
      groupLabel: "Grupo",
      markComplete: "Marcar Completa",
      markIncomplete: "Marcar Incompleta",
      semesterNumber: "Semestre {{number}}"
    },
    github: {
      title: "Proyecto Open Source",
      subtitle: "¡Ayúdanos a crecer!",
      description: "Vale es un proyecto de código abierto que ayuda a los estudiantes a gestionar sus horarios académicos. Si te resulta útil, ¡considera darnos una estrella en GitHub!",
      starButton: "Dar Estrella en GitHub",
      badgeText: "¡Danos una estrella!"
    }
  }
};