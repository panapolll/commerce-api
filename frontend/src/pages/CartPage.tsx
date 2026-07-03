import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCart, removeFromCart } from '../api/cart';
import { checkout } from '../api/orders';

interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'โหลดตะกร้าไม่สำเร็จ');
      } else {
        setError('โหลดตะกร้าไม่สำเร็จ');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCart();
  }, []);

  const totalPrice = cart?.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0,
  ) ?? 0;

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'ลบสินค้าไม่สำเร็จ');
      }
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setError('');
    try {
      const order = await checkout();
      navigate('/payment', {
        state: {
          orderId: order._id,
          totalPrice: order.totalPrice,
        },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Checkout ไม่สำเร็จ');
      } else {
        setError('Checkout ไม่สำเร็จ');
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', padding: '40px 20px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ color: '#fff', margin: 0 }}>🛒 ตะกร้าสินค้า</h1>
          <button
            onClick={() => navigate('/products')}
            style={{
              background: 'transparent',
              border: '1px solid #555',
              color: '#aaa',
              padding: '8px 16px',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            ← กลับไปเลือกสินค้า
          </button>
        </div>

        {error && <p style={{ color: '#ff4d4d' }}>{error}</p>}

        {!cart?.items?.length ? (
          <p style={{ color: '#888', textAlign: 'center' }}>ตะกร้าว่างเปล่า</p>
        ) : (
          <>
            <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
              {cart.items.map((item) => (
                <div
                  key={item.productId._id}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ color: '#fff', margin: '0 0 4px', fontWeight: 'bold' }}>
                      {item.productId.name}
                    </p>
                    <p style={{ color: '#888', margin: 0 }}>
                      ฿{item.productId.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ color: '#4ade80', fontWeight: 'bold' }}>
                      ฿{(item.productId.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRemove(item.productId._id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #ff4d4d',
                        color: '#ff4d4d',
                        padding: '6px 12px',
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: 12,
              padding: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 18 }}>ยอดรวม</span>
              <span style={{ color: '#4ade80', fontSize: 24, fontWeight: 'bold' }}>
                ฿{totalPrice.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              style={{
                width: '100%',
                marginTop: 16,
                background: '#4ade80',
                border: 'none',
                color: '#000',
                padding: '14px',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              {checkoutLoading ? 'กำลังสร้างออเดอร์...' : '💳 Checkout'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
