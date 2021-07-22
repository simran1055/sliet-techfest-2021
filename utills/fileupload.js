const formidable = require("formidable");
const fs = require("fs")
exports.uploadFileFunc = (file) => {

    if (file.photo.size > 3000000) {
        return ({
            error: "File size too big!"
        })
    }
    var oldPath = file.photo.path;
    var newPath1 = Date.now() + '.' + file.photo.name.split('.').pop();
    var newPath = 'uploads/' + newPath1
    var rawData = fs.readFileSync(oldPath)

    fs.writeFile(newPath, rawData, function (err) {
        if (err) {

            return ({
                error: err
            })
        }

    })
    return newPath1;
}