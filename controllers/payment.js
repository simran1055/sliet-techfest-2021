
var crypto = require('crypto');

const { successAction, failAction } = require('../utills/response')

const { URLSearchParams } = require('url');
const fetch = require('node-fetch');
exports.getPaymentHashId = (req, res, next) => {



    var cryp = crypto.createHash('sha512');

    var text = process.env.MERCHANT_KEY + '|' + req.profile.userId + '|' + process.env.ENTRY_FEE + '|' + process.env.PAYMENT_PRODUCT_INFO + '|' + req.profile.name
        + '|' + req.profile.email + '|||||' + process.env.UDF5 + '||||||' + process.env.MERCHANT_SALT;
    cryp.update(text);
    var hash = cryp.digest('hex');
    req.paymentProfile.hash = hash
    next();
}




exports.processPayment = (req, res) => {
    var hash = req.paymentProfile.hash
    var key = process.env.MERCHANT_KEY;
    var salt = process.env.MERCHANT_SALT;
    var txnid = req.profile.userId;
    var amount = process.env.ENTRY_FEE;
    var productinfo = process.env.PAYMENT_PRODUCT_INFO;
    var firstname = req.profile.name;
    var email = req.profile.email;
    var udf5 = process.env.UDF5;
    var furl = "/payment/fail";
    var surl = "/payment/success";




    const encodedParams = new URLSearchParams();
    encodedParams.set('key', key);
    // encodedParams.set('command','');
    encodedParams.set('salt', salt);
    encodedParams.set('txnid', txnid);
    encodedParams.set('amount', amount);
    encodedParams.set('productinfo', productinfo);
    encodedParams.set('firstname', firstname);
    encodedParams.set('email', email);
    encodedParams.set('phone', phone);
    encodedParams.set('udf5', udf5);
    encodedParams.set('surl', surl);
    encodedParams.set('furl', furl);

    encodedParams.set('hash', hash);

    var url = 'https://test.payu.in/_payment'
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encodedParams
    };
    fetch(url, options)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.error('error:' + err));


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
    // });




}


