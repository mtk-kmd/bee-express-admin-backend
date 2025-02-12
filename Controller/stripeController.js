const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPayout = async (req, res) => {
    try {
        const { amount, userId } = req.body;

        if (!amount) {
            return res.status(400).send({ error: "Missing required fields" });
        }

        console.log(userId);
        let account;
        try {
            if (userId && userId.trim() !== "") {
                account = await stripe.accounts.retrieve(userId);
            } else {
                account = await stripe.accounts.create({
                    type: "custom",
                    country: "US",
                    business_type: "individual",
                    capabilities: {
                        transfers: { requested: true },
                    },
                    individual: {
                        first_name: req.user.user_name,
                        last_name: "last",
                        email: "johndoe@gmail.com",
                        dob: { day: 1, month: 1, year: 1990 },
                        address: {
                            line1: "123 Main Street",
                            city: "New York",
                            state: "NY",
                            postal_code: "10001",
                            country: "US",
                        },
                        ssn_last_4: "1234",
                    },
                    tos_acceptance: {
                        date: Math.floor(Date.now() / 1000),
                        ip: req.ip,
                    },
                    business_profile: {
                        url: "https://portfolio.mtktechlab.com",
                    },
                });
            }
        } catch (error) {
            if (error.type === 'StripeInvalidRequestError') {
                account = await stripe.accounts.create({
                    type: "custom",
                    country: "US",
                    business_type: "individual",
                    capabilities: {
                        transfers: { requested: true },
                    },
                    individual: {
                        first_name: req.user.user_name,
                        last_name: "last",
                        email: "johndoe@gmail.com",
                        dob: { day: 1, month: 1, year: 1990 },
                        address: {
                            line1: "123 Main Street",
                            city: "New York",
                            state: "NY",
                            postal_code: "10001",
                            country: "US",
                        },
                        ssn_last_4: "1234",
                    },
                    tos_acceptance: {
                        date: Math.floor(Date.now() / 1000),
                        ip: req.ip,
                    },
                    business_profile: {
                        url: "https://portfolio.mtktechlab.com",
                    },
                });
            } else {
                throw error;
            }
        }

        // add stripe_acc_id to User
        await prisma.user.update({
            where: {
                id: parseInt(req.user.id),
            },
            data: {
                stripe_acc_id: account.id,
            },
        });

        let existingBankAccounts = await stripe.accounts.listExternalAccounts(account.id);

        if (existingBankAccounts.data.length === 0) {
            existingBankAccounts = await stripe.accounts.createExternalAccount(account.id, {
                external_account: {
                    object: "bank_account",
                    country: "US",
                    currency: "usd",
                    account_holder_name: "John Doe",
                    account_holder_type: "individual",
                    routing_number: "110000000",
                    account_number: "000123456789",
                },
            });
        }

        const accountDetails = await stripe.accounts.retrieve(account.id);

        console.log(accountDetails);

        if (accountDetails.requirements.currently_due.length > 0) {
            return res.status(400).send({
                error: "Account is restricted. Additional information required: " + accountDetails.requirements.currentlydue.join(", "),
                stripeAccountId: accountDetails.id
            });
        }

        const transfer = await stripe.transfers.create({
            amount: amount,
            currency: 'usd',
            destination: accountDetails.id,
            description: 'Transfer for payout',
        });

        res.status(200).send({ success: true, transfer });
    } catch (error) {
        console.error("Error creating payout:", error);
        res.status(500).send({
            error: error.message,
            message: `Please contact support for assistance in RocketChat with your Stripe account id - ${req.body.userId}`,
        });
    }
};
