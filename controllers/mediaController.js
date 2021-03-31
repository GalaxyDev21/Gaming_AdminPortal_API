const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
var upload = multer({
    storage: storage
});
exports.uploadFile = async function (req, res) {
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(200).json({
                status: false,
                message: 'error occurred when uploading',
                data: ''
            });
        } else if (err) {
            console.log(err);
            return res.status(200).json({
                status: false,
                message: 'error occurred when uploading',
                data: ''
            });
        }
        return res.status(200).json({
            status: true,
            message: 'upload file successfuly.',
            data: `uploads/${req.file.filename}`
        });
    })
}