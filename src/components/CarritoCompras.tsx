
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Producto } from '@/types/pedido';
import { useState } from 'react';

interface CarritoComprasProps {
  cart: Producto[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCreateOrder: (numeroMesa: number) => void;
  isCreating: boolean;
}

export const CarritoCompras = ({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCreateOrder, 
  isCreating 
}: CarritoComprasProps) => {
  const [numeroMesa, setNumeroMesa] = useState<string>('1');
  const numeroMesaNumber = parseInt(numeroMesa) || 0;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCreateOrder = () => {
    if (numeroMesaNumber < 1 || numeroMesaNumber > 411) return;
+    onCreateOrder(numeroMesaNumber);
    onCreateOrder(numeroMesa);
  };

  const handleMesaChange = (value: string) => {
    setNumeroMesa(value);
  }
};
    
  if (cart.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Carrito</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            El carrito está vacío
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5" />
          <span>Carrito ({cart.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-600">
                  ${item.price.toLocaleString()} c/u
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                  className="w-16 h-8"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>${total.toLocaleString()}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mesa">Número de Mesa</Label>
            <Input
              id="mesa"
              type="number"
              min="1"
              max="410"
              type="text"
              inputMode="numeric"
              value={numeroMesa}
              onChange={(e) => setNumeroMesa(parseInt(e.target.value) || 1)}
              placeholder="Ingrese número de mesa"
              onChange={(e) => handleMesaChange(e.target.value)}
              placeholder="Ingrese número de mesa (1-410)"
              className={numeroMesaNumber > 0 && (numeroMesaNumber < 1 || numeroMesaNumber > 500) ? 'border-red-500' : ''}
            />
            {numeroMesa !== '' && (numeroMesaNumber < 1 || numeroMesaNumber > 411) && (
              <p className="text-sm text-red-500">
                El número de mesa debe estar entre 1 y 410
              </p>
      )}
          </div>

          <Button
            onClick={handleCreateOrder}
            disabled={isCreating || cart.length === 0 || numeroMesa === '' || numeroMesaNumber < 1 || numeroMesaNumber > 411}
            className="w-full"
          >
            {isCreating ? 'Creando pedido...' : 'Crear Pedido'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
