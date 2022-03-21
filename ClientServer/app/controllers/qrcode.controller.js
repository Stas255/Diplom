var Storage = require('node-storage');
var qrCode = new Storage('./app/storage/qrs/qr.json');

class ArrayQR {

    constructor() {
        this.data = {};
    }

    push(id, element, date) {
        this.data[id] = {
            element: element,
            date: date
        };
        return this.data;
    }

    getElementAtIndex(index) {
        return this.data[index];
    }

    deleteAt(index) {
        delete this.data[index];
    }

    update(){
        for(var id in this.data) {
            let element = this.getElementAtIndex(id);
            if (Math.abs(new Date() - element.date) > the_interval) {
                this.deleteAt(id);
            }
         }
    }

}
var arrayQR = new ArrayQR();


var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("I am doing my 5 minutes check");
  arrayQR.update();
}, the_interval);



exports.setResponse = (req, res) => {
    arrayQR.push(req.body.idQR, res, new Date());
};

exports.returnResponse = (req, res) => {
    let qr = arrayQR.getElementAtIndex(req.body.idQR);
    if (!qr) {
        res.status(403).send({
            message: "Cannot find Or Qr is old"
        });
    } else {
        if (Math.abs(new Date() - qr.date) < the_interval) {
            arrayQR.deleteAt(req.body.idQR);
            let result = JSON.parse(req.body.user);
            qr.element.send(result);
            res.send({
                message: "Registered"
            });
        }else{
            arrayQR.deleteAt(req.body.idQR);
            qr.element.status(403).send({
                message: "Timeout"
            });
            res.status(403).send({
                message: "Timeout"
            });
        }
    }
};