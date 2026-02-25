
import React, { useState, useEffect } from 'react';

// --- MOCK ICONS ---
const Icon = ({ name, style = {} }) => {
    const iconMap = {
        'dashboard': '📊', 'orders': '🧺', 'partners': '🤝', 'settings': '⚙️', 'logout': '🚪',
        'add': '➕', 'edit': '✏️', 'delete': '🗑️', 'search': '🔍', 'filter': '🔎',
        'customer': '👤', 'provider': '🧑‍🔧', 'admin': '👑', 'delivery': '🚚', 'pickup': '📦',
        'placed': '✍️', 'ready': '✅', 'accepted': '👍', 'ironing': '🔥', 'delivered': '✔️',
        'money': '💰', 'time': '⏱️', 'activity': '🔔', 'task': '📋', 'bell': '🔔',
        'chevron-right': '▶️', 'chevron-down': '🔽', 'upload': '⬆️', 'file': '📄',
        'success': '✔️', 'error': '❌', 'warning': '⚠️', 'info': 'ℹ️',
    };
    return <span style={style}>{iconMap[name] || name}</span>;
};

// --- MOCK DATA ---
const MOCK_USERS = [
    { id: 'u1', username: 'admin', password: 'password', role: 'ADMIN', name: 'Admin User' },
    { id: 'u2', username: 'customer1', password: 'password', role: 'CUSTOMER', name: 'Alice Customer' },
    { id: 'u3', username: 'provider1', password: 'password', role: 'SERVICE_PROVIDER', name: 'Bob Ironer' },
    { id: 'u4', username: 'customer2', password: 'password', role: 'CUSTOMER', name: 'Charlie Customer' },
];

const MOCK_PARTNERS = [
    { id: 'p1', name: 'Bob Ironing Services', contact: 'bob@example.com', status: 'ACTIVE' },
    { id: 'p2', name: 'Quick Iron Solutions', contact: 'quick@example.com', status: 'ACTIVE' },
    { id: 'p3', name: 'FastPress Laundry', contact: 'fast@example.com', status: 'INACTIVE' },
];

const MOCK_ORDERS = [
    {
        id: 'o1', customerId: 'u2', providerId: 'p1',
        items: [{ type: 'shirt', quantity: 5, specialInstruction: '' }],
        deliveryOption: 'DOORSTEP', status: 'CREATED', createdAt: '2023-10-26T10:00:00Z',
        updatedAt: '2023-10-26T10:00:00Z', price: 25.00,
        timeline: [{ status: 'CREATED', timestamp: '2023-10-26T10:00:00Z', actor: 'u2' }],
        auditLog: [{ event: 'Order Created', timestamp: '2023-10-26T10:00:00Z', userId: 'u2' }]
    },
    {
        id: 'o2', customerId: 'u2', providerId: 'p1',
        items: [{ type: 'trousers', quantity: 3 }],
        deliveryOption: 'DOORSTEP', status: 'ACCEPTED', createdAt: '2023-10-25T14:30:00Z',
        updatedAt: '2023-10-25T15:00:00Z', price: 18.00,
        timeline: [{ status: 'CREATED', timestamp: '2023-10-25T14:30:00Z', actor: 'u2' }, { status: 'ACCEPTED', timestamp: '2023-10-25T15:00:00Z', actor: 'u3' }],
        auditLog: [{ event: 'Order Created', timestamp: '2023-10-25T14:30:00Z', userId: 'u2' }, { event: 'Order Status Change: CREATED -> ACCEPTED', timestamp: '2023-10-25T15:00:00Z', userId: 'u3' }]
    },
    {
        id: 'o3', customerId: 'u4', providerId: 'p2',
        items: [{ type: 'dress', quantity: 1, specialInstruction: 'extra starch' }, { type: 'bedsheet', quantity: 2 }],
        deliveryOption: 'CUSTOMER_PICKUP', status: 'IRONING', createdAt: '2023-10-24T09:00:00Z',
        updatedAt: '2023-10-24T12:00:00Z', price: 35.00,
        timeline: [{ status: 'CREATED', timestamp: '2023-10-24T09:00:00Z', actor: 'u4' }, { status: 'ACCEPTED', timestamp: '2023-10-24T10:00:00Z', actor: 'u3' }, { status: 'IRONING', timestamp: '2023-10-24T12:00:00Z', actor: 'u3' }],
        auditLog: [{ event: 'Order Created', timestamp: '2023-10-24T09:00:00Z', userId: 'u4' }, { event: 'Order Status Change: CREATED -> ACCEPTED', timestamp: '2023-10-24T10:00:00Z', userId: 'u3' }, { event: 'Order Status Change: ACCEPTED -> IRONING', timestamp: '2023-10-24T12:00:00Z', userId: 'u3' }]
    },
    {
        id: 'o4', customerId: 'u4', providerId: 'p2',
        items: [{ type: 'towel', quantity: 10 }],
        deliveryOption: 'CUSTOMER_PICKUP', status: 'READY', createdAt: '2023-10-23T16:00:00Z',
        updatedAt: '2023-10-23T20:00:00Z', price: 20.00,
        timeline: [{ status: 'CREATED', timestamp: '2023-10-23T16:00:00Z', actor: 'u4' }, { status: 'ACCEPTED', timestamp: '2023-10-23T17:00:00Z', actor: 'u3' }, { status: 'IRONING', timestamp: '2023-10-23T18:00:00Z', actor: 'u3' }, { status: 'READY', timestamp: '2023-10-23T20:00:00Z', actor: 'u3' }],
        auditLog: [{ event: 'Order Created', timestamp: '2023-10-23T16:00:00Z', userId: 'u4' }, { event: 'Order Status Change: CREATED -> ACCEPTED', timestamp: '2023-10-23T17:00:00Z', userId: 'u3' }, { event: 'Order Status Change: ACCEPTED -> IRONING', timestamp: '2023-10-23T18:00:00Z', userId: 'u3' }, { event: 'Order Status Change: IRONING -> READY', timestamp: '2023-10-23T20:00:00Z', userId: 'u3' }]
    },
    {
        id: 'o5', customerId: 'u2', providerId: 'p1',
        items: [{ type: 'shirt', quantity: 7 }],
        deliveryOption: 'DOORSTEP', status: 'DELIVERED', createdAt: '2023-10-22T11:00:00Z',
        updatedAt: '2023-10-22T16:00:00Z', price: 35.00,
        timeline: [{ status: 'CREATED', timestamp: '2023-10-22T11:00:00Z', actor: 'u2' }, { status: 'ACCEPTED', timestamp: '2023-10-22T12:00:00Z', actor: 'u3' }, { status: 'IRONING', timestamp: '2023-10-22T14:00:00Z', actor: 'u3' }, { status: 'READY', timestamp: '2023-10-22T15:00:00Z', actor: 'u3' }, { status: 'DELIVERED', timestamp: '2023-10-22T16:00:00Z', actor: 'u3' }],
        auditLog: [{ event: 'Order Created', timestamp: '2023-10-22T11:00:00Z', userId: 'u2' }, { event: 'Order Status Change: CREATED -> ACCEPTED', timestamp: '2023-10-22T12:00:00Z', userId: 'u3' }, { event: 'Order Status Change: ACCEPTED -> IRONING', timestamp: '2023-10-22T14:00:00Z', userId: 'u3' }, { event: 'Order Status Change: IRONING -> READY', timestamp: '2023-10-22T15:00:00Z', userId: 'u3' }, { event: 'Order Status Change: READY -> DELIVERED', timestamp: '2023-10-22T16:00:00Z', userId: 'u3' }]
    },
    {
        id: 'o6', customerId: 'u4', providerId: 'p2',
        items: [{ type: 'saree', quantity: 2 }],
        deliveryOption: 'CUSTOMER_PICKUP', status: 'CUSTOMER_PICKED', createdAt: '2023-10-21T09:00:00Z',
        updatedAt: '2023-10-21T14:00:00Z', price: 40.00,
        timeline: [{ status: 'CREATED', timestamp: '2023-10-21T09:00:00Z', actor: 'u4' }, { status: 'ACCEPTED', timestamp: '2023-10-21T10:00:00Z', actor: 'u3' }, { status: 'IRONING', timestamp: '2023-10-21T11:00:00Z', actor: 'u3' }, { status: 'READY', timestamp: '2023-10-21T13:00:00Z', actor: 'u3' }, { status: 'CUSTOMER_PICKED', timestamp: '2023-10-21T14:00:00Z', actor: 'u4' }],
        auditLog: [{ event: 'Order Created', timestamp: '2023-10-21T09:00:00Z', userId: 'u4' }, { event: 'Order Status Change: CREATED -> ACCEPTED', timestamp: '2023-10-21T10:00:00Z', userId: 'u3' }, { event: 'Order Status Change: ACCEPTED -> IRONING', timestamp: '2023-10-21T11:00:00Z', userId: 'u3' }, { event: 'Order Status Change: IRONING -> READY', timestamp: '2023-10-21T13:00:00Z', userId: 'u3' }, { event: 'Order Status Change: READY -> CUSTOMER_PICKED', timestamp: '2023-10-21T14:00:00Z', userId: 'u4' }]
    },
    {
        id: 'o7', customerId: 'u2', providerId: 'p1',
        items: [{ type: 'jeans', quantity: 2 }],
        deliveryOption: 'DOORSTEP', status: 'CREATED', createdAt: '2023-10-27T08:30:00Z',
        updatedAt: '2023-10-27T08:30:00Z', price: 10.00,
        timeline: [{ status: 'CREATED', timestamp: '2023-10-27T08:30:00Z', actor: 'u2' }],
        auditLog: [{ event: 'Order Created', timestamp: '2023-10-27T08:30:00Z', userId: 'u2' }]
    },
    {
        id: 'o8', customerId: 'u4', providerId: 'p2',
        items: [{ type: 'shirt', quantity: 3 }],
        deliveryOption: 'DOORSTEP', status: 'IRONING', createdAt: '2023-10-26T14:00:00Z',
        updatedAt: '2023-10-26T16:00:00Z', price: 15.00,
        timeline: [{ status: 'CREATED', timestamp: '2023-10-26T14:00:00Z', actor: 'u4' }, { status: 'ACCEPTED', timestamp: '2023-10-26T15:00:00Z', actor: 'u3' }, { status: 'IRONING', timestamp: '2023-10-26T16:00:00Z', actor: 'u3' }],
        auditLog: [{ event: 'Order Created', timestamp: '2023-10-26T14:00:00Z', userId: 'u4' }, { event: 'Order Status Change: CREATED -> ACCEPTED', timestamp: '2023-10-26T15:00:00Z', userId: 'u3' }, { event: 'Order Status Change: ACCEPTED -> IRONING', timestamp: '2023-10-26T16:00:00Z', userId: 'u3' }]
    },
];

