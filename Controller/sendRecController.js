const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { response } = require('../utils/response');

exports.getSender = async (req, res) => {
    const { sender_id } = req.query;
    try {
        if (sender_id) {
            const data = await prisma.senderInfo.findUnique({
                where: { sender_id: parseInt(sender_id) }
            });
            response(res, data);
        } else {
            const data = await prisma.senderInfo.findMany();
            response(res, data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        response(res, error);
    } finally {
        await prisma.$disconnect();
    }
};

exports.getReceiver = async (req, res) => {
    const { receiver_id } = req.query;
    try {
        if (receiver_id) {
            const data = await prisma.receiverInfo.findUnique({
                where: { sender_id: parseInt(receiver_id) }
            });
            response(res, data);
        } else {
            const data = await prisma.receiverInfo.findMany();
            response(res, data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        response(res, error);
    } finally {
        await prisma.$disconnect();
    }
};
