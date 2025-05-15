##  Explicación del sistema de tests automáticos con Supabase + Jest

###  ¿Qué estamos testeando?

Este proyecto realiza pruebas automáticas sobre una base de datos PostgreSQL gestionada con **Supabase**. Las tablas que se testean son:

- `usuarios`
- `robots`
- `informes`

Cada test sigue la estructura de **crear, verificar y eliminar** un registro temporalmente, para asegurar que la base de datos responde correctamente a operaciones básicas (CRUD).

---

###  Herramientas utilizadas

- **Jest**: framework de testing en JavaScript.
- **Supabase JS Client**: cliente oficial de Supabase para realizar operaciones SQL vía API REST.
- **PostgreSQL**: base de datos relacional.
- **Supabase Studio**: panel de control web para gestionar las tablas, roles y políticas RLS.

---

###  Estructura general de un test

Cada test sigue la misma lógica:

```js
test('Nombre del test', async () => {
  // 1. Insertar un nuevo registro
  const { data: insertData, error: insertError } = await supabase
    .from('tabla')
    .insert([nuevoObjeto])
    .select();

  // 2. Verificar que no haya errores
  expect(insertError).toBeNull();
  expect(insertData).not.toBeNull();
  expect(insertData).toHaveLength(1);
  expect(insertData[0].campo).toBe(valorEsperado);

  // 3. Eliminar el registro de prueba
  const { error: deleteError } = await supabase
    .from('tabla')
    .delete()
    .eq('clave', valor);
  expect(deleteError).toBeNull();
});
```

---

###  Detalles clave

####  `.select()` después de `.insert()`
Por defecto, Supabase no devuelve el objeto insertado. Usamos `.select()` para forzar que lo devuelva y poder verificar los datos insertados.

####  `beforeEach(...)`
Antes de cada test, se limpia cualquier posible entrada previa que podría interferir (por ejemplo, un usuario con el mismo `num_placa`). También se aseguran dependencias, como que existan `usuarios` o `robots` antes de insertar en `informes`.

####  Control de errores
Después de cada operación (inserción o eliminación), se verifica que no haya errores con:

```js
expect(error).toBeNull();
```

Esto garantiza que la operación fue válida y no violó ninguna restricción (como claves foráneas).

---

###  Sobre RLS (Row-Level Security)

- **RLS está desactivado** actualmente, lo que permite que los tests funcionen sin problemas de permisos.
- Si en el futuro decides activarlo, deberás definir políticas `INSERT` y `DELETE` explícitas para permitir que los tests funcionen.

---

###  Resultado final esperado

Cuando ejecutas:

```bash
npm test
```

Deberías ver:

```
 PASS  test/usuarios.test.js
 PASS  test/robots.test.js
 PASS  test/informes.test.js

Test Suites: 3 passed, 3 total
Tests:       3 passed, 3 total
```

---

###  Limpieza automática

Todos los registros creados en los tests se eliminan al final de cada prueba, por lo que **la base de datos no se contamina** con datos de testeo.
