/**
 * Tipos de producto
 * 
 * Re-exporta los tipos desde el schema de Zod
 * para mantener compatibilidad con el código existente
 */

export type {
  Product,
  Category,
  Color,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  ProductListResponse,
} from '../schemas/product.schema';

// Re-exportar schemas para validaciones
export {
  ProductSchema,
  CategorySchema,
  ColorSchema,
  CreateProductSchema,
  UpdateProductSchema,
  ProductFiltersSchema,
  ProductListResponseSchema,
} from '../schemas/product.schema';
