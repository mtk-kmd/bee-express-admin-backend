const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();

// Outgoing Webhook
exports.post = async (req, res) => {
    const { text, user_name } = req.body;

    // if (user_name === "packageBot") {
    //     return res.sendStatus(200);
    // }

    const match = text.match(/track (\w+)/);
    if (match) {
        const packageId = match[1];

        try {
            const response = await axios.get(`${process.env.LOCAL_HOST}:${process.env.SERVER_PORT}/api/getPackages?package_id=${packageId}`);
            const packageInfo = response.data;

            console.log(packageInfo);

            // const reply = `Package ID: ${packageInfo.result.package_id}\npackage_type_name: ${packageInfo.result.package_type.package_type_name}`;
            const reply = packageInfo;
            return res.json({ text: reply });
        } catch (error) {
            return res.json({ text: `Error: Unable to find package with ID ${packageId}.` });
        }
    }

    return res.json({ text: "Please provide a valid package ID. Usage: `track <package_id>`" });
}

exports.rcLogin = async (req, res) => {
    const { userId, password } = req.body;
    const result = await prisma.user.findUnique({
        where: {
            id: parseInt(userId),
        },
    });

    try {
        const response = await axios.post(
            process.env.ROCKETCHAT_URL + "/api/v1/login",
            {
                username: req.user.user_name,
                password: "password",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return res.status(200).json({
            data: response.data,
        });
    } catch (e) {
        console.log(e);
        if (e.response.status === 401) {
            try {
                // Require Admin Account to create non-existing account
                const superAdminCredentials = await axios.post(
                    process.env.ROCKETCHAT_URL + "/api/v1/login",
                    {
                        username: "mtk246",
                        password: "mtkMTK123#",
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                // Register non-existing account with admin rights
                const response = await axios.post(
                    process.env.ROCKETCHAT_URL + "/api/v1/users.create",
                    {
                        name: req.user.user_name,
                        email: req.user.email,
                        password: password || "password",
                        username: req.user.user_name,
                        roles: ["user"],
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-Auth-Token": superAdminCredentials.data.data.authToken,
                            "X-User-Id": superAdminCredentials.data.data.userId,
                        },
                    }
                );

                if (response) {
                    console.log(response);
                    const loginResponse = await axios.post(
                        process.env.ROCKETCHAT_URL + "/api/v1/login",
                        {
                            username: req.user.user_name,
                            password: password || "password",
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    return res.status(200).json({
                        data: loginResponse.data,
                    });
                }
            } catch (e) {
                return res.status(400).json({
                    message: e.response.data.errorType,
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Invalid User Account",
            });
        }
    }
};

exports.createDirectMessage = async (req, res) => {
    const { targetUsername, message } = req.body;

    try {
        // First ensure the user exists in RocketChat or create them
        const superAdminCredentials = await axios.post(
            process.env.ROCKETCHAT_URL + "/api/v1/login",
            {
                username: "mtk246",
                password: "mtkMTK123#",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Check if user exists, if not create them
        try {
            await axios.post(
                `${process.env.ROCKETCHAT_URL}/api/v1/users.create`,
                {
                    name: req.user.user_name,
                    email: req.user.email,
                    password: "password",
                    username: req.user.user_name,
                    roles: ["user"],
                },
                {
                    headers: {
                        "X-Auth-Token": superAdminCredentials.data.data.authToken,
                        "X-User-Id": superAdminCredentials.data.data.userId,
                        "Content-Type": "application/json"
                    }
                }
            );
        } catch (error) {
            // User might already exist, continue
            console.log("User might already exist:", error.response?.data);
        }

        // Login as the user
        const userCredentials = await axios.post(
            process.env.ROCKETCHAT_URL + "/api/v1/login",
            {
                username: req.user.user_name,
                password: "password",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(userCredentials.data.data.authToken);
        console.log(userCredentials.data.data.userId);

        // Create DM room using user's credentials
        const response = await axios.post(
            `${process.env.ROCKETCHAT_URL}/api/v1/im.create`,
            {
                username: targetUsername
            },
            {
                headers: {
                    "X-Auth-Token": userCredentials.data.data.authToken,
                    "X-User-Id": userCredentials.data.data.userId,
                    "Content-Type": "application/json"
                }
            }
        );

        // Send message if provided
        if (message && response.data.success) {
            await axios.post(
                `${process.env.ROCKETCHAT_URL}/api/v1/chat.postMessage`,
                {
                    roomId: response.data.room._id,
                    text: message
                },
                {
                    headers: {
                        "X-Auth-Token": userCredentials.data.data.authToken,
                        "X-User-Id": userCredentials.data.data.userId,
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        return res.status(200).json({
            success: true,
            room: response.data
        });
    } catch (error) {
        console.error('Error creating DM:', error.response?.data || error);
        return res.status(400).json({
            success: false,
            message: error.response?.data?.error || 'Failed to create DM'
        });
    }
};
exports.getUnReadMessages = async (req, res) => {
    try {
        // Login as the user
        const userCredentials = await axios.post(
            process.env.ROCKETCHAT_URL + "/api/v1/login",
            {
                username: req.user.user_name,
                password: "password", // Consider storing the password securely
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // Get subscriptions (rooms and DMs)
        const subscriptions = await axios.get(
            `${process.env.ROCKETCHAT_URL}/api/v1/subscriptions.get`,
            {
                headers: {
                    "X-Auth-Token": userCredentials.data.data.authToken,
                    "X-User-Id": userCredentials.data.data.userId,
                    "Content-Type": "application/json"
                }
            }
        );

        // Filter and format the unread counts
        const unreadCounts = subscriptions.data.update
            .filter(sub => sub.unread > 0)
            .map(sub => ({
                roomId: sub._id,
                roomName: sub.name,
                type: sub.t, // 'd' for direct message, 'c' for channel
                unreadCount: sub.unread,
                lastMessage: sub.lastMessage
            }));

        return res.status(200).json({
            success: true,
            unreadMessages: unreadCounts
        });

    } catch (error) {
        console.error('Error fetching unread messages:', error.response?.data || error);
        return res.status(400).json({
            success: false,
            message: error.response?.data?.error || 'Failed to fetch unread messages'
        });
    }
};
