
var crypto = require('crypto');
// TODO add Stripe key
const stripe = require('stripe')(process.env.PAYMENT_KEY)
const uuid = require('uuid');

const request = require('request');
const { successAction, failAction } = require('../utills/response')

exports.getPaymentHashId = (req, res, next) => {
    var cryp = crypto.createHash('sha512');
    var txnid = Date.now();
    var text = process.env.MERCHANT_KEY + '|' + txnid + '|' + process.env.ENTRY_FEE + '|' + process.env.PAYMENT_PRODUCT_INFO + '|' + req.profile.name
        + '|' + req.profile.email + '|||||' + process.env.UDF5 + '||||||' + process.env.MERCHANT_SALT;
    cryp.update(text);
    var hash = cryp.digest('hex');
    req.paymentProfile = { hash, txnid }
    // console.log(text)
    // console.log(hash)
    next();
}

exports.processPayment = (req, res) => {
    var hash = req.paymentProfile.hash
    var key = process.env.MERCHANT_KEY;
    // var salt = process.env.MERCHANT_SALT;
    var txnid = req.paymentProfile.txnid;
    var amount = process.env.ENTRY_FEE;
    var productinfo = process.env.PAYMENT_PRODUCT_INFO;
    var firstname = req.profile.name;
    var email = req.profile.email;
    var phone = req.profile.phone;
    var udf5 = process.env.UDF5;
    var furl = "/payment/fail";
    var surl = "/payment/success";


    const pay = {
        hash, key, txnid, amount, productinfo, firstname, email, phone, udf5, furl, surl
    }

    // const encodedParams = new URLSearchParams();
    // encodedParams.set('key', key);
    // // encodedParams.set('command','');
    // encodedParams.set('salt', salt);
    // encodedParams.set('txnid', txnid);
    // encodedParams.set('amount', amount);
    // encodedParams.set('productinfo', productinfo);
    // encodedParams.set('firstname', firstname);
    // encodedParams.set('email', email);
    // encodedParams.set('phone', phone);
    // encodedParams.set('udf5', udf5);
    // encodedParams.set('surl', surl);
    // encodedParams.set('furl', furl);

    // encodedParams.set('hash', hash);

    // var url = 'https://test.payu.in/_payment'
    // const options = {
    //     method: 'POST',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: encodedParams
    // };
    // // fetch(url, options)
    // //     .then(res => res.text())
    // //     .then(txt => console.log(txt))
    // //     .catch(err => console.error('error:' + err));


    // request.post({
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     url: 'https://sandboxsecure.payu.in/_payment', //Testing url
    //     form: pay
    // }, function (error, httpRes, body) {
    //     if (error)
    //         res.send(
    //             {
    //                 status: false,
    //                 message: error.toString()
    //             }
    //         );
    //     if (httpRes.statusCode === 200) {
    //         res.send(body);
    //     } else if (httpRes.statusCode >= 300 &&
    //         httpRes.statusCode <= 400) {
    //         res.redirect(httpRes.headers.location.toString());
    //     }
    // })



    return res.json(pay);

}



exports.stripePayment = (req, res) => {


    const { product, token } = req.body;
    console.log("PRODUCT ", product);
    console.log("PRICE ", product.price);
    const idempotencyKey = uuid.v4();

    stripe.customers.create({
        email:  token.email,
        source: token.id,
        name: 'Gourav Hammad',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    })
    .then((customer) => {
  
        return stripe.charges.create({
            amount: 500,     // Charing Rs 25
            description: 'Web Development Product',
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        console.log(charge);
        res.send("Success")  // If no error occurs
    })
    .catch((err) => {
        res.send(err)       // If some error occurs
    });

    // const { product, token } = req.body;
    // console.log("payment", product);
    // const idempontencyKey = uuid.v4();

    // return stripe.customers.create({
    //     email: token.email,
    //     source: token.id
    // }).then(customer => {
    //     console.log('<<<',customer);
    //     stripe.charges.create({
    //         amount: product.price * 100,
    //         currency: 'INR',
    //         customer: customer.id,
    //         receipt_email: token.email,
    //         description: "Event"
    //     }, { idempontencyKey })
    // }).then(result => {
    //     console.log('>>>',result);
    //     res.status(200).json(result)
    // })
    //     .catch(err => console.log(err))
}