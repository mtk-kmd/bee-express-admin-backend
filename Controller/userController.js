const { query } = require("../src/config/pg_connection");
const jwt = require('jsonwebtoken');
const uuid = require("uuid");
const bcrypt = require('bcryptjs');
const { response } = require('../utils/response');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.get = async (req, res) => {
    const { username } = req.query;

    try {
        let user = null;

        if (username) {
            user = await prisma.user.findUnique({
                where: {
                    user_name: username,
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

exports.getMe = async (req, res) => {
    const { user_id } = req.query;

    const result = "SELECT * FROM sch_user_management.user_tbl WHERE user_id = $1";

    const rows = await query(result, [user_id]);

    delete rows[0]?.user_password;

    response(res, rows);
}

exports.createUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                user_name: username,
                user_password: hashedPassword,
                role: role,
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
    const { user_id, user_name, role, name, status } = req.body;

    const obj = {
        user_id,
        user_name,
        role,
        name,
        status,
    };

    const getUsers = await query(
        `SELECT * FROM sch_user_management.user_tbl WHERE user_id = $1`,
        [obj.user_id],
    )

    if (getUsers.length > 0) {
        // Check if the user_name already exists for a different ID
        const getQuery = await query(
            "SELECT * FROM sch_user_management.user_tbl WHERE user_name = $1 AND user_id != $2",
            [user_name, user_id],
        );

        if (getQuery.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "User name already exists for a different user",
            });
        } else {
            const updateQuery = "UPDATE sch_user_management.user_tbl SET user_name = $1, role = $2, name = $3, updated_at = $4, status = $5 WHERE user_id = $6";

            await query(
                updateQuery,
                [
                    obj.user_name,
                    obj.role,
                    obj.name,
                    new Date,
                    obj.status,
                    obj.user_id,
                ],
            );

            response(res, obj);
        }
    } else {
        return res.status(500).json({
            status: 500,
            message: "There is no user account with this id",
        })
    }
};
