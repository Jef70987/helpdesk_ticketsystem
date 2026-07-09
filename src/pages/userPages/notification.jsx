import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications/');
      setNotifications(response);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/mark-read/${id}/`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_unread: false } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read/');
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_unread: false }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => n.is_unread).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-gray-200 p-10 text-center">
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`px-4 py-3 hover:bg-gray-50 ${notif.is_unread ? 'bg-blue-50' : ''}`}
            >
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/tickets/${notif.ticket_id}`}
                    className="block"
                    onClick={() => {
                      if (notif.is_unread) markAsRead(notif.id);
                    }}
                  >
                    <p className={`text-sm ${notif.is_unread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {notif.content}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">
                        Ticket #{notif.ticket_id}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(notif.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </Link>
                </div>
                {notif.is_unread && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;