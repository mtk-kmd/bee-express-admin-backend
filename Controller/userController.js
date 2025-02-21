const { query } = require("../src/config/pg_connection");
const jwt = require('jsonwebtoken');
const uuid = require("uuid");
const bcrypt = require('bcryptjs');
const { response } = require('../utils/response');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.get = async (req, res) => {
    const { user_id } = req.query;

    try {
        let user = null;

        if (user_id) {
            user = await prisma.user.findUnique({
                where: {
                    id: parseInt(user_id),
                },
            });

            if (user) {
                delete user.user_password;
            }
        } else {
            user = await prisma.user.findMany();

            user = user.map((u) => {
                const { user_password, ...rest } = u;
                return rest;
            });
        }

        response(res, user);
    } catch (error) {
        console.error('Error creating user:', error);
        response(res, error);
    } finally {
        await prisma.$disconnect();
    }
};

exports.createUser = async (req, res) => {
    const { username, password, role, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                user_name: username,
                user_password: hashedPassword,
                role: role,
                email: email
            },
        });

        console.log('User created:', user);
        response(res, user);
    } catch (error) {
        console.error('Error creating user:', error);
        response(res, error);
    } finally {
        await prisma.$disconnect();
    }
};

exports.update = async (req, res) => {
    const { user_id, user_name, role, name, email, phone_number } = req.body;

    try {
        const users = await prisma.user.findMany({});
        const user = users.find((u) => u.id === parseInt(user_id));

        if(!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }

        users.map((u) => {
            if (u.user_name === user_name && u.id !== parseInt(user_id)) {
                return res.status(400).json({
                    status: 400,
                    message: "User name already exists",
                });
            }
        });

        const updateUser = await prisma.user.update({
            where: {
                id: parseInt(user_id),
            },
            data: {
                user_name: user_name,
                role: role,
                full_name: name,
                email: email,
                phone_number: phone_number
            },
        });

        response(res, updateUser);
    } catch (error) {
        console.error('Error creating user:', error);
        response(res, error);
    } finally {
        await prisma.$disconnect();
    }

};
