import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Category, CartItem, Order, UserProfile, UserRole } from '../types';
import { INITIAL_BOOKS, INITIAL_CATEGORIES, INITIAL_USER, INITIAL_ORDERS } from '../data/mockData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface LibraryContextType {
  // Books & Categories
  books: Book[];
  categories: Category[];
  addBook: (bookData: Omit<Book, 'id'>) => void;
  updateBook: (id: string, bookData: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addCategory: (name: string, description?: string) => void;
  deleteCategory: (id: string) => void;
  resetDefaultCatalog: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (book: Book, quantity?: number) => boolean;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: { code: string; percent: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartFinalTotal: number;

  // Checkout & Orders
  orders: Order[];
  completeCheckout: (details: {
    customerName: string;
    email: string;
    address: string;
    city: string;
    paymentMethod: 'Tarjeta' | 'Contraentrega' | 'Transferencia';
  }) => Order | null;

  // User & Roles
  user: UserProfile;
  role: UserRole;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
  updateUser: (data: Partial<UserProfile>) => void;
  loginUser: (email: string, password?: string, customName?: string) => void;
  logoutUser: () => void;

  // Navigation & Modals
  activeView: 'shop' | 'admin';
  setActiveView: (view: 'shop' | 'admin') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isFAQModalOpen: boolean;
  setIsFAQModalOpen: (open: boolean) => void;
  isTermsModalOpen: boolean;
  setIsTermsModalOpen: (open: boolean) => void;
  selectedBookDetail: Book | null;
  setSelectedBookDetail: (book: Book | null) => void;
  editingBook: Book | null;
  setEditingBook: (book: Book | null) => void;
  isBookFormOpen: boolean;
  setIsBookFormOpen: (open: boolean) => void;

  // Filters & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'title-asc';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'title-asc') => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  resetFilters: () => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage hydrated states
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const stored = localStorage.getItem('univ_books_v1');
      return stored ? JSON.parse(stored) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem('univ_cats_v1');
      return stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('univ_cart_v1');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const stored = localStorage.getItem('univ_role_v1');
      return (stored as UserRole) || 'client';
    } catch {
      return 'client';
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('univ_user_v1');
      return stored ? JSON.parse(stored) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('univ_orders_v1');
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('univ_logged_v1') === 'true';
  });

  // Views & Modals
  const [activeView, setActiveView] = useState<'shop' | 'admin'>('shop');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [selectedBookDetail, setSelectedBookDetail] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 80]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'title-asc'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('univ_books_v1', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('univ_cats_v1', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('univ_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('univ_role_v1', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('univ_user_v1', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('univ_orders_v1', JSON.stringify(orders));
  }, [orders]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUser((prev) => ({ ...prev, role: newRole }));
    if (newRole === 'admin') {
      setActiveView('admin');
      showToast('Modo Administrador activado: Control de inventario y catálogo disponible', 'info');
    } else {
      setActiveView('shop');
      showToast('Modo Cliente activado: Vista de comprador y biblioteca', 'info');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 80]);
    setSortBy('featured');
    setInStockOnly(false);
  };

  const resetDefaultCatalog = () => {
    setBooks(INITIAL_BOOKS);
    setCategories(INITIAL_CATEGORIES);
    showToast('Catálogo e inventario restaurados a los valores iniciales', 'info');
  };

  // CRUD Books
  const addBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: `b-${Date.now()}`,
      rating: bookData.rating || 5.0,
      reviewsCount: bookData.reviewsCount || 1,
      isbn: bookData.isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      year: bookData.year || new Date().getFullYear(),
    };
    setBooks((prev) => [newBook, ...prev]);
    showToast(`"${newBook.title}" añadido con éxito al catálogo`);
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...bookData } : b))
    );
    showToast('Libro actualizado correctamente');
  };

  const deleteBook = (id: string) => {
    const bookToDelete = books.find((b) => b.id === id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setCart((prev) => prev.filter((item) => item.book.id !== id));
    showToast(`Libro "${bookToDelete?.title || id}" eliminado del catálogo`, 'warning');
  };

  // Categories
  const addCategory = (name: string, description?: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    if (categories.some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
      showToast('Esta categoría ya existe', 'warning');
      return;
    }
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: cleanName,
      description: description?.trim() || `Colección selecta de ${cleanName.toLowerCase()}`
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Categoría "${cleanName}" agregada con éxito`);
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    // Don't allow deletion if books exist in category
    const count = books.filter((b) => b.category.toLowerCase() === cat.name.toLowerCase()).length;
    if (count > 0) {
      showToast(`No se puede eliminar "${cat.name}" porque tiene ${count} libro(s) asignados`, 'warning');
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast(`Categoría "${cat.name}" eliminada`);
  };

  // Cart operations
  const addToCart = (book: Book, quantity: number = 1): boolean => {
    if (book.stock <= 0) {
      showToast(`"${book.title}" no cuenta con stock disponible`, 'warning');
      return false;
    }

    let success = false;
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        if (existing.quantity + quantity > book.stock) {
          showToast(`Límite de stock alcanzado (${book.stock} disponibles)`, 'warning');
          return prev;
        }
        success = true;
        return prev.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        if (quantity > book.stock) {
          showToast(`Solo hay ${book.stock} unidades en stock`, 'warning');
          return prev;
        }
        success = true;
        return [...prev, { book, quantity }];
      }
    });

    if (success) {
      showToast(`¡"${book.title}" agregado al carrito!`);
    }
    return success;
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
    showToast('Libro removido del carrito', 'info');
  };

  const updateCartQuantity = (bookId: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.book.id === bookId);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((i) => i.book.id !== bookId);
      }
      if (newQty > item.book.stock) {
        showToast(`Stock máximo alcanzado (${item.book.stock} unidades)`, 'warning');
        return prev;
      }
      return prev.map((i) => (i.book.id === bookId ? { ...i, quantity: newQty } : i));
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'UNIVERSAL10') {
      setAppliedCoupon({ code: 'UNIVERSAL10', percent: 10 });
      showToast('¡Cupón aplicado! 10% de descuento concedido');
      return { success: true, message: '10% de descuento aplicado' };
    }
    if (clean === 'LECTOR20') {
      setAppliedCoupon({ code: 'LECTOR20', percent: 20 });
      showToast('¡Cupón especial Lector aplicado! 20% de descuento');
      return { success: true, message: '20% de descuento aplicado' };
    }
    return { success: false, message: 'Código de cupón inválido o expirado' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón removido', 'info');
  };

  // Calculations
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = Number(cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0).toFixed(2));
  const cartDiscount = appliedCoupon
    ? Number(((cartSubtotal * appliedCoupon.percent) / 100).toFixed(2))
    : 0;
  // Free shipping above 40
  const cartShipping = cartSubtotal > 40 || cartTotalCount === 0 ? 0 : 4.50;
  const cartFinalTotal = Number(Math.max(0, cartSubtotal - cartDiscount + cartShipping).toFixed(2));

  // Checkout
  const completeCheckout = (details: {
    customerName: string;
    email: string;
    address: string;
    city: string;
    paymentMethod: 'Tarjeta' | 'Contraentrega' | 'Transferencia';
  }): Order | null => {
    if (cart.length === 0) return null;
    if (!isLoggedIn) {
      showToast('Debe iniciar sesión en su cuenta de cliente para proceder con la compra', 'warning');
      return null;
    }

    // Deduct stock in catalog
    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        const cartItem = cart.find((i) => i.book.id === book.id);
        if (cartItem) {
          return {
            ...book,
            stock: Math.max(0, book.stock - cartItem.quantity)
          };
        }
        return book;
      })
    );

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      items: cart.map((item) => ({
        bookId: item.book.id,
        bookTitle: item.book.title,
        author: item.book.author,
        imageUrl: item.book.imageUrl,
        quantity: item.quantity,
        price: item.book.price
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shipping: cartShipping,
      total: cartFinalTotal,
      status: 'Procesando',
      customerName: details.customerName,
      email: details.email,
      address: details.address,
      city: details.city,
      paymentMethod: details.paymentMethod
    };

    setOrders((prev) => [newOrder, ...prev]);
    // Add loyalty points
    const earnedPoints = Math.round(cartFinalTotal * 2);
    setUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + earnedPoints,
      name: details.customerName || prev.name,
      email: details.email || prev.email
    }));

    clearCart();
    setAppliedCoupon(null);
    setIsCartOpen(false);
    showToast(`¡Pedido ${orderId} realizado con éxito! Gracias por su compra`);
    return newOrder;
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
    showToast('Perfil actualizado correctamente');
  };

  const loginUser = (email: string, password?: string, customName?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password?.trim().toLowerCase();

    // Check if the user is entering Administrator credentials
    const isAdmin =
      cleanEmail.includes('admin') ||
      cleanPass === 'admin' ||
      cleanPass === 'admin123';

    if (isAdmin) {
      const adminName = customName || (cleanEmail.includes('@') ? cleanEmail.split('@')[0] : 'Administrador');
      const updatedUser: UserProfile = {
        name: adminName.charAt(0).toUpperCase() + adminName.slice(1),
        email: cleanEmail || 'admin@universal.com',
        phone: '+34 912 345 678',
        role: 'admin',
        memberSince: 'Enero 2024',
        loyaltyPoints: 1450,
        favoriteGenre: 'Gestión y Literatura Universal',
      };
      setUser(updatedUser);
      setRoleState('admin');
      setActiveView('admin');
      setIsLoggedIn(true);
      localStorage.setItem('univ_logged_v1', 'true');
      setIsAuthModalOpen(false);
      showToast(`¡Rol de Administrador activado! Bienvenido(a), ${updatedUser.name}`, 'success');
    } else {
      const rawName = customName || (cleanEmail.includes('@') ? cleanEmail.split('@')[0] : 'Lector');
      const clientName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const updatedUser: UserProfile = {
        name: clientName,
        email: cleanEmail || 'lector@universal.com',
        phone: user.phone || '+34 612 984 551',
        role: 'client',
        memberSince: user.memberSince || 'Septiembre 2026',
        loyaltyPoints: user.loyaltyPoints || 220,
        favoriteGenre: user.favoriteGenre || 'Novelas y Filosofía',
      };
      setUser(updatedUser);
      setRoleState('client');
      setActiveView('shop');
      setIsLoggedIn(true);
      localStorage.setItem('univ_logged_v1', 'true');
      setIsAuthModalOpen(false);
      showToast(`¡Bienvenido(a) a la biblioteca, ${clientName}!`, 'success');
    }
  };

  const logoutUser = () => {
    const guestUser: UserProfile = {
      name: 'Lector Invitado',
      email: '',
      phone: '',
      role: 'client',
      memberSince: 'Hoy',
      loyaltyPoints: 0,
      favoriteGenre: 'Novelas',
    };
    setUser(guestUser);
    setRoleState('client');
    setActiveView('shop');
    setIsLoggedIn(false);
    localStorage.removeItem('univ_logged_v1');
    showToast('Has cerrado sesión. Navegando como Lector Invitado.', 'info');
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        categories,
        addBook,
        updateBook,
        deleteBook,
        addCategory,
        deleteCategory,
        resetDefaultCatalog,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotalCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartFinalTotal,

        orders,
        completeCheckout,

        user,
        role,
        isLoggedIn,
        setRole,
        updateUser,
        loginUser,
        logoutUser,

        activeView,
        setActiveView,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isProfileOpen,
        setIsProfileOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isFAQModalOpen,
        setIsFAQModalOpen,
        isTermsModalOpen,
        setIsTermsModalOpen,
        selectedBookDetail,
        setSelectedBookDetail,
        editingBook,
        setEditingBook,
        isBookFormOpen,
        setIsBookFormOpen,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        resetFilters,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
