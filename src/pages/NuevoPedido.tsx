import { useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MenuProductos } from '@/components/MenuProductos';
import { CarritoCompras } from '@/components/CarritoCompras';
import { usePedidos } from '@/hooks/usePedidos';
import { Producto } from '@/types/pedido';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const NuevoPedido = () => {
  const navigate = useNavigate();
  const { crearPedido, isCreating } = usePedidos();
  const [cart, setCart] = useState<Producto[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (producto: Producto) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === producto.id);
      if (existing) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, producto];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleCreateOrder = (numeroMesa: number) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    crearPedido({
      numero_mesa: numeroMesa,
      productos: cart,
      total
    });
    setCart([]);
    setIsCartOpen(false);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Mobile */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
          
          <h1 className="text-lg font-semibold">Nuevo Pedido</h1>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Cart Button Mobile */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative"
                  disabled={cart.length === 0}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cart.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Tu Pedido</SheetTitle>
                </SheetHeader>
                <div className="mt-4 h-full overflow-y-auto">
                  <CarritoCompras
                    cart={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onCreateOrder={handleCreateOrder}
                    isCreating={isCreating}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 pb-20">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <MenuProductos
              onAddToCart={handleAddToCart}
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>
          <div className="lg:col-span-1">
            <CarritoCompras
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCreateOrder={handleCreateOrder}
              isCreating={isCreating}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <MenuProductos
            onAddToCart={handleAddToCart}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </div>
      </div>

      {/* Fixed Bottom Cart Summary - Mobile Only */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t shadow-lg p-4 z-30">
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button className="w-full flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Ver Carrito ({totalItems})</span>
                </span>
                <span className="font-bold">${totalPrice.toLocaleString()}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Tu Pedido</SheetTitle>
              </SheetHeader>
              <div className="mt-4 h-full overflow-y-auto">
                <CarritoCompras
                  cart={cart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCreateOrder={handleCreateOrder}
                  isCreating={isCreating}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
};

export default NuevoPedido;