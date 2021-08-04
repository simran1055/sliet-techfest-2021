const express = require('express')
const { getUserById, getUser, updateUser, notify } = require("../controllers/user")
const { isAuthenticated, isSignedIn, isSuperAdmin } = require("../controllers/auth")
const { getPaymentHashId, processPayment, stripePayment, payStripeLast,paymentSuccessAction } = require('../controllers/payment')
const stripe = require('stripe')('sk_test_51ILhyyK2faB59yIQvGfqF2WwmNNjgh8EnKlpe5XrhsEuOaujLeABgt5p4VBCcXJso4s35aK3j4NMMMQDWWEduEYT00DicJ00h0');
var router = express.Router()

router.param('userId', getUserById);

router.get("/payment/:userId", isSignedIn, isAuthenticated, getPaymentHashId, processPayment);

router.post('/payment/fail', (req, res) => {

    res.send(req.body);
})
router.post('/payment/success', (req, res) => {

    res.send(req.body);
})

router.use('/payment', stripePayment)

router.post('/create-checkout-session', payStripeLast);

router.get('/success', paymentSuccessAction)
module.exports = router;