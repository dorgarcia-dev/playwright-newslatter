// Posts del foro: cada uno desarrolla un punto del taller (diapositivas 9 y 13–19).
/**
 * @typedef {object} ForumPost
 * @property {number} id
 * @property {string} author
 * @property {string} role
 * @property {string} date ISO, se formatea en la vista
 * @property {string} slide
 * @property {string[]} tags
 * @property {string} title
 * @property {string[]} paragraphs
 * @property {string} [code]
 * @property {number} replies
 */

/** @type {ForumPost[]} */
export const FORUM_POSTS = [
  {
    id: 1,
    author: 'Lucía Fernández',
    role: 'QA Lead',
    date: '2026-10-06',
    slide: 'Diapositiva 9',
    tags: ['un/happy path', 'diseño de casos'],
    title: 'Un/happy path: pensar antes de escribir el primer test',
    paragraphs: [
      'Propongo un ejercicio antes de abrir el editor: el caso es «un usuario se suscribe a la newsletter». ¿Cómo sabemos que ha ido bien? ¿Aparece un mensaje de confirmación? ¿Qué pasa con un formato de correo incorrecto, con el campo en blanco al pulsar Suscribirse, con un usuario que ya estaba dado de alta o cuando el servidor falla?',
      'El happy path es el primero que se escribe y el último que falla. Son los casos raros los que encuentran errores de verdad, así que conviene listarlos en grupo antes de tocar código.',
      'Este hábito será clave en la sesión 4: cuando la IA nos proponga tests, lo primero será comprobar qué casos se ha dejado fuera.',
    ],
    replies: 18,
  },
  {
    id: 2,
    author: 'Javier Ortega',
    role: 'Desarrollador frontend',
    date: '2026-10-08',
    slide: 'Diapositiva 13',
    tags: ['auto-waiting', 'flaky tests'],
    title: 'Auto-waiting: ¿por qué sobran los sleeps?',
    paragraphs: [
      'Antes de hacer clic, Playwright espera a que el elemento sea visible, esté estable, reciba eventos y esté habilitado. Y lo reintenta hasta el timeout (30 s por test por defecto).',
      'Por eso un waitForTimeout casi siempre es un error: hace el test lento y además sigue siendo frágil. Si la condición no se cumple a tiempo, el test falla con un mensaje claro, que es justo lo que queremos.',
    ],
    code: `await page.waitForTimeout(3000); // ✗ lento y frágil
await page.getByRole('button', { name: 'Guardar' }).click(); // ✓ ya espera`,
    replies: 11,
  },
  {
    id: 3,
    author: 'Marta Gil',
    role: 'Accesibilidad y QA',
    date: '2026-10-10',
    slide: 'Diapositivas 15–17',
    tags: ['locators', 'accesibilidad', 'modo estricto'],
    title: 'Qué locator elegir (y cómo acotarlo)',
    paragraphs: [
      'Un locator es perezoso: no busca hasta que se usa y vuelve a buscar en cada intento. Se crea sin await y puedes guardarlo en una constante. Es la pieza que hace posible el auto-waiting.',
      'El orden recomendado: getByRole primero (como lo percibe el usuario y la tecnología de accesibilidad), luego getByLabel y getByPlaceholder para formularios, getByText para elementos no interactivos y getByTestId cuando no hay nada mejor. CSS y XPath se rompen al cambiar estilos o estructura.',
      'Si un locator encuentra varios elementos, la acción falla: es el modo estricto, y nos evita hacer clic en el elemento equivocado. Mejor acotar filtrando por contenido que por posición con nth o first.',
    ],
    code: `page.getByRole('listitem').filter({ hasText: 'Comprar pan' })
  .getByRole('button', { name: 'Borrar' });`,
    replies: 24,
  },
  {
    id: 4,
    author: 'Pablo Romero',
    role: 'SDET',
    date: '2026-10-13',
    slide: 'Diapositiva 18',
    tags: ['acciones', 'formularios'],
    title: 'Acciones: fill() es lo normal, type() ya está deprecado',
    paragraphs: [
      'Las acciones más comunes: click() (y dblclick()), fill() para rellenar un campo de golpe, press() para teclas como Enter o Escape, check() y uncheck() para checkboxes, selectOption(), hover() y setInputFiles() para subir ficheros.',
      'Ojo con type(): está deprecado desde la v1.38. Si la app necesita de verdad que se escriba carácter a carácter, usa pressSequentially(); en el resto de casos, fill(). Y recuerda que todas las acciones esperan solas a que el elemento esté listo.',
    ],
    code: `await page.getByLabel('Correo').fill('ana@orvium.io');
await page.getByLabel('Recordarme').check();
await page.getByLabel('Contraseña').press('Enter');`,
    replies: 9,
  },
  {
    id: 5,
    author: 'Elena Sánchez',
    role: 'Tech Lead',
    date: '2026-10-15',
    slide: 'Diapositiva 14',
    tags: ['aserciones', 'web-first'],
    title: 'Aserciones web-first: dónde va el await lo cambia todo',
    paragraphs: [
      'Si lees el texto una vez con textContent() y luego comparas, el test falla si la página todavía pone «Enviando…». No hay reintento.',
      'Con await expect(locator).toHaveText(...) Playwright reintenta (5 s por defecto) hasta que el texto coincide. Regla práctica: si compruebas algo de la página, usa expect(locator).toX(). Lo repasaremos al revisar código generado por IA, que a menudo cae en la versión sin reintento.',
    ],
    code: `// ✗ Sin reintento
expect(await page.getByTestId('status').textContent()).toBe('Enviado');

// ✓ Con reintento
await expect(page.getByTestId('status')).toHaveText('Enviado');`,
    replies: 15,
  },
  {
    id: 6,
    author: 'Diego Navarro',
    role: 'Desarrollador full stack',
    date: '2026-10-17',
    slide: 'Diapositiva 19',
    tags: ['aserciones', 'chuleta'],
    title: 'Chuleta de aserciones que reintentan solas',
    paragraphs: [
      'Las que más uso: toBeVisible(), toHaveText() (exacto) frente a toContainText() (contiene), toHaveCount() para listas, toHaveValue() para inputs, toBeChecked() y toBeEnabled(), toHaveAttribute() y toHaveClass(). A nivel de página, toHaveURL() y toHaveTitle().',
      'Todas reintentan solas y se pueden negar con .not. Varias admiten arrays, muy cómodo para comprobar una lista entera de una vez.',
    ],
    code: `await expect(page.getByTestId('todo-item')).toHaveCount(3);
await expect(page).toHaveURL(/foro/);
await expect(page.getByRole('dialog')).not.toBeVisible();`,
    replies: 7,
  },
];
