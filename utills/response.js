exports.successAction = (data, message = 'Success') => {
    return ({ statusCode: 200, data, message });
}

exports.failAction = (error = 'Fail', statusCode = 400) => {
    return ({ statusCode, data: null, error });
}