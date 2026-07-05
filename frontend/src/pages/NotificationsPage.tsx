/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  deleteNotification,
  getMyNotifications,
  markAllAsRead,
  markAsRead,
  type Notification,
} from '../api/notifications';

const typeIcon: Record<string, string> = {
  payment_success: '💳',
  order_placed: '📦',
  order_shipped: '🚚',
  system: '🔔',
  promotion: '🎁',
};

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data.data ?? []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'โหลดการแจ้งเตือนไม่สำเร็จ');
      } else {
        setError('โหลดการแจ้งเตือนไม่สำเร็จ');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchNotifications();
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch {
      showMessage('❌ อ่านแล้วไม่สำเร็จ');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showMessage('✅ อ่านทั้งหมดแล้ว');
    } catch {
      showMessage('❌ อ่านทั้งหมดไม่สำเร็จ');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      showMessage('✅ ลบแล้ว');
    } catch {
      showMessage('❌ ลบไม่สำเร็จ');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div style={centerStyle}>
        <p style={{ color: '#fff' }}>กำลังโหลด...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={centerStyle}>
        <p style={{ color: '#ff4d4d' }}>{error}</p>
        <button onClick={() => navigate('/products')} style={backBtnStyle}>
          กลับหน้าสินค้า
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', padding: '40px 20px' }}>
      {message && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 8,
          zIndex: 1000,
        }}>
          {message}
        </div>
      )}

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
        }}>
          <div>
            <h1 style={{ color: '#fff', margin: 0, fontSize: 28 }}>🔔 การแจ้งเตือน</h1>
            <p style={{ color: '#888', margin: '4px 0 0' }}>
              {unreadCount > 0 ? `ยังไม่ได้อ่าน ${unreadCount} รายการ` : 'อ่านครบแล้ว'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {unreadCount > 0 && (
              <button onClick={() => void handleMarkAllAsRead()} style={markAllBtnStyle}>
                อ่านทั้งหมด
              </button>
            )}
            <button onClick={() => navigate('/products')} style={backBtnStyle}>
              กลับ
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            color: '#888',
          }}>
            ยังไม่มีการแจ้งเตือน
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                style={{
                  background: notification.isRead ? '#1a1a1a' : '#1e2a1e',
                  border: `1px solid ${notification.isRead ? '#2a2a2a' : '#2a4a2a'}`,
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: 28 }}>
                  {typeIcon[notification.type] ?? '🔔'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <h3 style={{
                      color: '#fff',
                      margin: 0,
                      fontSize: 16,
                      fontWeight: notification.isRead ? 'normal' : 'bold',
                    }}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span style={{
                        background: '#3b82f6',
                        color: '#fff',
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 10,
                        flexShrink: 0,
                      }}>
                        ใหม่
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#aaa', margin: '6px 0', fontSize: 14 }}>
                    {notification.message}
                  </p>
                  <p style={{ color: '#555', margin: 0, fontSize: 12 }}>
                    {new Date(notification.createdAt).toLocaleString('th-TH')}
                  </p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    {!notification.isRead && (
                      <button
                        onClick={() => void handleMarkAsRead(notification._id)}
                        style={actionBtnStyle}
                      >
                        อ่านแล้ว
                      </button>
                    )}
                    <button
                      onClick={() => void handleDelete(notification._id)}
                      style={{ ...actionBtnStyle, color: '#ff4d4d', borderColor: '#ff4d4d' }}
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const centerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  gap: 16,
};

const backBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #555',
  color: '#aaa',
  padding: '8px 20px',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
};

const markAllBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #3b82f6',
  color: '#3b82f6',
  padding: '8px 20px',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
};

const actionBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #555',
  color: '#aaa',
  padding: '4px 12px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 12,
};

export default NotificationsPage;
