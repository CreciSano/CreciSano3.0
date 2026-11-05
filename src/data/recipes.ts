import {
  AppNotification,
  CommunityPost,
  PremiumCollection,
  Recipe,
  RecipeCategory,
  RecipeMatchResult,
} from '../types';

export const HERO_KITCHEN_IMAGE =
  '/src/assets/images/hero_fresh_kitchen_1793832462792.jpg';

export const CATEGORY_METADATA: Record<
  RecipeCategory,
  { title: RecipeCategory; description: string; image: string }
> = {
  Desayunos: {
    title: 'Desayunos',
    description:
      'Comienza el día con energía: panqueques de avena, tortillas de verduras, tostadas con palta y opciones nutritivas para toda la familia.',
    image: '/src/assets/images/recipe_avocado_toast_1793832462881.jpg',
  },
  Almuerzos: {
    title: 'Almuerzos',
    description:
      'Platos completos, balanceados y rendidores con pollo, legumbres, granos integrales y vegetales frescos.',
    image: '/src/assets/images/recipe_quinoa_bowl_1793832461748.jpg',
  },
  Cenas: {
    title: 'Cenas',
    description:
      'Preparaciones ligeras, reconfortantes y fáciles de digerir para cerrar el día sin complicaciones.',
    image: '/src/assets/images/recipe_salmon_greens_1793832464854.jpg',
  },
  'Bebidas y jugos naturales': {
    title: 'Bebidas y jugos naturales',
    description:
      'Jugos frescos, batidos cremosos, smoothies de frutas e infusiones naturales sin azúcares añadidos.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
  },
  'Loncheras saludables': {
    title: 'Loncheras saludables',
    description:
      'Ideas prácticas, nutritivas y fáciles de transportar para el colegio, el trabajo o salidas en familia.',
    image: '/src/assets/images/hero_fresh_kitchen_1793832462792.jpg',
  },
  Postres: {
    title: 'Postres',
    description:
      'Dulces caseros saludables endulzados naturalmente con frutas, avena, yogur y cacao.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
  },
  'Snacks y aperitivos': {
    title: 'Snacks y aperitivos',
    description:
      'Meriendas rápidas y nutritivas para calmar el hambre entre comidas con ingredientes naturales.',
    image: '/src/assets/images/hero_fresh_kitchen_1793832462792.jpg',
  },
  'Recetas económicas': {
    title: 'Recetas económicas',
    description:
      'Preparaciones deliciosas y abundantes con ingredientes accesibles de la despensa diaria.',
    image: '/src/assets/images/recipe_quinoa_bowl_1793832461748.jpg',
  },
  'Recetas saludables': {
    title: 'Recetas saludables',
    description:
      'Equilibrio nutricional con alimentos reales, fibra, proteínas de calidad y grasas saludables.',
    image: '/src/assets/images/recipe_salmon_greens_1793832464854.jpg',
  },
  'Recetas rápidas': {
    title: 'Recetas rápidas',
    description:
      'Listas en 15 minutos o menos para esos días con poco tiempo en la cocina.',
    image: '/src/assets/images/recipe_avocado_toast_1793832462881.jpg',
  },
};

export const PREMIUM_COLLECTIONS: PremiumCollection[] = [
  {
    id: 'col-desayunos',
    title: '10 desayunos nutritivos',
    subtitle: 'Opciones energéticas y rápidas para mañanas en familia',
    recipeCountLabel: '10 preparaciones',
    image: '/src/assets/images/recipe_avocado_toast_1793832462881.jpg',
    categoryFilter: 'Desayunos',
  },
  {
    id: 'col-almuerzos',
    title: '15 almuerzos familiares',
    subtitle: 'Platos completos que rinden para todos en casa',
    recipeCountLabel: '15 preparaciones',
    image: '/src/assets/images/recipe_quinoa_bowl_1793832461748.jpg',
    categoryFilter: 'Almuerzos',
  },
  {
    id: 'col-cenas',
    title: '10 cenas ligeras',
    subtitle: 'Recetas suaves y nutritivas listas en pocos minutos',
    recipeCountLabel: '10 preparaciones',
    image: '/src/assets/images/recipe_salmon_greens_1793832464854.jpg',
    categoryFilter: 'Cenas',
  },
  {
    id: 'col-postres',
    title: '10 postres saludables',
    subtitle: 'Dulces caseros sin harinas ni azúcares refinados',
    recipeCountLabel: '10 preparaciones',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    categoryFilter: 'Postres',
  },
  {
    id: 'col-bebidas',
    title: '15 bebidas naturales',
    subtitle: 'Jugos, smoothies y batidos llenos de vitaminas',
    recipeCountLabel: '15 preparaciones',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    categoryFilter: 'Bebidas y jugos naturales',
  },
  {
    id: 'col-loncheras',
    title: '10 loncheras creativas',
    subtitle: 'Ideas variadas que encantan a niños y adultos',
    recipeCountLabel: '10 preparaciones',
    image: '/src/assets/images/hero_fresh_kitchen_1793832462792.jpg',
    categoryFilter: 'Loncheras saludables',
  },
  {
    id: 'col-especiales',
    title: 'Recetas para ocasiones especiales',
    subtitle: 'Platos vistosos para celebrar en familia',
    recipeCountLabel: '8 preparaciones',
    image: '/src/assets/images/recipe_salmon_greens_1793832464854.jpg',
    categoryFilter: 'Almuerzos',
  },
];

export const INGREDIENT_GROUPS: { group: string; items: string[] }[] = [
  {
    group: 'Verduras y hortalizas',
    items: [
      'Papa',
      'Zanahoria',
      'Aguacate',
      'Tomate',
      'Espinaca',
      'Brócoli',
      'Cebolla',
      'Ajo',
      'Pimiento',
      'Calabacín',
      'Camote',
      'Pepino',
    ],
  },
  {
    group: 'Proteínas y lácteos',
    items: [
      'Pollo',
      'Huevo',
      'Salmón',
      'Atún',
      'Garbanzos',
      'Lentejas',
      'Tofu',
      'Yogur griego',
      'Queso fresco',
      'Leche',
    ],
  },
  {
    group: 'Granos y despensa',
    items: [
      'Arroz',
      'Quinoa',
      'Avena',
      'Pan integral',
      'Pasta integral',
      'Tortilla de maíz',
      'Aceite de oliva',
      'Semillas de chía',
      'Granola',
    ],
  },
  {
    group: 'Frutas y extras',
    items: [
      'Plátano',
      'Limón',
      'Papaya',
      'Fresas',
      'Piña',
      'Mango',
      'Naranja',
      'Manzana',
      'Arándanos',
      'Miel',
      'Canela',
      'Cacao en polvo',
    ],
  },
];