const MOCK_RATE_CONFIG = [
    { id: 'rate1', clothType: 'shirt', pricePerItem: 5.00, minQuantity: 1 },
    { id: 'rate2', clothType: 'trousers', pricePerItem: 6.00, minQuantity: 1 },
    { id: 'rate3', clothType: 'dress', pricePerItem: 10.00, minQuantity: 1 },
    { id: 'rate4', clothType: 'saree', pricePerItem: 20.00, minQuantity: 1 },
];

const MOCK_ACTIVITIES = [
    { id: 'a1', userId: 'u2', action: 'Order Placed (o1)', status: 'info', timestamp: '2023-10-26T10:00:00Z' },
    { id: 'a2', userId: 'u3', action: 'Order Accepted (o2)', status: 'success', timestamp: '2023-10-25T15:00:00Z' },
    { id: 'a3', userId: 'u3', action: 'Order Completed (o5)', status: 'success', timestamp: '2023-10-22T16:00:00Z' },
    { id: 'a4', userId: 'u1', action: 'New Partner Setup (p3)', status: 'info', timestamp: '2023-10-20T10:00:00Z' },
    { id: 'a5', userId: 'u4', action: 'Order Ready (o4)', status: 'info', timestamp: '2023-10-23T20:00:00Z' },
    { id: 'a6', userId: 'u3', action: 'Order Ironing (o3)', status: 'warning', timestamp: '2023-10-24T12:00:00Z' },
    { id: 'a7', userId: 'u2', action: 'Delivery Scheduled (o5)', status: 'info', timestamp: '2023-10-22T15:05:00Z' },
    { id: 'a8', userId: 'u1', action: 'Pricing Updated for shirts', status: 'info', timestamp: '2023-10-21T09:00:00Z' },
];

// --- RBAC Configuration ---
const ROLES = {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    SERVICE_PROVIDER: 'SERVICE_PROVIDER',
};

// --- Status Mapping for UI ---
const STATUS_MAP = {
    CREATED: { label: 'Created', className: 'created', order: 1 },
    ACCEPTED: { label: 'Accepted', className: 'accepted', order: 2 },
    IRONING: { label: 'Ironing', className: 'ironing', order: 3 },
    READY: { label: 'Ready for Pickup/Delivery', className: 'ready', order: 4 },
    DELIVERED: { label: 'Delivered', className: 'delivered', order: 5 },
    CUSTOMER_PICKED: { label: 'Customer Picked Up', className: 'customer-picked', order: 5 },
    REJECTED: { label: 'Rejected', className: 'rejected', order: 0 },
    ACTIVE: { label: 'Active', className: 'accepted', order: 1 },
    INACTIVE: { label: 'Inactive', className: 'rejected', order: 0 },
    PENDING: { label: 'Pending Approval', className: 'pending', order: 0 },
};

const DELIVERY_OPTIONS = {
    DOORSTEP: 'Doorstep Delivery',
    CUSTOMER_PICKUP: 'Customer Pickup',
};

