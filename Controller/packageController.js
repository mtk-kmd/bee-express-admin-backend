const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { response } = require('../utils/response');

exports.get = async (req, res) => {
    const { package_id, user_id } = req.query;

    try {
        if (package_id) {
            const packageData = await prisma.package.findUnique({
                where: { package_id: parseInt(package_id) },
                include: {
                    package_type: true,
                    receiver_info: true,
                    sender_info: true,
                    delivery: {
                        include: {
                            tracking: {
                                include: {
                                    courier: {
                                        select: {
                                            id: true,
                                            user_name: true,
                                            role: true,
                                            stripe_acc_id: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            user_name: true,
                            role: true,
                            stripe_acc_id: true
                        }
                    },
                },
            });

            response(res, packageData);
        } else if (user_id) {
            const packages = await prisma.package.findMany({
                where: { user_id: parseInt(user_id) },
                include: {
                    package_type: true,
                    receiver_info: true,
                    sender_info: true,
                    delivery: {
                        include: {
                            tracking: {
                                include: {
                                    courier: {
                                        select: {
                                            id: true,
                                            user_name: true,
                                            role: true,
                                            stripe_acc_id: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            user_name: true,
                            role: true,
                            stripe_acc_id: true
                        }
                    },
                },
            });
            response(res, packages);
        } else {
            const packages = await prisma.package.findMany({
                include: {
                    package_type: true,
                    receiver_info: true,
                    sender_info: true,
                    delivery: {
                        include: {
                            tracking: {
                                include: {
                                    courier: {
                                        select: {
                                            id: true,
                                            user_name: true,
                                            role: true,
                                            stripe_acc_id: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            user_name: true,
                            role: true,
                            stripe_acc_id: true
                        }
                    }
                },
            });
            response(res, packages);
        }
    } catch (error) {
        console.error('Error fetching packages:', error);
        response(res, error);
    } finally {
        await prisma.$disconnect();
    }
};

exports.getPackageType = async (req, res) => {
    const { package_type_id } = req.query;

    try {
        if (package_type_id) {
            const packageTypeData = await prisma.packageType.findUnique({
                where: { package_type_id: parseInt(package_type_id) },
            });
            response(res, packageTypeData);
        } else {
            const packageTypes = await prisma.packageType.findMany();
            response(res, packageTypes);
        }
    } catch (error) {
        console.error('Error fetching package types:', error);
        response(res, error);
    } finally {
        await prisma.$disconnect();
    }
}

exports.createPackgeType = async (req, res) => {
    const { package_type_name } = req.body;
    try {
        const packageType = await prisma.packageType.create({
            data: {
                package_type_name: package_type_name,
            },
        });
        response(res, packageType);
    } catch (error) {
        console.error('Error creating package type:', error);
        response(res, error);
    } finally {
        await prisma.$disconnect();
    }
};

exports.create = async (req, res) => {
    const {
        sender_name,
        receiver_name,
        sender_number,
        receiver_number,
        pickup_address,
        delivery_address,
        package_type_id,
        description,
        user_id,
        weight,
        length,
        height,
        width
    } = req.body;

    try {
        const package = await prisma.package.create({
            data: {
                package_type_id: parseInt(package_type_id),
                description: description,
                user_id: parseInt(user_id),
                weight: parseFloat(weight),
                length: parseFloat(length),
                height: parseFloat(height),
                width: parseFloat(width),
            },
        });

        const receiverInfo = await prisma.receiverInfo.create({
            data: {
                receiver_name: receiver_name,
                contact_number: parseInt(receiver_number),
                address: delivery_address,
                package: {
                    connect: { package_id: package.package_id },
                },
                user: {
                    connect: { id: parseInt(user_id) },
                },
            },
        });

        const senderInfo = await prisma.senderInfo.create({
            data: {
                sender_name: sender_name,
                contact_number: parseInt(sender_number),
                address: pickup_address,
                package: package.package_id,package: {
                    connect: { package_id: package.package_id },
                },
                user: {
                    connect: { id: parseInt(user_id) },
                },
            },
        });

        response(res, { package, receiverInfo, senderInfo });
    } catch (error) {
        console.error('Error creating package:', error);
        return res.status(500).json({ message: 'Error creating package' });
    } finally {
        await prisma.$disconnect();
    }
};