export const INITIAL_RECIPES: Recipe[] = [
  // === ALMUERZOS & EJEMPLO PRINCIPAL (Pollo, Papa, Zanahoria, Arroz) ===
  {
    id: 'arroz-pollo-papa-zanahoria',
    title: 'Arroz casero con pollo, papa y zanahoria',
    description:
      'Un clásico familiar reconfortante, económico y nutritivo en una sola olla con pollo tierno, papas, zanahoria y arroz.',
    image: '/src/assets/images/recipe_quinoa_bowl_1793832461748.jpg',
    prepTimeMinutes: 30,
    difficulty: 'Fácil',
    servings: 4,
    categories: ['Almuerzos', 'Recetas económicas', 'Recetas saludables'],
    isPopular: true,
    ingredients: [
      {
        name: 'Pollo',
        amount: '400 g en trozos',
        numericAmount: 400,
        unit: 'g',
        alternative: 'Pechuga de pavo o garbanzos cocidos',
      },
      {
        name: 'Papa',
        amount: '2 unidades medianas en cubos',
        numericAmount: 2,
        unit: 'unidades',
        alternative: 'Camote o yuca',
      },
      {
        name: 'Zanahoria',
        amount: '2 unidades en rodajas',
        numericAmount: 2,
        unit: 'unidades',
        alternative: 'Calabacín o zapallo',
      },
      {
        name: 'Arroz',
        amount: '1.5 tazas',
        numericAmount: 1.5,
        unit: 'tazas',
        alternative: 'Arroz integral o quinoa',
      },
      {
        name: 'Cebolla',
        amount: '1/2 unidad picada',
        numericAmount: 0.5,
        unit: 'unidad',
        alternative: 'Cebollín',
      },
      {
        name: 'Ajo',
        amount: '2 dientes picados',
        numericAmount: 2,
        unit: 'dientes',
        alternative: 'Ajo en polvo',
      },
      {
        name: 'Aceite de oliva',
        amount: '2 cucharadas',
        numericAmount: 2,
        unit: 'cdas',
        alternative: 'Aceite vegetal',
      },
    ],
    steps: [
      'En una olla amplia, calienta el aceite de oliva y dora los trozos de pollo sazonados con sal y ajo durante 5 minutos.',
      'Agrega la cebolla picada, la zanahoria en rodajas y las papas en cubos; sofríe 3 minutos para integrar los sabores.',
      'Incorpora el arroz lavado y mezcla suavemente durante 1 minuto.',
      'Añade 3 tazas de agua caliente o caldo, tapa la olla y cocina a fuego bajo durante 18 minutos hasta que el arroz y las papas estén tiernos.',
      'Deja reposar 5 minutos tapado antes de servir.',
    ],
    nutrition: {
      calories: 460,
      protein: '29 g',
      carbs: '56 g',
      fats: '12 g',
      fiber: '5 g',
    },
    tips: [
      'Corta las papas y zanahorias en cubos del mismo tamaño para que se cocinen de manera uniforme.',
      'Puedes añadir un poco de cilantro o perejil picado al final para dar frescura.',
    ],
    authorName: 'Equipo CreciSano',
  },

  // === SECCIÓN ESPECIAL DE DESAYUNOS (10 RECETAS) ===
  {
    id: 'panqueques-avena-platano',
    title: 'Panqueques de avena y plátano',
    description:
      'Suaves, naturalmente dulces y sin harina refinada. Ideales para el desayuno de toda la familia.',
    image: '/src/assets/images/recipe_avocado_toast_1793832462881.jpg',
    prepTimeMinutes: 15,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Desayunos', 'Recetas saludables', 'Recetas rápidas'],
    isPopular: true,
    ingredients: [
      {
        name: 'Plátano',
        amount: '2 unidades maduras',
        numericAmount: 2,
        unit: 'unidades',
        alternative: 'Puré de manzana',
      },
      {
        name: 'Avena',
        amount: '1 taza en hojuelas',
        numericAmount: 1,
        unit: 'taza',
        alternative: 'Harina integral',
      },
      {
        name: 'Huevo',
        amount: '2 unidades',
        numericAmount: 2,
        unit: 'unidades',
        alternative: '1 cucharada de chía hidratada',
      },
      {
        name: 'Leche',
        amount: '1/2 taza',
        numericAmount: 0.5,
        unit: 'taza',
        alternative: 'Bebida vegetal de avena o almendra',
      },
      {
        name: 'Canela',
        amount: '1/2 cucharadita',
        numericAmount: 0.5,
        unit: 'cdita',
        alternative: 'Esencia de vainilla',
      },
    ],
    steps: [
      'Coloca los plátanos, la avena, los huevos, la leche y la canela en la licuadora y procesa hasta obtener una mezcla homogénea.',
      'Calienta una sartén antiadherente a fuego medio-bajo.',
      'Vierte porciones de masa formando círculos y cocina 2 minutos hasta que aparezcan burbujas en la superficie.',
      'Voltea con cuidado y cocina 1 minuto más hasta dorar.',
    ],
    nutrition: {
      calories: 320,
      protein: '12 g',
      carbs: '48 g',
      fats: '9 g',
      fiber: '6 g',
    },
    tips: [
      'Mientras más maduro esté el plátano, más dulces quedarán sin necesidad de añadir azúcar.',
    ],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'tortilla-verduras',
    title: 'Tortilla de verduras',
    description:
      'Tortilla casera cargada de vegetales coloridos, perfecta para aprovechar lo que queda en la nevera.',
    image: '/src/assets/images/recipe_avocado_toast_1793832462881.jpg',
    prepTimeMinutes: 15,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Desayunos', 'Cenas', 'Recetas económicas', 'Recetas rápidas'],
    ingredients: [
      {
        name: 'Huevo',
        amount: '4 unidades',
        numericAmount: 4,
        unit: 'unidades',
      },
      {
        name: 'Espinaca',
        amount: '1.5 tazas picadas',
        numericAmount: 1.5,
        unit: 'tazas',
        alternative: 'Acelga',
      },
      {
        name: 'Tomate',
        amount: '1 unidad en cubitos',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Pimiento',
        amount: '1/2 unidad picada',
        numericAmount: 0.5,
        unit: 'unidad',
        alternative: 'Zanahoria rallada',
      },
      {
        name: 'Aceite de oliva',
        amount: '1 cucharada',
        numericAmount: 1,
        unit: 'cda',
      },
    ],
    steps: [
      'Saltea el pimiento y el tomate en una sartén con aceite de oliva durante 3 minutos.',
      'Añade la espinaca y cocina 1 minuto hasta que se ablande.',
      'Bate los huevos con una pizca de sal y viértelos sobre las verduras.',
      'Cocina a fuego bajo tapado por 5 minutos hasta que cuaje por completo.',
    ],
    nutrition: {
      calories: 250,
      protein: '16 g',
      carbs: '7 g',
      fats: '18 g',
      fiber: '2 g',
    },
    tips: ['Puedes doblarla por la mitad como media luna para servirla fácilmente.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'tostadas-palta-huevo',
    title: 'Tostadas con palta y huevo',
    description:
      'Desayuno energético listo en 10 minutos con pan integral crujiente, palta (aguacate) cremosa y huevo.',
    image: '/src/assets/images/recipe_avocado_toast_1793832462881.jpg',
    prepTimeMinutes: 10,
    difficulty: 'Fácil',
    servings: 1,
    categories: ['Desayunos', 'Recetas rápidas', 'Recetas saludables'],
    isPopular: true,
    ingredients: [
      {
        name: 'Pan integral',
        amount: '2 rebanadas',
        numericAmount: 2,
        unit: 'rebanadas',
        alternative: 'Tortilla de maíz',
      },
      {
        name: 'Aguacate',
        amount: '1/2 unidad (palta)',
        numericAmount: 0.5,
        unit: 'unidad',
        alternative: 'Queso fresco untable',
      },
      {
        name: 'Huevo',
        amount: '1 unidad',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Limón',
        amount: '1/2 unidad',
        numericAmount: 0.5,
        unit: 'unidad',
      },
    ],
    steps: [
      'Tuesta las rebanadas de pan integral hasta que estén doradas.',
      'Tritura la palta (aguacate) con un tenedor, jugo de limón y sal.',
      'Cocina el huevo pochado o a la plancha al punto que prefieras.',
      'Unta la palta sobre el pan y coloca el huevo encima.',
    ],
    nutrition: {
      calories: 350,
      protein: '14 g',
      carbs: '30 g',
      fats: '19 g',
      fiber: '7 g',
    },
    tips: ['Unas gotas de limón evitan que la palta se oxide y realzan su sabor.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'avena-con-frutas',
    title: 'Avena tibia con frutas frescas y canela',
    description:
      'Desayuno reconfortante, económico y rico en fibra soluble para mantener la saciedad toda la mañana.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    prepTimeMinutes: 10,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Desayunos', 'Recetas económicas', 'Recetas saludables', 'Recetas rápidas'],
    ingredients: [
      {
        name: 'Avena',
        amount: '1 taza en hojuelas',
        numericAmount: 1,
        unit: 'taza',
      },
      {
        name: 'Leche',
        amount: '2 tazas',
        numericAmount: 2,
        unit: 'tazas',
        alternative: 'Agua o bebida vegetal',
      },
      {
        name: 'Plátano',
        amount: '1 unidad en rodajas',
        numericAmount: 1,
        unit: 'unidad',
        alternative: 'Manzana picada',
      },
      {
        name: 'Fresas',
        amount: '1/2 taza picadas',
        numericAmount: 0.5,
        unit: 'taza',
        alternative: 'Arándanos',
      },
      {
        name: 'Canela',
        amount: '1/2 cucharadita',
        numericAmount: 0.5,
        unit: 'cdita',
      },
    ],
    steps: [
      'Calienta la leche con la canela en una olla pequeña a fuego medio.',
      'Agrega la avena y cocina moviendo constantemente durante 5 minutos hasta que espese.',
      'Sirve en dos tazones y decora con las rodajas de plátano y las fresas.',
    ],
    nutrition: {
      calories: 290,
      protein: '10 g',
      carbs: '49 g',
      fats: '6 g',
      fiber: '7 g',
    },
    tips: ['Añade una cucharadita de semillas de chía para sumar omega-3.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'sandwich-saludable',
    title: 'Sándwich saludable de pollo, palta y tomate',
    description:
      'Práctico para el desayuno o para llevar en la lonchera, con proteínas magras y vegetales frescos.',
    image: '/src/assets/images/hero_fresh_kitchen_1793832462792.jpg',
    prepTimeMinutes: 10,
    difficulty: 'Fácil',
    servings: 1,
    categories: ['Desayunos', 'Loncheras saludables', 'Recetas rápidas'],
    ingredients: [
      {
        name: 'Pan integral',
        amount: '2 rebanadas',
        numericAmount: 2,
        unit: 'rebanadas',
      },
      {
        name: 'Pollo',
        amount: '80 g desmenuzado o en láminas',
        numericAmount: 80,
        unit: 'g',
        alternative: 'Atún o huevo duro',
      },
      {
        name: 'Aguacate',
        amount: '1/3 unidad',
        numericAmount: 0.33,
        unit: 'unidad',
        alternative: 'Queso fresco',
      },
      {
        name: 'Tomate',
        amount: '3 rodajas',
        numericAmount: 3,
        unit: 'rodajas',
      },
      {
        name: 'Espinaca',
        amount: '1 puñado',
        numericAmount: 1,
        unit: 'puñado',
      },
    ],
    steps: [
      'Unta el aguacate triturado sobre una rebanada de pan integral.',
      'Coloca el pollo desmenuzado, las rodajas de tomate y las hojas de espinaca.',
      'Cubre con la otra rebanada de pan y corta en diagonal.',
    ],
    nutrition: {
      calories: 370,
      protein: '24 g',
      carbs: '34 g',
      fats: '15 g',
      fiber: '6 g',
    },
    tips: ['Si lo preparas para lonchera, envuélvelo en papel encerado para mantenerlo fresco.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'yogur-con-granola',
    title: 'Yogur griego con granola casera y frutos rojos',
    description:
      'Listo en 5 minutos, ideal para mañanas ocupadas con probióticos, calcio y antioxidantes.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    prepTimeMinutes: 5,
    difficulty: 'Fácil',
    servings: 1,
    categories: ['Desayunos', 'Snacks y aperitivos', 'Recetas rápidas'],
    ingredients: [
      {
        name: 'Yogur griego',
        amount: '1 taza natural',
        numericAmount: 1,
        unit: 'taza',
      },
      {
        name: 'Granola',
        amount: '1/3 taza',
        numericAmount: 0.33,
        unit: 'taza',
        alternative: 'Avena tostada',
      },
      {
        name: 'Fresas',
        amount: '1/2 taza',
        numericAmount: 0.5,
        unit: 'taza',
        alternative: 'Plátano o manzana',
      },
      {
        name: 'Arándanos',
        amount: '1/4 taza',
        numericAmount: 0.25,
        unit: 'taza',
      },
      {
        name: 'Miel',
        amount: '1 cucharadita',
        numericAmount: 1,
        unit: 'cdita',
      },
    ],
    steps: [
      'Sirve el yogur griego frío en un tazón.',
      'Agrega las fresas cortadas, los arándanos y la granola por encima.',
      'Finaliza con un hilo de miel natural.',
    ],
    nutrition: {
      calories: 310,
      protein: '16 g',
      carbs: '38 g',
      fats: '10 g',
      fiber: '5 g',
    },
    tips: ['Agrega la granola justo antes de comer para que conserve su textura crujiente.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'omelette-de-verduras',
    title: 'Omelette relleno de espinaca, tomate y queso',
    description:
      'Desayuno alto en proteínas que se prepara en menos de 10 minutos.',
    image: '/src/assets/images/recipe_avocado_toast_1793832462881.jpg',
    prepTimeMinutes: 10,
    difficulty: 'Fácil',
    servings: 1,
    categories: ['Desayunos', 'Recetas saludables', 'Recetas rápidas'],
    ingredients: [
      {
        name: 'Huevo',
        amount: '2 unidades',
        numericAmount: 2,
        unit: 'unidades',
      },
      {
        name: 'Espinaca',
        amount: '1 taza',
        numericAmount: 1,
        unit: 'taza',
      },
      {
        name: 'Tomate',
        amount: '1/2 unidad picada',
        numericAmount: 0.5,
        unit: 'unidad',
      },
      {
        name: 'Queso fresco',
        amount: '30 g desmenuzado',
        numericAmount: 30,
        unit: 'g',
      },
      {
        name: 'Aceite de oliva',
        amount: '1 cucharadita',
        numericAmount: 1,
        unit: 'cdita',
      },
    ],
    steps: [
      'Bate los huevos con una pizca de sal y pimienta.',
      'Vierte en una sartén antiadherente caliente con aceite de oliva.',
      'Cuando empiece a cuajar, coloca en una mitad la espinaca, el tomate y el queso fresco.',
      'Dobla el omelette por la mitad y cocina 1 minuto más.',
    ],
    nutrition: {
      calories: 245,
      protein: '17 g',
      carbs: '4 g',
      fats: '18 g',
      fiber: '1.5 g',
    },
    tips: ['Cocina a fuego medio-bajo para que quede jugoso por dentro y no se dore en exceso.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'batidos-nutritivos-desayuno',
    title: 'Batido nutritivo de plátano, avena y espinaca',
    description:
      'Bebida cremosa y energética que combina fruta, cereal integral y hojas verdes sin alterar el sabor dulce.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    prepTimeMinutes: 5,
    difficulty: 'Fácil',
    servings: 1,
    categories: ['Desayunos', 'Bebidas y jugos naturales', 'Recetas rápidas'],
    ingredients: [
      {
        name: 'Plátano',
        amount: '1 unidad madura',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Avena',
        amount: '3 cucharadas',
        numericAmount: 3,
        unit: 'cdas',
      },
      {
        name: 'Espinaca',
        amount: '1 puñado lavado',
        numericAmount: 1,
        unit: 'puñado',
      },
      {
        name: 'Leche',
        amount: '1 taza',
        numericAmount: 1,
        unit: 'taza',
        alternative: 'Bebida vegetal',
      },
      {
        name: 'Canela',
        amount: '1 pizca',
        numericAmount: 1,
        unit: 'pizca',
      },
    ],
    steps: [
      'Coloca todos los ingredientes en el vaso de la licuadora.',
      'Licúa a máxima velocidad durante 45 segundos hasta obtener una textura cremosa.',
      'Sirve inmediatamente.',
    ],
    nutrition: {
      calories: 270,
      protein: '10 g',
      carbs: '46 g',
      fats: '5 g',
      fiber: '5 g',
    },
    tips: ['Si usas plátano congelado en rodajas, quedará con textura de malteada.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'panqueques-integrales-miel',
    title: 'Panqueques integrales esponjosos con frutos rojos',
    description:
      'Versión nutritiva de los panqueques clásicos con harina integral, yogur y fruta fresca.',
    image: '/src/assets/images/recipe_avocado_toast_1793832462881.jpg',
    prepTimeMinutes: 20,
    difficulty: 'Fácil',
    servings: 3,
    categories: ['Desayunos', 'Recetas saludables'],
    isPremium: true,
    isNew: true,
    videoTutorial: {
      id: 'vid-panqueques',
      videoUrl: '/assets/videos/tutorial_parfait.mp4',
      posterUrl: '/src/assets/images/recipe_avocado_toast_1793832462881.jpg',
      duration: '03:45',
      chapters: [
        'Presentación de ingredientes',
        'Mezcla húmeda y seca',
        'Cocción a temperatura media',
        'Presentación con frutos rojos',
      ],
    },
    ingredients: [
      {
        name: 'Avena',
        amount: '1 taza molida (o harina integral)',
        numericAmount: 1,
        unit: 'taza',
      },
      {
        name: 'Huevo',
        amount: '2 unidades',
        numericAmount: 2,
        unit: 'unidades',
      },
      {
        name: 'Yogur griego',
        amount: '1/2 taza',
        numericAmount: 0.5,
        unit: 'taza',
      },
      {
        name: 'Leche',
        amount: '1/2 taza',
        numericAmount: 0.5,
        unit: 'taza',
      },
      {
        name: 'Fresas',
        amount: '1 taza para acompañar',
        numericAmount: 1,
        unit: 'taza',
      },
    ],
    steps: [
      'Bate los huevos con el yogur griego y la leche.',
      'Incorpora la avena molida y mezcla sin sobrebatir.',
      'Cocina en sartén antiadherente 2 minutos por lado.',
      'Sirve con fresas frescas.',
    ],
    nutrition: {
      calories: 310,
      protein: '14 g',
      carbs: '42 g',
      fats: '9 g',
      fiber: '6 g',
    },
    tips: ['Deja reposar la masa 5 minutos antes de cocinar para que quede más esponjosa.'],
    authorName: 'Chef Valeria · CreciSano',
  },
  {
    id: 'huevos-revueltos-verduras',
    title: 'Huevos revueltos cremosos con tomate y cebolla',
    description:
      'Clásico desayuno casero listo en 8 minutos con ingredientes básicos de cualquier cocina.',
    image: '/src/assets/images/recipe_avocado_toast_1793832462881.jpg',
    prepTimeMinutes: 8,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Desayunos', 'Recetas económicas', 'Recetas rápidas'],
    ingredients: [
      {
        name: 'Huevo',
        amount: '4 unidades',
        numericAmount: 4,
        unit: 'unidades',
      },
      {
        name: 'Tomate',
        amount: '1 unidad picada',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Cebolla',
        amount: '1/4 unidad picada',
        numericAmount: 0.25,
        unit: 'unidad',
      },
      {
        name: 'Aceite de oliva',
        amount: '1 cucharada',
        numericAmount: 1,
        unit: 'cda',
      },
    ],
    steps: [
      'Sofríe la cebolla y el tomate en una sartén con aceite de oliva durante 2 minutos.',
      'Agrega los huevos ligeramente batidos con sal.',
      'Remueve suavemente con espátula a fuego bajo hasta que queden cremosos.',
    ],
    nutrition: {
      calories: 220,
      protein: '14 g',
      carbs: '4 g',
      fats: '16 g',
      fiber: '1 g',
    },
    tips: ['Retira la sartén del fuego un poco antes de que se sequen por completo; el calor residual termina la cocción.'],
    authorName: 'Equipo CreciSano',
  },

  // === SECCIÓN DE BEBIDAS Y JUGOS NATURALES (7 RECETAS) ===
  {
    id: 'jugo-de-papaya',
    title: 'Jugo natural de papaya y limón',
    description:
      'Refrescante, digestivo y lleno de vitamina C y betacarotenos, listo en 5 minutos.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    prepTimeMinutes: 5,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Bebidas y jugos naturales', 'Recetas saludables', 'Recetas rápidas'],
    ingredients: [
      {
        name: 'Papaya',
        amount: '2 tazas en cubos sin semillas',
        numericAmount: 2,
        unit: 'tazas',
      },
      {
        name: 'Limón',
        amount: '1/2 unidad (jugo)',
        numericAmount: 0.5,
        unit: 'unidad',
      },
      {
        name: 'Miel',
        amount: '1 cucharadita opcional',
        numericAmount: 1,
        unit: 'cdita',
      },
    ],
    steps: [
      'Coloca los cubos de papaya en la licuadora con 1 taza de agua fría.',
      'Agrega el jugo de medio limón y licúa durante 30 segundos.',
      'Sirve fresco sin colar para aprovechar toda la fibra.',
    ],
    nutrition: {
      calories: 95,
      protein: '1 g',
      carbs: '23 g',
      fats: '0.5 g',
      fiber: '3 g',
    },
    tips: ['El toque de limón realza el dulzor natural de la papaya.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'limonada-natural',
    title: 'Limonada natural refrescante',
    description:
      'Clásica bebida hidratante casera con limones frescos, ideal para acompañar cualquier almuerzo.',
    image: '/src/assets/images/hero_fresh_kitchen_1793832462792.jpg',
    prepTimeMinutes: 5,
    difficulty: 'Fácil',
    servings: 4,
    categories: ['Bebidas y jugos naturales', 'Recetas económicas', 'Recetas rápidas'],
    ingredients: [
      {
        name: 'Limón',
        amount: '4 unidades (jugo)',
        numericAmount: 4,
        unit: 'unidades',
      },
      {
        name: 'Miel',
        amount: '2 cucharadas',
        numericAmount: 2,
        unit: 'cdas',
        alternative: 'Stevia al gusto',
      },
    ],
    steps: [
      'Exprime los limones frescos en una jarra.',
      'Disuelve la miel en un poco de agua tibia y añádela al jugo.',
      'Completa con 4 tazas de agua fría y hielo al gusto.',
    ],
    nutrition: {
      calories: 45,
      protein: '0 g',
      carbs: '12 g',
      fats: '0 g',
    },
    tips: ['Agrega unas hojas de menta o hierbabuena fresca para un aroma especial.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'batido-de-platano',
    title: 'Batido cremoso de plátano y canela',
    description:
      'Bebida nutritiva rica en potasio, perfecta para recuperar energía después de un día activo.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    prepTimeMinutes: 5,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Bebidas y jugos naturales', 'Desayunos', 'Recetas económicas'],
    ingredients: [
      {
        name: 'Plátano',
        amount: '2 unidades maduras',
        numericAmount: 2,
        unit: 'unidades',
      },
      {
        name: 'Leche',
        amount: '2 tazas',
        numericAmount: 2,
        unit: 'tazas',
        alternative: 'Bebida vegetal',
      },
      {
        name: 'Canela',
        amount: '1/2 cucharadita',
        numericAmount: 0.5,
        unit: 'cdita',
      },
    ],
    steps: [
      'Pela los plátanos y córtalos en trozos.',
      'Licúa con la leche fría y la canela hasta que quede espumoso.',
      'Sirve de inmediato.',
    ],
    nutrition: {
      calories: 195,
      protein: '7 g',
      carbs: '36 g',
      fats: '3 g',
      fiber: '3 g',
    },
    tips: ['Congela los plátanos maduros que te sobren para preparar este batido en cualquier momento.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'smoothie-de-fresa',
    title: 'Smoothie natural de fresa y yogur',
    description:
      'Cremoso, fresco y lleno de antioxidantes, ideal para la merienda de niños y adultos.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    prepTimeMinutes: 5,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Bebidas y jugos naturales', 'Snacks y aperitivos', 'Recetas rápidas'],
    isPopular: true,
    ingredients: [
      {
        name: 'Fresas',
        amount: '2 tazas lavadas',
        numericAmount: 2,
        unit: 'tazas',
      },
      {
        name: 'Yogur griego',
        amount: '1 taza',
        numericAmount: 1,
        unit: 'taza',
      },
      {
        name: 'Leche',
        amount: '1/2 taza',
        numericAmount: 0.5,
        unit: 'taza',
      },
      {
        name: 'Miel',
        amount: '1 cucharada',
        numericAmount: 1,
        unit: 'cda',
      },
    ],
    steps: [
      'Coloca las fresas, el yogur griego, la leche y la miel en la licuadora.',
      'Procesa hasta lograr una mezcla suave y homogénea.',
      'Sirve frío.',
    ],
    nutrition: {
      calories: 165,
      protein: '9 g',
      carbs: '25 g',
      fats: '3 g',
      fiber: '3 g',
    },
    tips: ['Puedes añadir 1 cucharada de semillas de chía para mayor aporte de fibra.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'jugo-de-pina',
    title: 'Jugo natural de piña refrescante',
    description:
      'Bebida tropical hidratante y ligera, perfecta para días calurosos.',
    image: '/src/assets/images/hero_fresh_kitchen_1793832462792.jpg',
    prepTimeMinutes: 7,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Bebidas y jugos naturales', 'Recetas saludables'],
    ingredients: [
      {
        name: 'Piña',
        amount: '2 tazas en cubos',
        numericAmount: 2,
        unit: 'tazas',
      },
      {
        name: 'Limón',
        amount: '1/2 unidad (jugo)',
        numericAmount: 0.5,
        unit: 'unidad',
      },
    ],
    steps: [
      'Licúa los cubos de piña con 1.5 tazas de agua fría.',
      'Agrega el jugo de medio limón y cuela si prefieres una textura más ligera.',
      'Sirve con hielo.',
    ],
    nutrition: {
      calories: 85,
      protein: '1 g',
      carbs: '21 g',
      fats: '0 g',
      fiber: '2 g',
    },
    tips: ['Usa piña bien madura para no necesitar endulzantes.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'batido-de-mango',
    title: 'Batido tropical de mango y yogur',
    description:
      'Textura aterciopelada y sabor dulce natural con mango maduro y yogur.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    prepTimeMinutes: 5,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Bebidas y jugos naturales', 'Postres', 'Recetas rápidas'],
    isPremium: true,
    isNew: true,
    videoTutorial: {
      id: 'vid-mango',
      videoUrl: '/assets/videos/tutorial_parfait.mp4',
      posterUrl: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
      duration: '02:30',
      chapters: [
        'Selección del mango maduro',
        'Proporción ideal con yogur',
        'Servido y decoración',
      ],
    },
    ingredients: [
      {
        name: 'Mango',
        amount: '2 tazas en cubos',
        numericAmount: 2,
        unit: 'tazas',
      },
      {
        name: 'Yogur griego',
        amount: '1 taza',
        numericAmount: 1,
        unit: 'taza',
      },
      {
        name: 'Leche',
        amount: '1/2 taza',
        numericAmount: 0.5,
        unit: 'taza',
      },
    ],
    steps: [
      'Licúa el mango con el yogur griego y la leche hasta obtener una crema suave.',
      'Sirve en vasos fríos.',
    ],
    nutrition: {
      calories: 185,
      protein: '8 g',
      carbs: '32 g',
      fats: '3 g',
      fiber: '3 g',
    },
    tips: ['Una pizca de canela o cardamomo le da un toque delicioso.'],
    authorName: 'Chef Valeria · CreciSano',
  },
  {
    id: 'jugo-naranja-zanahoria',
    title: 'Jugo energético de naranja y zanahoria',
    description:
      'Combinación clásica rica en vitamina A y C para fortalecer las defensas de toda la familia.',
    image: '/src/assets/images/hero_fresh_kitchen_1793832462792.jpg',
    prepTimeMinutes: 8,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Bebidas y jugos naturales', 'Desayunos', 'Recetas saludables'],
    ingredients: [
      {
        name: 'Naranja',
        amount: '4 unidades (jugo)',
        numericAmount: 4,
        unit: 'unidades',
      },
      {
        name: 'Zanahoria',
        amount: '2 unidades peladas en trozos',
        numericAmount: 2,
        unit: 'unidades',
      },
    ],
    steps: [
      'Exprime el jugo de las naranjas.',
      'Licúa el jugo de naranja junto con las zanahorias en trozos hasta triturar bien.',
      'Cuela si lo deseas y sirve inmediatamente.',
    ],
    nutrition: {
      calories: 110,
      protein: '2 g',
      carbs: '26 g',
      fats: '0.5 g',
      fiber: '3 g',
    },
    tips: ['Consúmelo recién preparado para aprovechar al máximo sus vitaminas.'],
    authorName: 'Equipo CreciSano',
  },

  // === ALMUERZOS, CENAS, LONCHERAS, SNACKS Y POSTRES ===
  {
    id: 'bowl-quinoa-camote',
    title: 'Bowl nutritivo de quinoa, camote asado y aguacate',
    description:
      'Comida completa y balanceada con carbohidratos complejos, proteína vegetal de garbanzos y grasas saludables.',
    image: '/src/assets/images/recipe_quinoa_bowl_1793832461748.jpg',
    prepTimeMinutes: 25,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Almuerzos', 'Recetas saludables', 'Loncheras saludables'],
    isPremium: true,
    isPopular: true,
    videoTutorial: {
      id: 'vid-quinoa',
      videoUrl: '/assets/videos/tutorial_quinoa.mp4',
      posterUrl: '/src/assets/images/recipe_quinoa_bowl_1793832461748.jpg',
      duration: '04:15',
      chapters: [
        '1. Presentación de los ingredientes',
        '2. Cocción perfecta de la quinoa',
        '3. Dorado del camote y garbanzos',
        '4. Armado y aliño del bowl',
      ],
    },
    ingredients: [
      {
        name: 'Quinoa',
        amount: '1 taza',
        numericAmount: 1,
        unit: 'taza',
        alternative: 'Arroz integral',
      },
      {
        name: 'Camote',
        amount: '1 unidad mediana',
        numericAmount: 1,
        unit: 'unidad',
        alternative: 'Papa o zanahoria',
      },
      {
        name: 'Garbanzos',
        amount: '1 taza cocidos',
        numericAmount: 1,
        unit: 'taza',
        alternative: 'Lentejas cocidas',
      },
      {
        name: 'Aguacate',
        amount: '1 unidad',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Espinaca',
        amount: '2 tazas frescas',
        numericAmount: 2,
        unit: 'tazas',
      },
      {
        name: 'Limón',
        amount: '1 unidad (jugo)',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Aceite de oliva',
        amount: '2 cucharadas',
        numericAmount: 2,
        unit: 'cdas',
      },
    ],
    steps: [
      'Lava bien la quinoa y cocínala en 2 tazas de agua con sal durante 15 minutos.',
      'Corta el camote en cubos pequeños y ásalo en sartén tapada con 1 cucharada de aceite de oliva por 15 minutos.',
      'Saltea los garbanzos cocidos durante 4 minutos hasta que queden dorados.',
      'Sirve una base de espinaca y quinoa tibia, añade el camote, los garbanzos y el aguacate en láminas.',
      'Aliña con jugo de limón y aceite de oliva.',
    ],
    nutrition: {
      calories: 490,
      protein: '16 g',
      carbs: '58 g',
      fats: '22 g',
      fiber: '13 g',
    },
    tips: [
      'Puedes preparar el doble de quinoa y camote para tener almuerzos listos toda la semana.',
    ],
    authorName: 'Chef Valeria · CreciSano',
  },
  {
    id: 'salmon-hierbas-vegetales',
    title: 'Salmón a la plancha con brócoli y limón',
    description:
      'Cena ligera rica en omega-3 y vegetales verdes, lista en menos de 20 minutos en un solo sartén.',
    image: '/src/assets/images/recipe_salmon_greens_1793832464854.jpg',
    prepTimeMinutes: 18,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Cenas', 'Recetas saludables', 'Recetas rápidas'],
    isPremium: true,
    isNew: true,
    videoTutorial: {
      id: 'vid-salmon',
      videoUrl: '/assets/videos/tutorial_salmon.mp4',
      posterUrl: '/src/assets/images/recipe_salmon_greens_1793832464854.jpg',
      duration: '03:50',
      chapters: [
        '1. Preparación y sazón del salmón',
        '2. Sellado jugoso a la plancha',
        '3. Salteado verde de brócoli',
        '4. Presentación con limón fresco',
      ],
    },
    ingredients: [
      {
        name: 'Salmón',
        amount: '2 filetes (300 g)',
        numericAmount: 300,
        unit: 'g',
        alternative: 'Filete de pescado blanco o pechuga de pollo',
      },
      {
        name: 'Brócoli',
        amount: '2 tazas en floretes',
        numericAmount: 2,
        unit: 'tazas',
        alternative: 'Calabacín o espinaca',
      },
      {
        name: 'Ajo',
        amount: '2 dientes picados',
        numericAmount: 2,
        unit: 'dientes',
      },
      {
        name: 'Limón',
        amount: '1 unidad',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Aceite de oliva',
        amount: '1 cucharada',
        numericAmount: 1,
        unit: 'cda',
      },
    ],
    steps: [
      'Sazona los filetes de salmón con sal, pimienta y ajo picado.',
      'Cocina el salmón en sartén con aceite de oliva a fuego medio 4 minutos por cada lado.',
      'Saltea los floretes de brócoli tapados con un chorrito de agua durante 5 minutos.',
      'Sirve caliente con rodajas de limón fresco.',
    ],
    nutrition: {
      calories: 420,
      protein: '34 g',
      carbs: '10 g',
      fats: '27 g',
      fiber: '4 g',
    },
    tips: ['No muevas el salmón durante los primeros 3 minutos para lograr una costra dorada y crujiente.'],
    authorName: 'Chef Valeria · CreciSano',
  },
  {
    id: 'parfait-chia-frutos-rojos',
    title: 'Parfait de chía, yogur griego y frutos rojos',
    description:
      'Postre o desayuno fresco sin azúcares añadidos, lleno de fibra, antioxidantes y probióticos.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    prepTimeMinutes: 10,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Postres', 'Desayunos', 'Recetas rápidas', 'Recetas saludables'],
    isPremium: true,
    videoTutorial: {
      id: 'vid-parfait',
      videoUrl: '/assets/videos/tutorial_parfait.mp4',
      posterUrl: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
      duration: '02:55',
      chapters: [
        '1. Hidratación de las semillas de chía',
        '2. Capas de yogur y frutos rojos',
        '3. Toque crujiente final',
      ],
    },
    ingredients: [
      {
        name: 'Semillas de chía',
        amount: '3 cucharadas',
        numericAmount: 3,
        unit: 'cdas',
      },
      {
        name: 'Leche',
        amount: '1 taza',
        numericAmount: 1,
        unit: 'taza',
      },
      {
        name: 'Yogur griego',
        amount: '1 taza natural',
        numericAmount: 1,
        unit: 'taza',
      },
      {
        name: 'Fresas',
        amount: '1 taza picadas',
        numericAmount: 1,
        unit: 'taza',
      },
      {
        name: 'Arándanos',
        amount: '1/2 taza',
        numericAmount: 0.5,
        unit: 'taza',
      },
      {
        name: 'Miel',
        amount: '1 cucharada',
        numericAmount: 1,
        unit: 'cda',
      },
    ],
    steps: [
      'Mezcla las semillas de chía con la leche y deja reposar 10 minutos hasta que espese.',
      'Alterna capas de pudín de chía, yogur griego, fresas y arándanos en dos vasos.',
      'Finaliza con un hilo de miel natural.',
    ],
    nutrition: {
      calories: 295,
      protein: '15 g',
      carbs: '36 g',
      fats: '10 g',
      fiber: '9 g',
    },
    tips: ['Puedes dejarlo preparado la noche anterior en frascos con tapa.'],
    authorName: 'Chef Valeria · CreciSano',
  },
  {
    id: 'ensalada-mediterranea-garbanzos',
    title: 'Ensalada mediterránea de quinoa, tomate y garbanzos',
    description:
      'Fresca, económica y perfecta para llevar en lonchera. Se conserva muy bien hasta 3 días en refrigeración.',
    image: '/src/assets/images/hero_fresh_kitchen_1793832462792.jpg',
    prepTimeMinutes: 15,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Loncheras saludables', 'Almuerzos', 'Recetas económicas', 'Recetas saludables'],
    ingredients: [
      {
        name: 'Quinoa',
        amount: '1 taza cocida',
        numericAmount: 1,
        unit: 'taza',
        alternative: 'Arroz cocido',
      },
      {
        name: 'Garbanzos',
        amount: '1 taza cocidos',
        numericAmount: 1,
        unit: 'taza',
      },
      {
        name: 'Tomate',
        amount: '2 unidades picadas',
        numericAmount: 2,
        unit: 'unidades',
      },
      {
        name: 'Pepino',
        amount: '1/2 unidad en cubos',
        numericAmount: 0.5,
        unit: 'unidad',
      },
      {
        name: 'Queso fresco',
        amount: '80 g desmenuzado',
        numericAmount: 80,
        unit: 'g',
      },
      {
        name: 'Limón',
        amount: '1 unidad',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Aceite de oliva',
        amount: '2 cucharadas',
        numericAmount: 2,
        unit: 'cdas',
      },
    ],
    steps: [
      'Combina la quinoa cocida con los garbanzos escurridos.',
      'Agrega el tomate, el pepino y el queso fresco desmenuzado.',
      'Aliña con aceite de oliva, jugo de limón y sal.',
    ],
    nutrition: {
      calories: 410,
      protein: '18 g',
      carbs: '46 g',
      fats: '17 g',
      fiber: '10 g',
    },
    tips: ['Guarda el aliño aparte si la vas a llevar en lonchera para mantener los vegetales crujientes.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'wraps-atun-aguacate',
    title: 'Wraps rápidos de atún, aguacate y espinaca',
    description:
      'Lonchera práctica sin necesidad de cocción, lista en 8 minutos con ingredientes básicos de despensa.',
    image: '/src/assets/images/hero_fresh_kitchen_1793832462792.jpg',
    prepTimeMinutes: 8,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Loncheras saludables', 'Recetas rápidas', 'Cenas'],
    ingredients: [
      {
        name: 'Tortilla de maíz',
        amount: '4 unidades grandes',
        numericAmount: 4,
        unit: 'unidades',
        alternative: 'Pan integral',
      },
      {
        name: 'Atún',
        amount: '1 lata al natural escurrida',
        numericAmount: 1,
        unit: 'lata',
        alternative: 'Pollo desmenuzado',
      },
      {
        name: 'Aguacate',
        amount: '1 unidad',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Espinaca',
        amount: '1 taza',
        numericAmount: 1,
        unit: 'taza',
      },
      {
        name: 'Tomate',
        amount: '1 unidad en rodajas',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Limón',
        amount: '1/2 unidad',
        numericAmount: 0.5,
        unit: 'unidad',
      },
    ],
    steps: [
      'Mezcla el atún escurrido con el aguacate machacado y el jugo de limón.',
      'Calienta ligeramente las tortillas para que sean flexibles.',
      'Coloca espinaca, tomate y la mezcla de atún, enrolla y corta por la mitad.',
    ],
    nutrition: {
      calories: 350,
      protein: '22 g',
      carbs: '34 g',
      fats: '14 g',
      fiber: '7 g',
    },
    tips: ['Envuelve en papel aluminio o servilleta para que no se desarmen en la lonchera.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'guiso-lentejas-vegetales',
    title: 'Guiso casero de lentejas con zanahoria y papa',
    description:
      'Reconfortante, muy económico y alto en proteína vegetal y hierro.',
    image: '/src/assets/images/recipe_quinoa_bowl_1793832461748.jpg',
    prepTimeMinutes: 30,
    difficulty: 'Media',
    servings: 4,
    categories: ['Almuerzos', 'Recetas económicas', 'Recetas saludables'],
    ingredients: [
      {
        name: 'Lentejas',
        amount: '1.5 tazas secas',
        numericAmount: 1.5,
        unit: 'tazas',
      },
      {
        name: 'Zanahoria',
        amount: '2 unidades en rodajas',
        numericAmount: 2,
        unit: 'unidades',
      },
      {
        name: 'Papa',
        amount: '1 unidad en cubos',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Tomate',
        amount: '2 unidades ralladas',
        numericAmount: 2,
        unit: 'unidades',
      },
      {
        name: 'Cebolla',
        amount: '1 unidad picada',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Ajo',
        amount: '2 dientes',
        numericAmount: 2,
        unit: 'dientes',
      },
      {
        name: 'Aceite de oliva',
        amount: '2 cucharadas',
        numericAmount: 2,
        unit: 'cdas',
      },
    ],
    steps: [
      'Sofríe la cebolla, el ajo y el tomate rallado en aceite de oliva durante 5 minutos.',
      'Añade las lentejas lavadas, la zanahoria, la papa y 4 tazas de agua.',
      'Cocina a fuego medio durante 25 minutos hasta que todo esté tierno.',
    ],
    nutrition: {
      calories: 340,
      protein: '18 g',
      carbs: '52 g',
      fats: '7 g',
      fiber: '15 g',
    },
    tips: ['Acompáñalo con arroz blanco o integral para obtener una proteína vegetal completa.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'pasta-integral-tofu-espinaca',
    title: 'Pasta integral con tofu salteado, ajo y espinaca',
    description:
      'Cena vegetal rápida con salsa ligera de aceite de oliva, ajo dorado y espinacas frescas.',
    image: '/src/assets/images/recipe_salmon_greens_1793832464854.jpg',
    prepTimeMinutes: 18,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Cenas', 'Recetas saludables', 'Recetas rápidas'],
    isPremium: true,
    videoTutorial: {
      id: 'vid-pasta',
      videoUrl: '/assets/videos/tutorial_salmon.mp4',
      posterUrl: '/src/assets/images/recipe_salmon_greens_1793832464854.jpg',
      duration: '03:20',
      chapters: [
        '1. Cocción al dente de la pasta',
        '2. Dorado crujiente del tofu',
        '3. Salteado rápido de espinacas',
      ],
    },
    ingredients: [
      {
        name: 'Pasta integral',
        amount: '180 g',
        numericAmount: 180,
        unit: 'g',
      },
      {
        name: 'Tofu',
        amount: '200 g firme en cubos',
        numericAmount: 200,
        unit: 'g',
        alternative: 'Pechuga de pollo o garbanzos',
      },
      {
        name: 'Espinaca',
        amount: '3 tazas',
        numericAmount: 3,
        unit: 'tazas',
      },
      {
        name: 'Ajo',
        amount: '3 dientes laminados',
        numericAmount: 3,
        unit: 'dientes',
      },
      {
        name: 'Aceite de oliva',
        amount: '2 cucharadas',
        numericAmount: 2,
        unit: 'cdas',
      },
    ],
    steps: [
      'Cuece la pasta integral en agua con sal.',
      'Dora los cubos de tofu en aceite de oliva hasta que queden crujientes.',
      'Añade el ajo laminado y las espinacas; saltea 2 minutos y mezcla con la pasta.',
    ],
    nutrition: {
      calories: 445,
      protein: '21 g',
      carbs: '54 g',
      fats: '16 g',
      fiber: '9 g',
    },
    tips: ['Seca bien el tofu con papel absorbente antes de dorarlo para que quede más crujiente.'],
    authorName: 'Chef Valeria · CreciSano',
  },
  {
    id: 'hummus-garbanzos-vegetales',
    title: 'Hummus casero de garbanzos con bastones de zanahoria',
    description:
      'Snack saludable y económico listo en 8 minutos para compartir en familia.',
    image: '/src/assets/images/hero_fresh_kitchen_1793832462792.jpg',
    prepTimeMinutes: 8,
    difficulty: 'Fácil',
    servings: 4,
    categories: ['Snacks y aperitivos', 'Loncheras saludables', 'Recetas económicas', 'Recetas rápidas'],
    ingredients: [
      {
        name: 'Garbanzos',
        amount: '1.5 tazas cocidos',
        numericAmount: 1.5,
        unit: 'tazas',
      },
      {
        name: 'Zanahoria',
        amount: '2 unidades en bastones',
        numericAmount: 2,
        unit: 'unidades',
      },
      {
        name: 'Pepino',
        amount: '1 unidad en bastones',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Limón',
        amount: '1 unidad (jugo)',
        numericAmount: 1,
        unit: 'unidad',
      },
      {
        name: 'Ajo',
        amount: '1 diente',
        numericAmount: 1,
        unit: 'diente',
      },
      {
        name: 'Aceite de oliva',
        amount: '2 cucharadas',
        numericAmount: 2,
        unit: 'cdas',
      },
    ],
    steps: [
      'Procesa los garbanzos cocidos con el jugo de limón, ajo, aceite de oliva y 3 cucharadas de agua hasta obtener una crema suave.',
      'Sirve en un cuenco acompañado de bastones frescos de zanahoria y pepino.',
    ],
    nutrition: {
      calories: 180,
      protein: '6 g',
      carbs: '22 g',
      fats: '8 g',
      fiber: '6 g',
    },
    tips: ['Se conserva hasta 5 días en un recipiente hermético en la nevera.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'galletas-avena-platano-cacao',
    title: 'Galletas saludables de avena, plátano y cacao',
    description:
      'Postre o snack de lonchera con solo 4 ingredientes, sin harina refinada ni azúcar añadido.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    prepTimeMinutes: 18,
    difficulty: 'Fácil',
    servings: 8,
    categories: ['Postres', 'Loncheras saludables', 'Snacks y aperitivos', 'Recetas económicas', 'Recetas rápidas'],
    ingredients: [
      {
        name: 'Plátano',
        amount: '2 unidades maduras',
        numericAmount: 2,
        unit: 'unidades',
      },
      {
        name: 'Avena',
        amount: '1.5 tazas en hojuelas',
        numericAmount: 1.5,
        unit: 'tazas',
      },
      {
        name: 'Cacao en polvo',
        amount: '2 cucharadas sin azúcar',
        numericAmount: 2,
        unit: 'cdas',
      },
      {
        name: 'Canela',
        amount: '1/2 cucharadita',
        numericAmount: 0.5,
        unit: 'cdita',
      },
    ],
    steps: [
      'Tritura los plátanos maduros en un bol hasta obtener un puré.',
      'Mezcla con la avena, el cacao en polvo y la canela hasta formar una masa húmeda.',
      'Forma 8 galletas sobre papel encerado y hornea a 180 °C durante 12 minutos.',
    ],
    nutrition: {
      calories: 115,
      protein: '3 g',
      carbs: '22 g',
      fats: '2 g',
      fiber: '3 g',
    },
    tips: ['También puedes cocinarlas en freidora de aire a 170 °C por 10 minutos.'],
    authorName: 'Equipo CreciSano',
  },
  {
    id: 'manzana-asada-canela-yogur',
    title: 'Manzanas asadas con canela, avena y yogur',
    description:
      'Postre tibio y reconfortante perfecto para aprovechar manzanas de la despensa.',
    image: '/src/assets/images/recipe_berry_chia_parfait_1793832463070.jpg',
    prepTimeMinutes: 20,
    difficulty: 'Fácil',
    servings: 2,
    categories: ['Postres', 'Recetas saludables', 'Recetas económicas'],
    ingredients: [
      {
        name: 'Manzana',
        amount: '2 unidades',
        numericAmount: 2,
        unit: 'unidades',
      },
      {
        name: 'Avena',
        amount: '3 cucharadas',
        numericAmount: 3,
        unit: 'cdas',
      },
      {
        name: 'Canela',
        amount: '1 cucharadita',
        numericAmount: 1,
        unit: 'cdita',
      },
      {
        name: 'Miel',
        amount: '1 cucharada',
        numericAmount: 1,
        unit: 'cda',
      },
      {
        name: 'Yogur griego',
        amount: '1/2 taza para acompañar',
        numericAmount: 0.5,
        unit: 'taza',
      },
    ],
    steps: [
      'Corta las manzanas por la mitad y retira el corazón.',
      'Mezcla la avena con la canela y la miel, y rellena cada mitad.',
      'Hornea o cocina en sartén tapada 15 minutos hasta que estén tiernas y sirve con yogur griego.',
    ],
    nutrition: {
      calories: 230,
      protein: '7 g',
      carbs: '44 g',
      fats: '3 g',
      fiber: '6 g',
    },
    tips: ['El contraste entre la manzana tibia y el yogur frío es delicioso.'],
    authorName: 'Equipo CreciSano',
  },
];

export function normalizeIngredient(text: string): string {
  const cleaned = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/es$/, '')
    .replace(/s$/, '');

  if (cleaned === 'palta') return 'aguacate';
  return cleaned;
}

export function matchRecipesByIngredients(
  recipes: Recipe[],
  userIngredients: string[]
): RecipeMatchResult[] {
  const normalizedUser = userIngredients
    .map(normalizeIngredient)
    .filter((item) => item.length > 0);

  if (normalizedUser.length === 0) {
    return [];
  }

  const results: RecipeMatchResult[] = [];

  for (const recipe of recipes) {
    const availableIngredients: string[] = [];
    const missingIngredients: string[] = [];

    for (const ing of recipe.ingredients) {
      const normRecipeIng = normalizeIngredient(ing.name);
      const isMatch = normalizedUser.some(
        (u) => normRecipeIng.includes(u) || u.includes(normRecipeIng)
      );
      if (isMatch) {
        availableIngredients.push(ing.name);
      } else {
        missingIngredients.push(ing.name);
      }
    }

    if (availableIngredients.length > 0) {
      const matchPercentage = Math.round(
        (availableIngredients.length / recipe.ingredients.length) * 100
      );
      results.push({
        recipe,
        availableIngredients,
        missingIngredients,
        matchedCount: availableIngredients.length,
        totalCount: recipe.ingredients.length,
        matchPercentage,
      });
    }
  }

  return results.sort((a, b) => {
    if (b.matchedCount !== a.matchedCount) {
      return b.matchedCount - a.matchedCount;
    }
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return a.missingIngredients.length - b.missingIngredients.length;
  });
}

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    recipeId: 'arroz-pollo-papa-zanahoria',
    authorName: 'Camila Mendoza',
    title: 'Arroz casero con pollo, papa y zanahoria para toda la familia',
    story:
      'Tenía pollo, papas, zanahoria y arroz en casa. Lo preparé en una sola olla en 30 minutos y a mis hijos les encantó.',
    image: '/src/assets/images/recipe_quinoa_bowl_1793832461748.jpg',
    category: 'Almuerzos',
    prepTimeMinutes: 30,
    likes: 22,
    likedBy: [],
    comments: [
      {
        id: 'c-1',
        authorName: 'Mateo Ríos',
        text: 'Le agregué un poco de cilantro extra y quedó increíble.',
        createdAt: '2026-11-01T14:20:00.000Z',
      },
    ],
    createdAt: '2026-11-01T12:00:00.000Z',
  },
  {
    id: 'post-2',
    recipeId: 'panqueques-avena-platano',
    authorName: 'Valentina Suárez',
    title: 'Panqueques de avena y plátano en 15 minutos',
    story:
      'Tenía dos plátanos muy maduros que nadie se iba a comer. Con avena y huevo salieron unos panqueques suaves perfectos para el desayuno.',
    image: '/src/assets/images/recipe_avocado_toast_1793832462881.jpg',
    category: 'Desayunos',
    prepTimeMinutes: 15,
    likes: 29,
    likedBy: [],
    comments: [],
    createdAt: '2026-11-02T16:45:00.000Z',
  },
  {
    id: 'post-3',
    recipeId: 'tortilla-verduras',
    authorName: 'Andrés Herrera',
    title: 'Cena rápida de 15 minutos con espinaca y huevo',
    story:
      'Cuando llego cansado del trabajo, esta tortilla me salva la noche sin pedir comida a domicilio.',
    image: '/src/assets/images/recipe_salmon_greens_1793832464854.jpg',
    category: 'Cenas',
    prepTimeMinutes: 15,
    likes: 17,
    likedBy: [],
    comments: [],
    createdAt: '2026-11-03T19:30:00.000Z',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'video',
    title: 'Nuevo video tutorial Premium',
    message:
      'Aprende a preparar Salmón a la plancha con brócoli y limón paso a paso.',
    date: 'Hoy',
    read: false,
    targetScreen: 'premium',
  },
  {
    id: 'notif-2',
    type: 'recipe',
    title: 'Nueva receta agregada: Arroz casero con pollo, papa y zanahoria',
    message:
      'Ideal para aprovechar ingredientes básicos de tu despensa en 30 minutos.',
    date: 'Ayer',
    read: false,
    targetRecipeId: 'arroz-pollo-papa-zanahoria',
  },
  {
    id: 'notif-3',
    type: 'collection',
    title: 'Nueva colección: 10 desayunos nutritivos',
    message:
      'Descubre panqueques de avena, tortillas de verduras y batidos naturales.',
    date: 'Hace 2 días',
    read: false,
    targetScreen: 'categories',
  },
  {
    id: 'notif-4',
    type: 'recommendation',
    title: 'Recetas recomendadas para tu despensa',
    message:
      'Tienes ingredientes compatibles con 6 preparaciones rápidas de menos de 15 minutos.',
    date: 'Hace 3 días',
    read: true,
    targetScreen: 'search',
  },
  {
    id: 'notif-5',
    type: 'news',
    title: 'Sincronización web y móvil activa',
    message:
      'Tus favoritos, despensa y menú semanal ahora se sincronizan en todos tus dispositivos.',
    date: 'Esta semana',
    read: true,
    targetScreen: 'planner',
  },
];
