# Dashboard de Ventas - Prueba Técnica

## Enfoque y Decisiones Técnicas
Aunque la consigna original sugería el uso de SQL para el procesamiento de datos, opte por realizar todo el manejo, limpieza y análisis de datos directamente en JavaScript. Esto permite una mayor flexibilidad en el entorno web al trabajar sin backend.

## Estructura del Proyecto
src/queries/: Contiene todas las funciones de análisis de datos, equivalentes a consultas SQL pero implementadas en JS.
src/data/: Archivos CSV originales.
src/components/: Componentes visuales del dashboard.
src/store/: Manejo de estado global.
src/utils/: Utilidades y mapeos.


## Procesamiento de Datos en JS vs SQL
Las funciones en queries replican la lógica de consultas SQL, pero usando métodos de arrays y objetos en JS. Por ejemplo:

# SQL Tradicional	Función JS (queries)

SELECT articulo, SUM(unidades) FROM ventas GROUP BY articulo ORDER BY SUM(unidades) DESC LIMIT 10	*getRankingProductos()* agrupa, suma y ordena usando .reduce(), .sort() y .slice()


SELECT estacion, SUM(facturacion) FROM ventas GROUP BY estacion ORDER BY SUM(facturacion) DESC LIMIT 3	*getTopEstacionesFacturacion()* hace el mismo cálculo con métodos JS

SELECT articulo, SUM(facturacion) FROM ventas GROUP BY articulo	*getParticipacionArticulos()* calcula la participación de cada artículo

el análisis de datos es el mismo, solo cambia el lenguaje y las herramientas.



##  Limpieza y Normalización de Datos
Antes de cualquier análisis, los datos de los CSV son limpiados y normalizados:

Conversión de strings numéricos a números.
Eliminación de filas vacías o corruptas.
Unificación de nombres y formatos.
Detección dinámica de artículos de tipo “combustible” para evitar hardcodeos.
Esto asegura que los resultados sean precisos y que el dashboard sea robusto ante cambios en los datos de entrada.



## visualización y UX
React + Zustand para el manejo de estado y renderizado eficiente.
Tailwind CSS para un diseño responsive y moderno.
Recharts para gráficos interactivos.

