/**
 * Hook personalizado para formulario de productos (crear/editar)
 * 
 * Gestiona el estado del formulario, validación y lógica de guardado
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { CreateProductInput, Product } from '../types/product';
import { createProduct, updateProduct, getProductById } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { getColors } from '../services/colorService';
import { Category, Color } from '../types/product';
import { CreateProductSchema, UpdateProductSchema } from '../schemas/product.schema';

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
  
  // Estado del formulario
  const [formData, setFormData] = useState<CreateProductInput>(initialFormData);
  
  // Categorías y colores
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEditMode);
  
  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /**
   * Carga categorías, colores y producto (si es edición)
   */
  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      setIsLoadingOptions(true);
      
      // Cargar categorías y colores
      const [categoriesData, colorsData] = await Promise.all([
        getCategories(),
        getColors(),
      ]);
      
      setCategories(categoriesData);
      setColors(colorsData);
      
      // Si es modo edición, cargar el producto
      if (productId) {
        setIsLoadingProduct(true);
        const product = await getProductById(productId);
        
        // Mapear producto a formData
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
        setIsLoadingProduct(false);
      }
    } catch (err) {
      console.error('[useProductForm] Error loading data:', err);
      setError('Error al cargar datos');
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
      setIsSubmitting(true);
      setError(null);
      setFieldErrors({});

      if (isEditMode && productId) {
        // Modo edición: validar con UpdateProductSchema
        const validatedData = UpdateProductSchema.parse({ id: productId, ...formData });
        await updateProduct(productId, validatedData);
      } else {
        // Modo creación: validar con CreateProductSchema
        const validatedData = CreateProductSchema.parse(formData);
        await createProduct(validatedData);
      }

      // Navegar de vuelta al dashboard
      router.back();
    } catch (err: any) {
      console.error('[useProductForm] Error submitting:', err);
      
      if (err.name === 'ZodError') {
        const errors: Record<string, string> = {};
        err.errors.forEach((error: any) => {
          const field = error.path[0];
          errors[field] = error.message;
        });
        setFieldErrors(errors);
        setError('Por favor corrige los errores en el formulario');
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
    isLoadingProduct,
    isSubmitting,
    error,
    fieldErrors,
    isEditMode,
    handleSubmit,
    handleCategoryToggle,
    handleColorToggle,
    updateField,
  };
};
