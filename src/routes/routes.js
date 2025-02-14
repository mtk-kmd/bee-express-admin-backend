const router = require("express").Router();

const helloController = require('../../Controller/helloController');
const userController = require('../../Controller/userController');
const loginController = require('../../Controller/loginController');
const packageController = require('../../Controller/packageController');
const sendRecController = require('../../Controller/sendRecController');
const deliveryController = require('../../Controller/deliveryController');
const rcController = require('../../Controller/rcController');
const stripeController = require('../../Controller/stripeController');
const minioController = require('../../Controller/minioController');
const { verifyToken } = require('../../middlewares/authMiddleware');
router.get("/hello", helloController.hello);

router.post("/login", loginController.login);

// User Management
router.get("/getUsers", verifyToken, userController.get);
router.post("/createUser", userController.createUser);
router.put("/updateUser", verifyToken, userController.update);

// Package Management
router.get("/getPackages", packageController.get);
router.post("/createPackage", verifyToken, packageController.create);
router.post("/createPackageType", verifyToken, packageController.createPackgeType);

// Package Type Management
router.get("/getPackageTypes", verifyToken, packageController.getPackageType);
router.post("/createPackageType", verifyToken, packageController.createPackgeType);

// Send Rec Management
router.get("/getSender", verifyToken,sendRecController.getSender);
router.get("/getReceiver", verifyToken,sendRecController.getReceiver);

// Delivery Management
router.get("/getDelivery", deliveryController.get);
router.post("/acceptDelivery", verifyToken, deliveryController.acceptDelivery);
router.put("/updateDeliveryStatus", verifyToken, deliveryController.updateDeliveryStatus);

// RC Controller
router.post("/webhook", rcController.post);
router.post("/rc-login", verifyToken, rcController.rcLogin);

// Stripe Controller
router.post("/createStripePayout", verifyToken, stripeController.createPayout);

// Minio Controller
router.post('/upload', verifyToken, minioController.uploadFile);
router.get('/file/:fileName', verifyToken, minioController.getFile);
router.delete('/file/:fileName', verifyToken, minioController.deleteFile);

exports.api_router = router;
