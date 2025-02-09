const router = require("express").Router();

const helloController = require('../../Controller/helloController');
const userController = require('../../Controller/userController');
const loginController = require('../../Controller/loginController');
const packageController = require('../../Controller/packageController');
const sendRecController = require('../../Controller/sendRecController');
const deliveryController = require('../../Controller/deliveryController');
const { verifyToken } = require('../../middlewares/authMiddleware');
router.get("/hello", helloController.hello);

router.post("/login", loginController.login);

// User Management
router.get("/getUsers", verifyToken, userController.get);
router.post("/createUser", userController.createUser);
router.put("/updateUser", verifyToken, userController.update);
router.get("/getMyInfo", verifyToken, userController.getMe);

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

exports.api_router = router;
