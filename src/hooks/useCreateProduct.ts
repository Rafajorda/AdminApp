/**
 * Hook personalizado para crear productos
 * 
 * Gestiona el estado del formulario, validación y lógica de creación
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { CreateProductInput } from '../types/product';
import { createProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { getColors } from '../services/colorService';
import { Category, Color } from '../types/product';
import { CreateProductSchema } from '../schemas/product.schema';

interface UseCreateProductReturn {
  // Datos del formulario
  formData: CreateProductInput;
  setFormData: React.Dispatch<React.SetStateAction<CreateProductInput>>;
  
  // Categorías y colores disponibles
  categories: Category[];
  colors: Color[];
  isLoadingOptions: boolean;
  
  // Estados de UI
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  
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

export const useCreateProduct = (): UseCreateProductReturn => {
  const router = useRouter();
  
  // Estado del formulario
  const [formData, setFormData] = useState<CreateProductInput>(initialFormData);
  
  // Categorías y colores
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  
  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /**
   * Carga categorías y colores al montar el componente
   */
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      setIsLoadingOptions(true);
      const [categoriesData, colorsData] = await Promise.all([
        getCategories(),
        getColors(),
      ]);
      
      setCategories(categoriesData);
      setColors(colorsData);
    } catch (err) {
      console.error('[useCreateProduct] Error loading options:', err);
      setError('Error al cargar categorías y colores');
    } finally {
      setIsLoadingOptions(false);
    }
  };

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
    
    // Limpiar error de categorías
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
    
    // Limpiar error de colores
    if (fieldErrors.colorIds) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.colorIds;
        return newErrors;
      });
    }
  };

  /**
   * Envía el formulario
   */
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setFieldErrors({});

      // Validar con Zod
      const validatedData = CreateProductSchema.parse(formData);

      // Crear producto
      await createProduct(validatedData);

      // Navegar de vuelta al dashboard
      router.back();
    } catch (err: any) {
      console.error('[useCreateProduct] Error creating product:', err);
      
      if (err.name === 'ZodError') {
        // Errores de validación de Zod
        const errors: Record<string, string> = {};
        err.errors.forEach((error: any) => {
          const field = error.path[0];
          errors[field] = error.message;
        });
        setFieldErrors(errors);
        setError('Por favor corrige los errores en el formulario');
      } else {
        // Si es error de sesión expirada, redirigir al login
        if (err.message?.includes('sesión ha expirado')) {
          setError(err.message);
          setTimeout(() => {
            router.replace('/login');
          }, 2000);
        } else {
          setError(err.message || 'Error al crear el producto');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    categories,
    colors,
    isLoadingOptions,
    isSubmitting,
    error,
    fieldErrors,
    handleSubmit,
    handleCategoryToggle,
    handleColorToggle,
    updateField,
  };
};
