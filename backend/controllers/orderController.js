import Order from '../models/orderModel.js';

// Place Order
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod } = req.body;

        const newOrder = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentMethod,
            payment: false,
            date: Date.now(),
            status: 'Order Placed'
        });

        // Emit socket event for new order
        const io = req.app.get('io');
        io.emit('new_order', newOrder);

        res.json({ 
            success: true, 
            message: "Order Placed Successfully", 
            orderId: newOrder.id 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get All Orders (Admin)
const allOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            order: [['id', 'DESC']]
        });

        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get User Orders
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const orders = await Order.findAll({
            where: { userId },
            order: [['id', 'DESC']]
        });

        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Order Status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await Order.update(
            { status },
            { where: { id: orderId } }
        );

        // Get updated order
        const updatedOrder = await Order.findByPk(orderId);

        // Emit socket event for status update
        const io = req.app.get('io');
        io.emit('order_status_updated', {
            orderId,
            status,
            order: updatedOrder
        });

        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, allOrders, userOrders, updateStatus };