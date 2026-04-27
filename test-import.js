import publicRoutes from "./src/routers/public.js";

console.log("publicRoutes type:", typeof publicRoutes);
console.log("publicRoutes:", publicRoutes);
console.log("publicRoutes.stack:", publicRoutes?.stack?.map(r => ({ route: r.route?.path, methods: r.route?.methods })));