// --- Main Application Component ---
function App() {
    const [view, setView] = useState({ screen: 'LOGIN', params: {} });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [orders, setOrders] = useState(MOCK_ORDERS); // Mutable state for updates
    const [partners, setPartners] = useState(MOCK_PARTNERS);
    const [rateConfig, setRateConfig] = useState(MOCK_RATE_CONFIG);
    const [activities, setActivities] = useState(MOCK_ACTIVITIES);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showGlobalSearch, setShowGlobalSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const navigate = (screen, params = {}) => {
        setView({ screen, params });
        setShowGlobalSearch(false); // Hide search on navigation
    };

    const login = (username, password) => {
        const user = MOCK_USERS.find(u => u.username === username && u.password === password);
        if (user) {
            setIsLoggedIn(true);
            setUserRole(user.role);
            setCurrentUser(user);
            navigate('DASHBOARD');
            addNotification(`Welcome, ${user.name}!`, 'success');
        } else {
            addNotification('Invalid credentials', 'error');
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        setCurrentUser(null);
        navigate('LOGIN');
        addNotification('Logged out successfully', 'info');
    };

    const addNotification = (message, type = 'info') => {
        const newNotification = { id: Date.now(), message, type };
        setNotifications((prev) => [...prev, newNotification]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter(n => n.id !== newNotification.id));
        }, 5000); // Auto-dismiss after 5 seconds
    };

    const handleOrderAction = (orderId, actionType, navigateToDetail = true) => {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;

        const currentOrder = orders[orderIndex];
        let newStatus = currentOrder?.status;
        let auditEvent = '';

        switch (actionType) {
            case 'ACCEPT_ORDER':
                if (currentOrder?.status === 'CREATED') newStatus = 'ACCEPTED';
                auditEvent = 'Order Accepted';
                break;
            case 'MARK_IRONING':
                if (currentOrder?.status === 'ACCEPTED') newStatus = 'IRONING';
                auditEvent = 'Order Marked as Ironing';
                break;
            case 'MARK_READY':
                if (currentOrder?.status === 'IRONING') newStatus = 'READY';
                auditEvent = 'Order Marked as Ready';
                break;
            case 'MARK_DELIVERED':
                if (currentOrder?.status === 'READY' && currentOrder?.deliveryOption === 'DOORSTEP') newStatus = 'DELIVERED';
                auditEvent = 'Order Marked as Delivered';
                break;
            case 'MARK_PICKED':
                if (currentOrder?.status === 'READY' && currentOrder?.deliveryOption === 'CUSTOMER_PICKUP') newStatus = 'CUSTOMER_PICKED';
                auditEvent = 'Order Marked as Customer Picked Up';
                break;
            case 'REJECT_ORDER':
                if (currentOrder?.status === 'CREATED' || currentOrder?.status === 'ACCEPTED') newStatus = 'REJECTED';
                auditEvent = 'Order Rejected';
                break;
            default:
                addNotification('Unknown order action.', 'error');
                return;
        }

        if (newStatus === currentOrder?.status) {
            addNotification(`Order ${orderId} is already in ${STATUS_MAP[currentOrder?.status]?.label} state.`, 'warning');
            return;
        }

        const updatedOrder = {
            ...currentOrder,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            timeline: [...(currentOrder?.timeline || []), { status: newStatus, timestamp: new Date().toISOString(), actor: currentUser?.id }],
            auditLog: [...(currentOrder?.auditLog || []), { event: `Order Status Change: ${currentOrder?.status} -> ${newStatus}`, timestamp: new Date().toISOString(), userId: currentUser?.id }],
        };

        setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
        );
        addNotification(`Order ${orderId} status updated to ${STATUS_MAP[newStatus]?.label}!`, 'success');
        if (navigateToDetail) {
            navigate('ORDER_DETAIL', { id: orderId });
        }
    };

    const handleFormSubmit = (formType, data) => {
        const timestamp = new Date().toISOString();
        let newEntity;
        switch (formType) {
            case 'NEW_ORDER':
                const newOrderId = `o${orders.length + 1}`;
                newEntity = {
                    id: newOrderId,
                    customerId: currentUser?.id,
                    providerId: null, // Assigned later
                    items: data?.items,
                    deliveryOption: data?.deliveryOption,
                    status: 'CREATED',
                    createdAt: timestamp,
                    updatedAt: timestamp,
                    price: data?.items?.reduce((acc, item) => acc + (MOCK_RATE_CONFIG.find(r => r.clothType === item.type)?.pricePerItem || 0) * item.quantity, 0) || 0,
                    timeline: [{ status: 'CREATED', timestamp: timestamp, actor: currentUser?.id }],
                    auditLog: [{ event: 'Order Created', timestamp: timestamp, userId: currentUser?.id }]
                };
                setOrders((prev) => [...prev, newEntity]);
                addNotification(`Order ${newOrderId} created successfully!`, 'success');
                navigate('ORDER_DETAIL', { id: newOrderId });
                break;
            case 'PARTNER_SETUP':
                const newPartnerId = `p${partners.length + 1}`;
                newEntity = {
                    id: newPartnerId,
                    name: data?.name,
                    contact: data?.contact,
                    status: data?.status || 'ACTIVE'
                };
                setPartners((prev) => [...prev, newEntity]);
                addNotification(`Partner ${data?.name} created successfully!`, 'success');
                navigate('PARTNER_LIST');
                break;
            case 'RATE_SETUP':
                const newRateId = `rate${rateConfig.length + 1}`;
                newEntity = {
                    id: newRateId,
                    clothType: data?.clothType,
                    pricePerItem: parseFloat(data?.pricePerItem),
                    minQuantity: parseInt(data?.minQuantity)
                };
                setRateConfig((prev) => [...prev, newEntity]);
                addNotification(`Rate for ${data?.clothType} added successfully!`, 'success');
                navigate('DASHBOARD'); // Or a rates list
                break;
            case 'UPDATE_ORDER_SP':
                 const orderToUpdate = orders.find(o => o.id === data?.orderId);
                 if (!orderToUpdate) {
                    addNotification('Order not found for update.', 'error');
                    return;
                 }
                 const updatedFields = {
                    providerId: currentUser?.id,
                    status: data?.status,
                    // Additional fields to update if needed
                 };
                 setOrders(prev => prev.map(o => (o.id === data?.orderId ? { ...o, ...updatedFields } : o)));
                 addNotification(`Order ${data?.orderId} updated by Service Provider.`, 'success');
                 navigate('ORDER_DETAIL', { id: data?.orderId });
                 break;
            default:
                addNotification('Unknown form submission type.', 'error');
        }
    };

    // --- Shared UI Components ---

    const Breadcrumbs = ({ path }) => (
        <div className="breadcrumbs">
            <a href="#" onClick={() => navigate('DASHBOARD')}>Home</a>
            {path?.map((item, index) => (
                <React.Fragment key={item?.label}>
                    <span><Icon name="chevron-right" /></span>
                    {index < path.length - 1 ? (
                        <a href="#" onClick={() => navigate(item?.screen, item?.params)}>{item?.label}</a>
                    ) : (
                        <span>{item?.label}</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    const StatusBadge = ({ status }) => {
        const statusInfo = STATUS_MAP[status] || { label: status, className: 'pending' };
        return (
            <span className={`status-badge ${statusInfo?.className}`}>
                {statusInfo?.label}
            </span>
        );
    };

    const KpiCard = ({ icon, value, label, trend = '' }) => (
        <div className="card kpi-card">
            <div className="kpi-card-icon"><Icon name={icon} /></div>
            <div className="kpi-card-value">{value}</div>
            <div className="kpi-card-label">{label} {trend && <span style={{ fontSize: 'var(--font-size-xs)', marginLeft: 'var(--spacing-xs)' }}>({trend})</span>}</div>
        </div>
    );

    const ChartPlaceholder = ({ type, title, data, style = {} }) => {
        const renderChartContent = () => {
            switch (type) {
                case 'bar':
                    return (
                        <div className="chart-bar-container">
                            {data?.map((item, index) => (
                                <div key={index} className="chart-bar" style={{ height: `${item?.value}%` }}>
                                    <span className="chart-bar-label">{item?.label}</span>
                                </div>
                            ))}
                        </div>
                    );
                case 'donut':
                    const total = data?.reduce((sum, item) => sum + item?.value, 0);
                    let currentAngle = 0;
                    const segments = data?.map((item, index) => {
                        const percentage = (item?.value / total) * 100;
                        const startAngle = currentAngle;
                        currentAngle += percentage;
                        const endAngle = currentAngle;
                        const statusClass = STATUS_MAP[item?.label.toUpperCase()]?.className || 'info';
                        return `var(--status-${statusClass}) ${startAngle}% ${endAngle}%`;
                    }).join(', ');
                    return (
                        <div className="chart-donut" style={{ background: `conic-gradient(${segments})` }}>
                            {data?.length > 0 ? `${total} Total` : 'No Data'}
                        </div>
                    );
                case 'gauge':
                    const value = data?.[0]?.value || 0; // Assuming single value for gauge
                    return (
                        <div className="chart-gauge" style={{ '--gauge-value': `${value}%` }}>
                            <span className="chart-gauge-value">{value}%</span>
                        </div>
                    );
                case 'line':
                default:
                    // Simple line chart placeholder
                    return (
                        <svg width="100%" height="150" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ borderBottom: '1px solid var(--color-border-light)', paddingTop: 'var(--spacing-md)' }}>
                            <polyline
                                fill="none"
                                stroke="var(--color-accent)"
                                strokeWidth="2"
                                points="0,80 10,60 20,70 30,50 40,65 50,40 60,55 70,30 80,45 90,20 100,35"
                            />
                        </svg>
                    );
            }
        };

        return (
            <div className="card chart-container" style={style}>
                <h3 style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>{title}</h3>
                {renderChartContent()}
            </div>
        );
    };

    const ActivityCard = ({ activity }) => (
        <div className="activity-card">
            <div className="activity-icon"><Icon name="activity" /></div>
            <div className="activity-details">
                <p>{activity?.action}</p>
                <span className="activity-timestamp">{new Date(activity?.timestamp || '').toLocaleString()}</span>
            </div>
            <StatusBadge status={activity?.status} />
        </div>
    );

    const FormSectionAccordion = ({ title, children, isOpen, onToggle }) => (
        <div className="form-section-accordion">
            <div className="accordion-header" onClick={onToggle}>
                {title}
                <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} />
            </div>
            {isOpen && (
                <div className="accordion-content">
                    {children}
                </div>
            )}
        </div>
    );

    // --- Screen Components ---

    const LoginScreen = () => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            login(username, password);
        };

        return (
            <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="form-container" style={{ maxWidth: '400px', width: '100%', padding: 'var(--spacing-xl)' }}>
                    <h2>Login to IronEclipse</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                className="input-field"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="button">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const DashboardScreen = () => {
        // Filter data based on userRole
        const userOrders = orders?.filter(o => o.customerId === currentUser?.id);
        const providerOrders = orders?.filter(o => o.providerId === currentUser?.id || o.status === 'CREATED'); // SP can see new orders
        const adminOrders = orders;

        const renderCustomerDashboard = () => (
            <>
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Customer Dashboard</h2>
                <div className="grid-container" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <KpiCard icon="placed" value={userOrders?.length} label="Orders Placed" />
                    <KpiCard icon="ready" value={userOrders?.filter(o => o.status === 'READY' || o.status === 'DELIVERED' || o.status === 'CUSTOMER_PICKED').length} label="Orders Ready" />
                </div>
                <div className="grid-container" style={{ gridTemplateColumns: '1fr', marginBottom: 'var(--spacing-lg)' }}>
                     <ChartPlaceholder
                        type="donut"
                        title="Order Status Breakdown"
                        data={[
                            { label: 'CREATED', value: userOrders?.filter(o => o.status === 'CREATED').length },
                            { label: 'ACCEPTED', value: userOrders?.filter(o => o.status === 'ACCEPTED').length },
                            { label: 'IRONING', value: userOrders?.filter(o => o.status === 'IRONING').length },
                            { label: 'READY', value: userOrders?.filter(o => o.status === 'READY').length },
                            { label: 'DELIVERED', value: userOrders?.filter(o => o.status === 'DELIVERED' || o.status === 'CUSTOMER_PICKED').length },
                        ]}
                    />
                </div>

                <h3>Recent Activities</h3>
                <div className="card" style={{ padding: '0', cursor: 'default' }}>
                    {activities?.filter(a => a?.userId === currentUser?.id || a?.action.includes(currentUser?.name))?.slice(0, 5)?.map(activity => (
                        <ActivityCard key={activity?.id} activity={activity} />
                    ))}
                </div>
            </>
        );

        const renderServiceProviderDashboard = () => {
            const received = providerOrders?.length;
            const inProgress = providerOrders?.filter(o => o.status === 'ACCEPTED' || o.status === 'IRONING').length;
            const completed = providerOrders?.filter(o => o.status === 'READY' || o.status === 'DELIVERED' || o.status === 'CUSTOMER_PICKED').length;
            const deliveriesScheduled = providerOrders?.filter(o => o.status === 'READY' && o.deliveryOption === 'DOORSTEP').length;

            const ordersByStatusData = [
                { label: 'CREATED', value: providerOrders?.filter(o => o.status === 'CREATED').length },
                { label: 'ACCEPTED', value: providerOrders?.filter(o => o.status === 'ACCEPTED').length },
                { label: 'IRONING', value: providerOrders?.filter(o => o.status === 'IRONING').length },
                { label: 'READY', value: providerOrders?.filter(o => o.status === 'READY').length },
                { label: 'COMPLETED', value: providerOrders?.filter(o => o.status === 'DELIVERED' || o.status === 'CUSTOMER_PICKED').length },
            ];

            const deliveryVsPickupData = [
                { label: 'DOORSTEP', value: providerOrders?.filter(o => o.deliveryOption === 'DOORSTEP').length },
                { label: 'PICKUP', value: providerOrders?.filter(o => o.deliveryOption === 'CUSTOMER_PICKUP').length },
            ];

            return (
                <>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Service Provider Dashboard</h2>
                    <div className="grid-container" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <KpiCard icon="orders" value={received} label="Orders Received" />
                        <KpiCard icon="ironing" value={inProgress} label="Orders In Progress" />
                        <KpiCard icon="ready" value={completed} label="Orders Completed" />
                        <KpiCard icon="delivery" value={deliveriesScheduled} label="Deliveries Scheduled" />
                    </div>

                    <div className="grid-container" style={{ marginBottom: 'var(--spacing-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        <ChartPlaceholder type="bar" title="Orders by Status" data={ordersByStatusData} />
                        <ChartPlaceholder type="donut" title="Delivery vs Pickup" data={deliveryVsPickupData} />
                    </div>

                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Task Queue</h3>
                    <div className="card" style={{ padding: '0', cursor: 'default' }}>
                        {providerOrders?.filter(o => o.status === 'CREATED' || o.status === 'ACCEPTED' || o.status === 'IRONING')
                            .sort((a, b) => STATUS_MAP[a?.status]?.order - STATUS_MAP[b?.status]?.order)
                            .map(order => (
                                <div key={order?.id} className="task-queue-item" onClick={() => navigate('ORDER_DETAIL', { id: order?.id })}>
                                    <div className="task-queue-item-details">
                                        <div className="task-queue-item-title">Order #{order?.id} ({STATUS_MAP[order?.status]?.label})</div>
                                        <div className="task-queue-item-meta">Customer: {MOCK_USERS.find(u => u.id === order?.customerId)?.name}</div>
                                    </div>
                                    <div className="task-queue-item-actions">
                                        <button className="button" style={{ marginRight: 'var(--spacing-sm)' }} onClick={(e) => { e.stopPropagation(); handleOrderAction(order?.id, 'ACCEPT_ORDER', false); }}>Accept</button>
                                        <button className="button" onClick={(e) => { e.stopPropagation(); handleOrderAction(order?.id, 'MARK_READY', false); }}>Ready</button>
                                    </div>
                                </div>
                            ))}
                        {providerOrders?.filter(o => o.status === 'CREATED' || o.status === 'ACCEPTED' || o.status === 'IRONING').length === 0 && (
                            <div style={{ textAlign: 'center', padding: 'var(--spacing-md)', color: 'var(--color-secondary)' }}>No tasks in queue.</div>
                        )}
                    </div>
                </>
            );
        };

        const renderAdminDashboard = () => {
            const totalOrders = adminOrders?.length;
            const totalRevenue = adminOrders?.filter(o => o.status === 'DELIVERED' || o.status === 'CUSTOMER_PICKED')?.reduce((sum, o) => sum + (o?.price || 0), 0);
            const completedOrders = adminOrders?.filter(o => o.status === 'DELIVERED' || o.status === 'CUSTOMER_PICKED');
            const avgTurnaroundTime = completedOrders?.length > 0
                ? completedOrders.reduce((sum, o) => {
                    const created = new Date(o?.createdAt);
                    const completed = new Date(o?.updatedAt); // Assuming updatedAt reflects final completion
                    return sum + (completed.getTime() - created.getTime());
                }, 0) / completedOrders.length / (1000 * 60 * 60) // Convert to hours
                : 0;

            const deliveryVsPickupCount = [
                { label: 'DOORSTEP', value: adminOrders?.filter(o => o.deliveryOption === 'DOORSTEP').length },
                { label: 'PICKUP', value: adminOrders?.filter(o => o.deliveryOption === 'CUSTOMER_PICKUP').length },
            ];
            const revenueTrendData = [
                { label: 'Mon', value: 30 }, { label: 'Tue', value: 45 }, { label: 'Wed', value: 60 },
                { label: 'Thu', value: 35 }, { label: 'Fri', value: 70 }, { label: 'Sat', value: 50 },
                { label: 'Sun', value: 20 },
            ];

            return (
                <>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Admin Dashboard</h2>
                    <div className="grid-container" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <KpiCard icon="orders" value={totalOrders} label="Total Orders" />
                        <KpiCard icon="money" value={`$${totalRevenue?.toFixed(2)}`} label="Total Revenue" />
                        <KpiCard icon="time" value={`${avgTurnaroundTime?.toFixed(1)} hrs`} label="Avg Turnaround Time" />
                        <KpiCard icon="partners" value={partners?.length} label="Active Partners" />
                    </div>

                    <div className="grid-container" style={{ marginBottom: 'var(--spacing-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        <ChartPlaceholder type="line" title="Revenue Trend (Last 7 Days)" data={revenueTrendData} />
                        <ChartPlaceholder type="donut" title="Delivery vs Pickup" data={deliveryVsPickupCount} />
                        <ChartPlaceholder type="gauge" title="SLA Compliance" data={[{ value: 85 }]} />
                    </div>

                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Recent Activities (All)</h3>
                    <div className="card" style={{ padding: '0', cursor: 'default' }}>
                        {activities?.slice(0, 5)?.map(activity => (
                            <ActivityCard key={activity?.id} activity={activity} />
                        ))}
                    </div>
                </>
            );
        };

        return (
            <div className="main-content content-wrapper">
                {userRole === ROLES.CUSTOMER && renderCustomerDashboard()}
                {userRole === ROLES.SERVICE_PROVIDER && renderServiceProviderDashboard()}
                {userRole === ROLES.ADMIN && renderAdminDashboard()}
            </div>
        );
    };

    const OrderListScreen = () => {
        const applicableOrders = (userRole === ROLES.CUSTOMER)
            ? orders?.filter(o => o.customerId === currentUser?.id)
            : (userRole === ROLES.SERVICE_PROVIDER)
                ? orders?.filter(o => o.providerId === currentUser?.id || o.status === 'CREATED')
                : orders; // Admin sees all

        const [filteredOrders, setFilteredOrders] = useState(applicableOrders);
        const [searchTerm, setSearchTerm] = useState('');
        const [filters, setFilters] = useState({ status: '', deliveryOption: '', partnerId: '' });
        const [sortKey, setSortKey] = useState('createdAt');
        const [sortDirection, setSortDirection] = useState('desc');

        useEffect(() => {
            let tempOrders = applicableOrders;

            // Search
            if (searchTerm) {
                tempOrders = tempOrders?.filter(order =>
                    order?.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order?.items?.some(item => item?.type.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            // Filters
            if (filters.status) {
                tempOrders = tempOrders?.filter(order => order?.status === filters.status);
            }
            if (filters.deliveryOption) {
                tempOrders = tempOrders?.filter(order => order?.deliveryOption === filters.deliveryOption);
            }
            if (filters.partnerId && userRole === ROLES.ADMIN) {
                tempOrders = tempOrders?.filter(order => order?.providerId === filters.partnerId);
            }

            // Sort
            tempOrders = [...(tempOrders || [])]?.sort((a, b) => {
                let valA = a?.[sortKey];
                let valB = b?.[sortKey];

                if (sortKey === 'createdAt' || sortKey === 'updatedAt') {
                    valA = new Date(valA || '').getTime();
                    valB = new Date(valB || '').getTime();
                }

                if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
                if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });

            setFilteredOrders(tempOrders);
        }, [searchTerm, filters, sortKey, sortDirection, applicableOrders, userRole]);

        const handleSort = (key) => {
            if (sortKey === key) {
                setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            } else {
                setSortKey(key);
                setSortDirection('asc');
            }
        };

        return (
            <div className="main-content content-wrapper">
                <Breadcrumbs path={[{ label: 'Orders', screen: 'ORDER_LIST' }]} />
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Order List</h2>

                <div className="flex-group" style={{ marginBottom: 'var(--spacing-md)', justifyContent: 'space-between' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flexGrow: 1, maxWidth: '300px' }}
                    />
                    <div className="flex-group">
                        <select className="select-field" value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
                            <option value="">All Statuses</option>
                            {Object.keys(STATUS_MAP).filter(s => s !== 'ACTIVE' && s !== 'INACTIVE' && s !== 'PENDING').map(s => (
                                <option key={s} value={s}>{STATUS_MAP[s]?.label}</option>
                            ))}
                        </select>
                        <select className="select-field" value={filters.deliveryOption} onChange={(e) => setFilters(prev => ({ ...prev, deliveryOption: e.target.value }))}>
                            <option value="">All Delivery Options</option>
                            {Object.keys(DELIVERY_OPTIONS).map(d => (
                                <option key={d} value={d}>{DELIVERY_OPTIONS[d]}</option>
                            ))}
                        </select>
                        {userRole === ROLES.ADMIN && (
                            <select className="select-field" value={filters.partnerId} onChange={(e) => setFilters(prev => ({ ...prev, partnerId: e.target.value }))}>
                                <option value="">All Partners</option>
                                {partners?.map(p => (
                                    <option key={p?.id} value={p?.id}>{p?.name}</option>
                                ))}
                            </select>
                        )}
                        <button className="button" onClick={() => navigate('ORDER_FORM')}>
                            <Icon name="add" style={{ marginRight: 'var(--spacing-xs)' }} /> New Order
                        </button>
                    </div>
                </div>

                <div className="grid-container">
                    {filteredOrders?.length > 0 ? (
                        filteredOrders?.map(order => (
                            <div key={order?.id} className="card" onClick={() => navigate('ORDER_DETAIL', { id: order?.id })}>
                                <div className="card-title">Order #{order?.id}</div>
                                <div className="card-content">
                                    <p>Customer: {MOCK_USERS.find(u => u.id === order?.customerId)?.name}</p>
                                    <p>Provider: {MOCK_PARTNERS.find(p => p.id === order?.providerId)?.name || 'N/A'}</p>
                                    <p>Items: {order?.items?.map(item => `${item?.quantity} ${item?.type}`).join(', ')}</p>
                                    <p>Delivery: {DELIVERY_OPTIONS[order?.deliveryOption]}</p>
                                    <StatusBadge status={order?.status} />
                                </div>
                                <div style={{ position: 'absolute', top: 'var(--spacing-md)', right: 'var(--spacing-md)' }}>
                                    <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>${order?.price?.toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-xl)', cursor: 'default' }}>
                            <h3 style={{ color: 'var(--color-secondary)' }}>No Orders Found</h3>
                            <p style={{ marginBottom: 'var(--spacing-md)' }}>Try adjusting your filters or search terms.</p>
                            {userRole === ROLES.CUSTOMER && (
                                <button className="button" onClick={() => navigate('ORDER_FORM')}>
                                    <Icon name="add" style={{ marginRight: 'var(--spacing-xs)' }} /> Place a New Order
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const OrderDetailScreen = () => {
        const orderId = view?.params?.id;
        const order = orders?.find(o => o.id === orderId);

        if (!order) {
            return (
                <div className="main-content content-wrapper">
                    <p>Order not found.</p>
                    <button className="button" onClick={() => navigate('ORDER_LIST')}>Back to Orders</button>
                </div>
            );
        }

        const customer = MOCK_USERS.find(u => u.id === order?.customerId);
        const provider = MOCK_PARTNERS.find(p => p.id === order?.providerId);

        const currentStatusOrder = STATUS_MAP[order?.status]?.order;

        const workflowMilestones = [
            { status: 'CREATED', label: 'Order Created', icon: 'placed' },
            { status: 'ACCEPTED', label: 'Order Accepted', icon: 'accepted' },
            { status: 'IRONING', label: 'In Ironing', icon: 'ironing' },
            { status: 'READY', label: 'Ready', icon: 'ready' },
            { status: 'DELIVERED', label: 'Delivered', icon: 'delivered' },
            { status: 'CUSTOMER_PICKED', label: 'Customer Picked Up', icon: 'pickup' },
        ];

        // Determine available actions based on role and status
        const getAvailableActions = () => {
            const actions = [];
            const isCustomer = userRole === ROLES.CUSTOMER && currentUser?.id === order?.customerId;
            const isProvider = userRole === ROLES.SERVICE_PROVIDER && (currentUser?.id === provider?.id || order?.providerId === null);
            const isAdmin = userRole === ROLES.ADMIN;

            if (isCustomer) {
                // Customer might cancel if CREATED
                if (order?.status === 'CREATED') {
                    actions.push({ label: 'Cancel Order', action: 'REJECT_ORDER', className: 'danger' });
                }
            }
            if (isProvider || isAdmin) {
                if (order?.status === 'CREATED') {
                    actions.push({ label: 'Accept Order', action: 'ACCEPT_ORDER', className: '' });
                    actions.push({ label: 'Reject Order', action: 'REJECT_ORDER', className: 'danger' });
                } else if (order?.status === 'ACCEPTED') {
                    actions.push({ label: 'Mark as Ironing', action: 'MARK_IRONING', className: '' });
                } else if (order?.status === 'IRONING') {
                    actions.push({ label: 'Mark as Ready', action: 'MARK_READY', className: '' });
                } else if (order?.status === 'READY') {
                    if (order?.deliveryOption === 'DOORSTEP') {
                        actions.push({ label: 'Mark as Delivered', action: 'MARK_DELIVERED', className: '' });
                    } else if (order?.deliveryOption === 'CUSTOMER_PICKUP') {
                        actions.push({ label: 'Mark as Picked Up', action: 'MARK_PICKED', className: '' });
                    }
                }
            }
            return actions;
        };

        const actions = getAvailableActions();

        return (
            <div className="main-content content-wrapper">
                <Breadcrumbs path={[{ label: 'Orders', screen: 'ORDER_LIST' }, { label: `Order #${order?.id}`, screen: 'ORDER_DETAIL', params: { id: order?.id } }]} />
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Order Details #{order?.id}</h2>

                <div className="detail-page-layout">
                    {/* Left Column: Order Info, Items, Price, Delivery */}
                    <div className="flex-col">
                        <div className="card" style={{ marginBottom: 'var(--spacing-lg)', cursor: 'default' }}>
                            <h3 className="detail-section-title">Order Information</h3>
                            <div className="detail-info-item"><strong>Customer:</strong> {customer?.name}</div>
                            <div className="detail-info-item"><strong>Service Provider:</strong> {provider?.name || 'Unassigned'}</div>
                            <div className="detail-info-item"><strong>Created On:</strong> {new Date(order?.createdAt || '').toLocaleString()}</div>
                            <div className="detail-info-item"><strong>Last Updated:</strong> {new Date(order?.updatedAt || '').toLocaleString()}</div>
                            <div className="detail-info-item"><strong>Total Price:</strong> ${order?.price?.toFixed(2)}</div>
                            <div className="detail-info-item"><strong>Delivery Option:</strong> {DELIVERY_OPTIONS[order?.deliveryOption]}</div>
                            <div className="detail-info-item"><strong>Current Status:</strong> <StatusBadge status={order?.status} /></div>
                        </div>

                        <div className="card" style={{ marginBottom: 'var(--spacing-lg)', cursor: 'default' }}>
                            <h3 className="detail-section-title">Order Items</h3>
                            <ul>
                                {order?.items?.map((item, index) => (
                                    <li key={index} style={{ marginBottom: 'var(--spacing-sm)' }}>
                                        {item?.quantity} x {item?.type} {item?.specialInstruction && `(${item?.specialInstruction})`}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {userRole === ROLES.ADMIN && (
                            <div className="card" style={{ marginBottom: 'var(--spacing-lg)', cursor: 'default' }}>
                                <h3 className="detail-section-title">Audit Log</h3>
                                {order?.auditLog?.length > 0 ? (
                                    <ul>
                                        {order?.auditLog?.map((log, index) => (
                                            <li key={index} style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                                <strong>{new Date(log?.timestamp || '').toLocaleString()}:</strong> {log?.event} by {MOCK_USERS.find(u => u.id === log?.userId)?.name || 'System'}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (<p>No audit log entries.</p>)}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Workflow, Actions */}
                    <div>
                        <div className="card" style={{ marginBottom: 'var(--spacing-lg)', cursor: 'default' }}>
                            <h3 className="detail-section-title">Workflow Progress</h3>
                            <div className="workflow-stepper">
                                {workflowMilestones?.map(milestone => {
                                    const milestoneStatus = STATUS_MAP[milestone?.status];
                                    const completed = milestoneStatus?.order < currentStatusOrder;
                                    const active = milestoneStatus?.order === currentStatusOrder;
                                    return (
                                        <div key={milestone?.status} className={`workflow-step ${completed ? 'completed' : ''} ${active ? 'active' : ''}`}>
                                            <div className="workflow-step-title">{milestone?.label}</div>
                                            <div className="workflow-step-date">
                                                {order?.timeline?.find(t => t?.status === milestone?.status)?.timestamp
                                                    ? new Date(order?.timeline?.find(t => t?.status === milestone?.status)?.timestamp || '').toLocaleString()
                                                    : 'Pending'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="card" style={{ cursor: 'default' }}>
                            <h3 className="detail-section-title">Actions</h3>
                            <div className="flex-group" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                {actions?.length > 0 ? (
                                    actions?.map(action => (
                                        <button
                                            key={action?.action}
                                            className={`button ${action?.className}`}
                                            style={{ marginBottom: 'var(--spacing-sm)', width: '100%' }}
                                            onClick={() => handleOrderAction(order?.id, action?.action)}
                                        >
                                            {action?.label}
                                        </button>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--color-secondary)' }}>No further actions available for current status and your role.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const OrderFormScreen = () => {
        const [formData, setFormData] = useState({
            items: [{ type: '', quantity: 1, specialInstruction: '' }],
            deliveryOption: 'DOORSTEP',
        });
        const [errors, setErrors] = useState({});
        const [formSubmitted, setFormSubmitted] = useState(false);
        const [accordionOpen, setAccordionOpen] = useState({ items: true, delivery: false });

        const handleItemChange = (index, field, value) => {
            setFormData(prev => ({
                ...prev,
                items: prev?.items?.map((item, i) => (i === index ? { ...item, [field]: value } : item))
            }));
        };

        const addItem = () => {
            setFormData(prev => ({
                ...prev,
                items: [...(prev?.items || []), { type: '', quantity: 1, specialInstruction: '' }]
            }));
        };

        const removeItem = (index) => {
            setFormData(prev => ({
                ...prev,
                items: prev?.items?.filter((_, i) => i !== index)
            }));
        };

        const validateForm = () => {
            let newErrors = {};
            if (!formData?.items?.length) {
                newErrors.items = 'At least one item is required.';
            }
            formData?.items?.forEach((item, index) => {
                if (!item?.type) newErrors[`itemType${index}`] = 'Cloth type is required.';
                if (item?.quantity <= 0) newErrors[`itemQuantity${index}`] = 'Quantity must be positive.';
            });
            if (!formData?.deliveryOption) {
                newErrors.deliveryOption = 'Delivery option is required.';
            }
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (validateForm()) {
                handleFormSubmit('NEW_ORDER', formData);
                setFormSubmitted(true);
            } else {
                addNotification('Please correct the errors in the form.', 'error');
            }
        };

        if (formSubmitted) {
            return (
                <div className="main-content content-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div className="card" style={{ padding: 'var(--spacing-xl)', maxWidth: '500px' }}>
                        <Icon name="success" style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--status-complete)', marginBottom: 'var(--spacing-md)' }} />
                        <h2>Order Placed Successfully!</h2>
                        <p style={{ marginBottom: 'var(--spacing-lg)' }}>Your ironing order has been submitted. You can track its status in the "Orders" section.</p>
                        <button className="button" onClick={() => navigate('ORDER_LIST')}>View My Orders</button>
                        <button className="button secondary" style={{ marginLeft: 'var(--spacing-md)' }} onClick={() => setFormSubmitted(false)}>Place Another Order</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="main-content content-wrapper">
                <Breadcrumbs path={[{ label: 'Orders', screen: 'ORDER_LIST' }, { label: 'New Order', screen: 'ORDER_FORM' }]} />
                <div className="form-container">
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Place New Ironing Order</h2>
                    <form onSubmit={handleSubmit}>
                        <FormSectionAccordion title="Order Items" isOpen={accordionOpen.items} onToggle={() => setAccordionOpen(prev => ({ ...prev, items: !prev.items }))}>
                            {formData?.items?.map((item, index) => (
                                <div key={index} style={{ borderBottom: index < formData?.items?.length - 1 ? '1px solid var(--color-border-light)' : 'none', paddingBottom: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                                    <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Item #{index + 1}</h4>
                                    <div className="form-group">
                                        <label htmlFor={`item-type-${index}`}>Cloth Type <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                                        <input
                                            id={`item-type-${index}`}
                                            type="text"
                                            className={`input-field ${errors?.[`itemType${index}`] ? 'error' : ''}`}
                                            value={item?.type}
                                            onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                                            placeholder="e.g., Shirt, Trousers"
                                            required
                                        />
                                        {errors?.[`itemType${index}`] && <p className="validation-error">{errors?.[`itemType${index}`]}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`item-quantity-${index}`}>Quantity <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                                        <input
                                            id={`item-quantity-${index}`}
                                            type="number"
                                            className={`input-field ${errors?.[`itemQuantity${index}`] ? 'error' : ''}`}
                                            value={item?.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                            min="1"
                                            required
                                        />
                                        {errors?.[`itemQuantity${index}`] && <p className="validation-error">{errors?.[`itemQuantity${index}`]}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`item-instruction-${index}`}>Special Instructions (Optional)</label>
                                        <textarea
                                            id={`item-instruction-${index}`}
                                            className="textarea-field"
                                            value={item?.specialInstruction}
                                            onChange={(e) => handleItemChange(index, 'specialInstruction', e.target.value)}
                                            rows="2"
                                        />
                                    </div>
                                    {formData?.items?.length > 1 && (
                                        <button type="button" className="button danger" onClick={() => removeItem(index)}>Remove Item</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" className="button secondary" onClick={addItem} style={{ marginTop: 'var(--spacing-md)' }}>
                                <Icon name="add" style={{ marginRight: 'var(--spacing-xs)' }} /> Add Another Item
                            </button>
                            {errors?.items && <p className="validation-error">{errors?.items}</p>}
                        </FormSectionAccordion>

                        <FormSectionAccordion title="Delivery Options" isOpen={accordionOpen.delivery} onToggle={() => setAccordionOpen(prev => ({ ...prev, delivery: !prev.delivery }))}>
                            <div className="form-group">
                                <label>Choose Delivery Option <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="DOORSTEP"
                                            checked={formData?.deliveryOption === 'DOORSTEP'}
                                            onChange={(e) => setFormData(prev => ({ ...prev, deliveryOption: e.target.value }))}
                                            required
                                        /> Doorstep Delivery
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="CUSTOMER_PICKUP"
                                            checked={formData?.deliveryOption === 'CUSTOMER_PICKUP'}
                                            onChange={(e) => setFormData(prev => ({ ...prev, deliveryOption: e.target.value }))}
                                            required
                                        /> Customer Pickup
                                    </label>
                                </div>
                                {errors?.deliveryOption && <p className="validation-error">{errors?.deliveryOption}</p>}
                            </div>
                        </FormSectionAccordion>

                        <div className="form-actions">
                            <button type="submit" className="button">Place Order</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const PartnerListScreen = () => {
        const [filteredPartners, setFilteredPartners] = useState(partners);
        const [searchTerm, setSearchTerm] = useState('');
        const [filters, setFilters] = useState({ status: '' });

        useEffect(() => {
            let tempPartners = partners;

            if (searchTerm) {
                tempPartners = tempPartners?.filter(p =>
                    p?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p?.contact.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (filters.status) {
                tempPartners = tempPartners?.filter(p => p?.status === filters.status);
            }

            setFilteredPartners(tempPartners);
        }, [searchTerm, filters, partners]);

        return (
            <div className="main-content content-wrapper">
                <Breadcrumbs path={[{ label: 'Partners', screen: 'PARTNER_LIST' }]} />
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Service Partners</h2>

                <div className="flex-group" style={{ marginBottom: 'var(--spacing-md)', justifyContent: 'space-between' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Search partners..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flexGrow: 1, maxWidth: '300px' }}
                    />
                    <div className="flex-group">
                        <select className="select-field" value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
                            <option value="">All Statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                        <button className="button" onClick={() => navigate('PARTNER_FORM')}>
                            <Icon name="add" style={{ marginRight: 'var(--spacing-xs)' }} /> New Partner
                        </button>
                    </div>
                </div>

                <div className="grid-container">
                    {filteredPartners?.length > 0 ? (
                        filteredPartners?.map(partner => (
                            <div key={partner?.id} className="card" onClick={() => addNotification(`Viewing partner ${partner?.name}`, 'info')}>
                                <div className="card-title">{partner?.name}</div>
                                <div className="card-content">
                                    <p>Contact: {partner?.contact}</p>
                                    <StatusBadge status={partner?.status} />
                                </div>
                                {/* Quick actions could be here on hover for web / swipe for mobile */}
                            </div>
                        ))
                    ) : (
                        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-xl)', cursor: 'default' }}>
                            <h3 style={{ color: 'var(--color-secondary)' }}>No Partners Found</h3>
                            <p style={{ marginBottom: 'var(--spacing-md)' }}>Try adjusting your filters or search terms.</p>
                            <button className="button" onClick={() => navigate('PARTNER_FORM')}>
                                <Icon name="add" style={{ marginRight: 'var(--spacing-xs)' }} /> Add New Partner
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const PartnerFormScreen = () => {
        const [formData, setFormData] = useState({
            name: '',
            contact: '',
            status: 'ACTIVE'
        });
        const [errors, setErrors] = useState({});
        const [formSubmitted, setFormSubmitted] = useState(false);

        const validateForm = () => {
            let newErrors = {};
            if (!formData?.name) newErrors.name = 'Partner name is required.';
            if (!formData?.contact) newErrors.contact = 'Contact email is required.';
            else if (!/\S+@\S+\.\S+/.test(formData?.contact)) newErrors.contact = 'Invalid email format.';
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (validateForm()) {
                handleFormSubmit('PARTNER_SETUP', formData);
                setFormSubmitted(true);
            } else {
                addNotification('Please correct the errors in the form.', 'error');
            }
        };

        if (formSubmitted) {
            return (
                <div className="main-content content-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div className="card" style={{ padding: 'var(--spacing-xl)', maxWidth: '500px' }}>
                        <Icon name="success" style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--status-complete)', marginBottom: 'var(--spacing-md)' }} />
                        <h2>Partner Setup Complete!</h2>
                        <p style={{ marginBottom: 'var(--spacing-lg)' }}>The new service partner has been added to the system.</p>
                        <button className="button" onClick={() => navigate('PARTNER_LIST')}>View Partners</button>
                        <button className="button secondary" style={{ marginLeft: 'var(--spacing-md)' }} onClick={() => setFormSubmitted(false)}>Add Another Partner</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="main-content content-wrapper">
                <Breadcrumbs path={[{ label: 'Partners', screen: 'PARTNER_LIST' }, { label: 'New Partner', screen: 'PARTNER_FORM' }]} />
                <div className="form-container" style={{ maxWidth: '600px' }}>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Setup New Service Partner</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="partner-name">Partner Name <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                            <input
                                id="partner-name"
                                type="text"
                                className={`input-field ${errors?.name ? 'error' : ''}`}
                                value={formData?.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                            {errors?.name && <p className="validation-error">{errors?.name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="partner-contact">Contact Email <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                            <input
                                id="partner-contact"
                                type="email"
                                className={`input-field ${errors?.contact ? 'error' : ''}`}
                                value={formData?.contact}
                                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                                required
                            />
                            {errors?.contact && <p className="validation-error">{errors?.contact}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="partner-status">Status</label>
                            <select
                                id="partner-status"
                                className="select-field"
                                value={formData?.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                        {/* File upload for documents, not implemented with mock in this context */}
                        <div className="form-actions">
                            <button type="submit" className="button">Save Partner</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const RateSetupFormScreen = () => {
        const [formData, setFormData] = useState({
            clothType: '',
            pricePerItem: 0.00,
            minQuantity: 1
        });
        const [errors, setErrors] = useState({});
        const [formSubmitted, setFormSubmitted] = useState(false);

        const validateForm = () => {
            let newErrors = {};
            if (!formData?.clothType) newErrors.clothType = 'Cloth type is required.';
            if (formData?.pricePerItem <= 0) newErrors.pricePerItem = 'Price must be greater than zero.';
            if (formData?.minQuantity <= 0) newErrors.minQuantity = 'Minimum quantity must be positive.';
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (validateForm()) {
                handleFormSubmit('RATE_SETUP', formData);
                setFormSubmitted(true);
            } else {
                addNotification('Please correct the errors in the form.', 'error');
            }
        };

        if (formSubmitted) {
            return (
                <div className="main-content content-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div className="card" style={{ padding: 'var(--spacing-xl)', maxWidth: '500px' }}>
                        <Icon name="success" style={{ fontSize: 'var(--font-size-xxl)', color: 'var(--status-complete)', marginBottom: 'var(--spacing-md)' }} />
                        <h2>Pricing Rate Saved!</h2>
                        <p style={{ marginBottom: 'var(--spacing-lg)' }}>The new rate for {formData?.clothType} has been configured.</p>
                        <button className="button secondary" onClick={() => setFormSubmitted(false)}>Configure Another Rate</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="main-content content-wrapper">
                <Breadcrumbs path={[{ label: 'Dashboard', screen: 'DASHBOARD' }, { label: 'Rate Setup', screen: 'RATE_SETUP_FORM' }]} />
                <div className="form-container" style={{ maxWidth: '600px' }}>
                    <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Configure New Pricing Rate</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="cloth-type">Cloth Type <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                            <input
                                id="cloth-type"
                                type="text"
                                className={`input-field ${errors?.clothType ? 'error' : ''}`}
                                value={formData?.clothType}
                                onChange={(e) => setFormData(prev => ({ ...prev, clothType: e.target.value }))}
                                placeholder="e.g., Shirt, Saree, Bedsheet"
                                required
                            />
                            {errors?.clothType && <p className="validation-error">{errors?.clothType}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="price-per-item">Price Per Item ($) <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                            <input
                                id="price-per-item"
                                type="number"
                                className={`input-field ${errors?.pricePerItem ? 'error' : ''}`}
                                value={formData?.pricePerItem}
                                onChange={(e) => setFormData(prev => ({ ...prev, pricePerItem: parseFloat(e.target.value) || 0 }))}
                                step="0.01"
                                min="0.01"
                                required
                            />
                            {errors?.pricePerItem && <p className="validation-error">{errors?.pricePerItem}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="min-quantity">Minimum Quantity <span style={{ color: 'var(--status-rejected)' }}>*</span></label>
                            <input
                                id="min-quantity"
                                type="number"
                                className={`input-field ${errors?.minQuantity ? 'error' : ''}`}
                                value={formData?.minQuantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, minQuantity: parseInt(e.target.value) || 1 }))}
                                min="1"
                                required
                            />
                            {errors?.minQuantity && <p className="validation-error">{errors?.minQuantity}</p>}
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="button">Save Rate</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const GlobalSearch = () => {
        const handleSearch = (e) => {
            setSearchQuery(e.target.value);
            // In a real app, this would trigger search results
            if (e.target.value.length > 2) {
                // For demonstration, just a notification
                addNotification(`Searching for "${e.target.value}"...`, 'info');
            }
        };

        if (!showGlobalSearch) return null;

        return (
            <div className="global-search-container">
                <input
                    type="text"
                    className="global-search-input"
                    placeholder="Search anything..."
                    value={searchQuery}
                    onChange={handleSearch}
                    onBlur={() => setShowGlobalSearch(false)}
                    autoFocus
                />
            </div>
        );
    };

    return (
        <div className="app-container">
            {isLoggedIn && (
                <header className="app-header">
                    <h1>IronEclipse</h1>
                    <nav className="header-controls">
                        {userRole === ROLES.ADMIN && <button className="button secondary" onClick={() => navigate('DASHBOARD')}>Dashboard</button>}
                        {userRole === ROLES.SERVICE_PROVIDER && <button className="button secondary" onClick={() => navigate('DASHBOARD')}>Dashboard</button>}
                        {userRole === ROLES.CUSTOMER && <button className="button secondary" onClick={() => navigate('DASHBOARD')}>Dashboard</button>}

                        {(userRole === ROLES.CUSTOMER || userRole === ROLES.ADMIN || userRole === ROLES.SERVICE_PROVIDER) && (
                            <button className="button secondary" onClick={() => navigate('ORDER_LIST')}>
                                <Icon name="orders" style={{ marginRight: 'var(--spacing-xs)' }} /> Orders
                            </button>
                        )}
                        {userRole === ROLES.ADMIN && (
                            <button className="button secondary" onClick={() => navigate('PARTNER_LIST')}>
                                <Icon name="partners" style={{ marginRight: 'var(--spacing-xs)' }} /> Partners
                            </button>
                        )}
                        {userRole === ROLES.ADMIN && (
                            <button className="button secondary" onClick={() => navigate('RATE_SETUP_FORM')}>
                                <Icon name="settings" style={{ marginRight: 'var(--spacing-xs)' }} /> Rate Setup
                            </button>
                        )}
                        <button className="button secondary" onClick={() => setShowGlobalSearch(true)}>
                            <Icon name="search" />
                        </button>
                        <button className="button secondary" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                        <button className="button" onClick={logout}>
                            <Icon name="logout" style={{ marginRight: 'var(--spacing-xs)' }} /> Logout ({currentUser?.name})
                        </button>
                    </nav>
                </header>
            )}

            <GlobalSearch />

            {view?.screen === 'LOGIN' && <LoginScreen />}
            {isLoggedIn && view?.screen === 'DASHBOARD' && <DashboardScreen />}
            {isLoggedIn && view?.screen === 'ORDER_LIST' && <OrderListScreen />}
            {isLoggedIn && view?.screen === 'ORDER_DETAIL' && <OrderDetailScreen />}
            {isLoggedIn && view?.screen === 'ORDER_FORM' && userRole === ROLES.CUSTOMER && <OrderFormScreen />}
            {isLoggedIn && view?.screen === 'PARTNER_LIST' && userRole === ROLES.ADMIN && <PartnerListScreen />}
            {isLoggedIn && view?.screen === 'PARTNER_FORM' && userRole === ROLES.ADMIN && <PartnerFormScreen />}
            {isLoggedIn && view?.screen === 'RATE_SETUP_FORM' && userRole === ROLES.ADMIN && <RateSetupFormScreen />}

            <div className="notification-widget">
                {notifications?.map(notif => (
                    <div key={notif?.id} className={`toast-notification ${notif?.type}`}>
                        <Icon name={notif?.type} className="notification-icon" />
                        <span>{notif?.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
