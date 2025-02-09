const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { response } = require('../utils/response');
const { connect } = require('db-migrate-mysql');

exports.get = async (req, res) => {
    const { delivery_id } = req.query;
    try {
        if (delivery_id) {
            const data = await prisma.delivery.findUnique({
                where: { delivery_id: parseInt(delivery_id) }
            });
            response(res, data);
        } else {
            const data = await prisma.delivery.findMany({
                include: {
                    package: true,
                    tracking: {
                        include: {
                            courier: {
                                select: {
                                    id: true,
                                    user_name:true,
                                    role: true,
                                }
                            }
                        }
                    },
                    delivery_status_log: true
                }
            });
            response(res, data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        response(res, error);
    } finally {
        await prisma.$disconnect();
    }
}

exports.acceptDelivery = async (req, res) => {
    const {
        package_id,
        priority,
        user_id
    } = req.body;

    try {
        const tracking = await prisma.tracking.create({
            data: {
                courier_id: parseInt(user_id)
            }
        });

        const delivery = await prisma.delivery.create({
            data: {
                package: {
                    connect: {
                        package_id: parseInt(package_id)
                    }
                },
                priority: priority,
                tracking: {
                    connect: {
                        tracking_id: tracking.tracking_id
                    }
                }
            }
        });

        const deliveryStatusLog = await prisma.deliveryStatusLog.create({
            data: {
                status: 1,
                delivery: {
                    connect: {
                        delivery_id: delivery.delivery_id
                    }
                }
            }
        });

        response(res, {delivery, deliveryStatusLog, tracking});
    } catch (error) {
        console.error('Error creating delivery:', error);
        response(res.error);
    } finally {
        await prisma.$disconnect();
    }
}

exports.updateDeliveryStatus = async (req, res) => {
    const {
        status_log_id,
        status
    } = req.body;

    try {
        const deliveryStatusLog = await prisma.deliveryStatusLog.update({
            where: {
                status_log_id: parseInt(status_log_id)
            },
            data: {
                status: parseInt(status)
            }
        });
        response(res, deliveryStatusLog);
    } catch (error) {
        response(res, error);
    } finally {
        await prisma.$disconnect();
    }
}
