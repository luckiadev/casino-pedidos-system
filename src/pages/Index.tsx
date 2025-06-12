import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePedidos } from '@/hooks/usePedidos';
import { PedidoCard } from '@/components/PedidoCard';
import { MenuProductos } from '@/components/MenuProductos';
import { CarritoCompras } from '@/components/CarritoCompras';
import { Producto } from '@/types/pedido';
import { ShoppingCart, Clock, CheckCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const { 
    pedidos, 
    isLoading, 
    crearPedido, 
    actualizarEstado, 
    isCreating, 
    isUpdating 
  } = usePedidos();

  const [cart, setCart] = useState<Producto[]>([]);

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
  };

  const getEstadisticas = () => {
    const pendientes = pedidos.filter(p => p.estado === 'Pendiente').length;
    const enPreparacion = pedidos.filter(p => p.estado === 'En Preparación').length;
    const preparados = pedidos.filter(p => p.estado === 'Preparado').length;
    const entregados = pedidos.filter(p => p.estado === 'Entregado').length;

    return { pendientes, enPreparacion, preparados, entregados };
  };

  const stats = getEstadisticas();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl font-bold">Sistema de Pedidos Casino</h1>
        <p className="text-gray-600">Gestión completa de pedidos para mesas del casino</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold">{stats.pendientes}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-600">En Preparación</p>
              <p className="text-2xl font-bold">{stats.enPreparacion}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-600">Preparados</p>
              <p className="text-2xl font-bold">{stats.preparados}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-600">Entregados</p>
              <p className="text-2xl font-bold">{stats.entregados}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pedidos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pedidos">Gestión de Pedidos</TabsTrigger>
          <TabsTrigger value="nuevo" className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Nuevo Pedido</span>
            {cart.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {cart.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pedidos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidos
                  .filter(pedido => pedido.estado !== 'Entregado')
                  .map((pedido) => (
                    <PedidoCard
                      key={pedido.id}
                      pedido={pedido}
                      onUpdateEstado={actualizarEstado}
                      isUpdating={isUpdating}
                    />
                  ))}
              </div>
              {pedidos.filter(pedido => pedido.estado !== 'Entregado').length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No hay pedidos activos
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Pedidos Entregados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pedidos
                  .filter(pedido => pedido.estado === 'Entregado')
                  .slice(0, 6)
                  .map((pedido) => (
                    <PedidoCard
                      key={pedido.id}
                      pedido={pedido}
                      onUpdateEstado={actualizarEstado}
                      isUpdating={isUpdating}
                    />
                  ))}
              </div>
              {pedidos.filter(pedido => pedido.estado === 'Entregado').length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No hay pedidos entregados
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nuevo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Menú de Productos</CardTitle>
                </CardHeader>
                <CardContent>
                  <MenuProductos
                    onAddToCart={handleAddToCart}
                    cart={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                </CardContent>
              </Card>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
