# Wompi Frontend - Verificación de Configuración

## Pasos para verificar la instalación

### 1. Habilitar ejecución de scripts en PowerShell

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Instalar dependencias

```powershell
cd "C:\Users\morde\OneDrive\Documentos\wompi\frontend"
npm install
```

### 3. Verificar que el backend está corriendo

El backend debe estar ejecutándose en `http://localhost:3000/api`

```powershell
# Desde otra terminal o navegador, verificar que responde
curl http://localhost:3000/api/products
```

### 4. Probar conexión con el backend

```powershell
# Opción A: Usar el script de prueba
npx tsx test-backend.ts

# Opción B: Verificar manualmente con curl
curl http://localhost:3000/api/products
```

### 5. Iniciar servidor de desarrollo

```powershell
npm run dev
```

Esto iniciará el servidor en `http://localhost:5173`

### 6. Ejecutar tests

```powershell
npm test
npm run test:coverage
```

## Verificación de Archivos

### Estructura de carpetas
```
frontend/
├── src/
│   ├── app/
│   │   ├── store.ts      ✅ Redux store configurado
│   │   └── App.tsx       ✅ Router con rutas definidas
│   ├── features/
│   │   ├── products/     ✅ productsSlice.ts
│   │   ├── checkout/     ✅ checkoutSlice.ts
│   │   ├── transaction/  ✅ transactionSlice.ts
│   │   └── common/       ✅ Componentes básicos
│   ├── services/
│   │   ├── api.ts        ✅ Axios instance
│   │   ├── productsService.ts
│   │   ├── customersService.ts
│   │   ├── transactionsService.ts
│   │   └── wompiService.ts
│   ├── types/            ✅ Tipos TypeScript
│   ├── utils/            ✅ Utilidades
│   └── styles/           ✅ Estilos globales
├── tests/                ✅ Configuración de tests
├── .env                  ✅ Variables de entorno
├── package.json          ✅ Dependencias y scripts
├── tsconfig.json         ✅ Configuración TypeScript
├── vite.config.ts        ✅ Configuración Vite
└── .gitignore            ✅ Exclusiones de git
```

### Verificar configuración de entorno

```powershell
# Ver que las variables de entorno están cargadas
echo $env:VITE_API_URL
echo $env:VITE_WOMPI_API_URL
```

## Posibles problemas y soluciones

### Error: "Cannot find module 'axios'"
```powershell
npm install
```

### Error: "Access denied" en PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: Backend no responde
- Verificar que el backend NestJS está corriendo
- Verificar que el puerto 3000 no está bloqueado

### Error: TypeScript compilation
```powershell
npx tsc --noEmit
```

## Endpoints del backend disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/products | Lista productos |
| GET | /api/products/:id | Detalle producto |
| POST | /api/customers | Crea cliente |
| POST | /api/transactions | Crea transacción |
| POST | /api/transactions/:id/payment | Procesa pago |

## Notas importantes

- **baseFee**: $2,000 COP (fijo, no multiplica)
- **deliveryFee**: $5,000 COP × quantity (por unidad)
- **Moneda**: Pesos colombianos (COP)
- **Flujo**: Customer → Tokenize → Transaction → Payment
