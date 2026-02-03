/**
 * Hook personalizado para formulario de productos (crear/editar)
 * 
 * Gestiona el estado del formulario, validación y lógica de guardado usando React Query
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { CreateProductInput } from '../types/product';
import { Category, Color } from '../types/product';
import { CreateProductSchema, UpdateProductSchema } from '../schemas/product.schema';
import {
  useProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useCategoriesQuery,
  useColorsQuery,
} from './queries';

interface UseProductFormProps {
  productId?: string; // Si existe, es modo edición
}

interface UseProductFormReturn {
  // Datos del formulario
  formData: CreateProductInput;
  setFormData: React.Dispatch<React.SetStateAction<CreateProductInput>>;
  
  // Categorías y colores disponibles
  categories: Category[];
  colors: Color[];
  isLoadingOptions: boolean;
  isLoadingProduct: boolean;
  
  // Estados de UI
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  
  // Modo
  isEditMode: boolean;
  
  // Producto cargado (solo en modo edición)
  product?: any;
  
  // Acciones
  handleSubmit: () => Promise<void>;
  handleCategoryToggle: (categoryId: string) => void;
  handleColorToggle: (colorId: string) => void;
  updateField: <K extends keyof CreateProductInput>(field: K, value: CreateProductInput[K]) => void;
}

const initialFormData: CreateProductInput = {
  name: '',
  description: '',
  material: '',
  price: 0,
  dimensions: '',
  imageUrl: '',
  imageAlt: '',
  categoryIds: [],
  colorIds: [],
};

export const useProductForm = ({ productId }: UseProductFormProps = {}): UseProductFormReturn => {
  const router = useRouter();
  const isEditMode = !!productId;
  
  // React Query hooks
  const { data: product, isLoading: isLoadingProduct } = useProductQuery(productId || '', {
    enabled: !!productId,
  });
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery();
  const { data: colors = [], isLoading: isLoadingColors } = useColorsQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  
  // Estado del formulario
  const [formData, setFormData] = useState<CreateProductInput>(initialFormData);
  
  // Estados de UI
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isLoadingOptions = isLoadingCategories || isLoadingColors;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  /**
   * Carga el producto cuando está disponible (modo edición)
   */
  useEffect(() => {
    if (product && isEditMode) {
      setFormData({
        name: product.name,
        description: product.description,
        material: product.material || '',
        price: product.price,
        dimensions: product.dimensions || '',
        imageUrl: product.images?.[0]?.src || '',
        imageAlt: product.images?.[0]?.alt || '',
        categoryIds: product.categories.map(c => c.id),
        colorIds: product.colors.map(c => c.id),
      });
    }
  }, [product, isEditMode]);

  /**
   * Actualiza un campo del formulario
   */
  const updateField = <K extends keyof CreateProductInput>(
    field: K,
    value: CreateProductInput[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al editarlo
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Alterna la selección de una categoría
   */
  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => {
      const isSelected = prev.categoryIds.includes(categoryId);
      return {
        ...prev,
        categoryIds: isSelected
          ? prev.categoryIds.filter(id => id !== categoryId)
          : [...prev.categoryIds, categoryId],
      };
    });
    
    if (fieldErrors.categoryIds) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.categoryIds;
        return newErrors;
      });
    }
  };

  /**
   * Alterna la selección de un color
   */
  const handleColorToggle = (colorId: string) => {
    setFormData(prev => {
      const isSelected = prev.colorIds.includes(colorId);
      return {
        ...prev,
        colorIds: isSelected
          ? prev.colorIds.filter(id => id !== colorId)
          : [...prev.colorIds, colorId],
      };
    });
    
    if (fieldErrors.colorIds) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.colorIds;
        return newErrors;
      });
    }
  };

  /**
   * Envía el formulario (crear o actualizar)
   */
  const handleSubmit = async () => {
    try {
      setError(null);
      setFieldErrors({});

      if (isEditMode && productId) {
        // Modo edición: validar con UpdateProductSchema
        const validatedData = UpdateProductSchema.parse({ id: productId, ...formData });
        const { id, ...dataWithoutId } = validatedData;
        
        await updateMutation.mutateAsync({
          id: productId,
          data: dataWithoutId,
        });
      } else {
        // Modo creación: validar con CreateProductSchema
        const validatedData = CreateProductSchema.parse(formData);
        await createMutation.mutateAsync(validatedData);
      }
      
      // Redirigir al dashboard de productos
      router.back();
    } catch (err: any) {
      console.error('[useProductForm] Error submitting:', err);
      
      if (err.name === 'ZodError') {
        const errors: Record<string, string> = {};
        console.log('[useProductForm] Validation errors:', err.errors);
        err.errors.forEach((error: any) => {
          const field = error.path[0];
          errors[field] = error.message;
          console.log(`[useProductForm] Field error - ${field}:`, error.message);
        });
        setFieldErrors(errors);
        const errorFields = Object.keys(errors).join(', ');
        setError(`Por favor corrige los errores en: ${errorFields}`);
      } else {
        if (err.message?.includes('sesión ha expirado')) {
          setError(err.message);
          setTimeout(() => {
            router.replace('/login');
          }, 2000);
        } else {
          setError(err.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el producto`);
        }
      }
    }
  };

  return {
    formData,
    setFormData,
    categories,
    colors,
    isLoadingOptions,
    isLoadingProduct,
    isSubmitting,
    error,
    fieldErrors,
    isEditMode,
    product,
    handleSubmit,
    handleCategoryToggle,
    handleColorToggle,
    updateField,
  };
};
