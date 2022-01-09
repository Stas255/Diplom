var Storage = require('node-storage');
var qrCode = new Storage('./app/storage/qrs/qr.json');

class ArrayQR {

    constructor() {

        // It store the length of array.
        this.length = 0;

        // Object to store elements.
        this.data = {};
    }

    push(id, element, date) {
        this.data[id] = {
            element: element,
            date: date
        };
        this.length++;
        return this.data;
    }

    getElementAtIndex(index) {
        return this.data[index];
    }

    deleteAt(index) {
        for (let i = index; i < this.length - 1; i++) {
            this.data[i] = this.data[i + 1];
        }
        delete this.data[this.length - 1];
        this.length--;
        return this.data;
    }


}

var arrayQR = new ArrayQR();

exports.setResponse = (req, res) => {
    arrayQR.push(req.body.idQR, res, new Date());
};

exports.returnResponse = (req, res) => {
    let qr = arrayQR.getElementAtIndex(req.body.idQR);
    if (!qr) {
        res.send({
            message: "cannot find"
        });
    } else {
        if (Math.abs(new Date() - qr.date) < 5000000) {
            arrayQR.deleteAt(req.body.idQR);
            let result = JSON.parse(req.body.user);
            qr.element.send(result);
            res.send({
                message: "Registered"
            });
        }else{
            qr.element.send({
                error: "Timeout"
            });
            res.send({
                message: "Timeout"
            });
        }
    }
};