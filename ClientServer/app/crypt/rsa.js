var bigInt = require("big-integer");
export class Keys {
    publicKey;
    n;

    constructor(obj){
        Object.assign(this, obj)
      }

    SetKeys(publicKey, n) {
        this.publicKey = publicKey;
        this.n = n;
    }
}

export class RSA extends Keys {
    #privateKey;
    constructor(p, q) {
        super();
        this.p = p;
        this.q = q;
    }

    createKey() {
        this.n = this.p * this.q;
        var u = (this.p - 1) * (this.q - 1);
        var primeNumbers = [];
        for (var i = 11; i < 5000; i++) {
            if (this.IsPrimeNumber(i)) {
                primeNumbers.push(i);
            }
        }
        const random = Math.floor(Math.random() * primeNumbers.length);
        this.publicKey = primeNumbers[random];

        this.#privateKey = 1;
        do {
            this.#privateKey++;
        } while ((this.#privateKey * this.publicKey) % u != 1);

        console.log("Private: " + this.#privateKey + " Public: " + this.publicKey);
        var key = new Keys();
        key.SetKeys(this.publicKey, this.n);
        return key;
    }

    IsPrimeNumber(n) {
        var result = true;
        if (n > 1) {
            for (var i = 2; i < n; i++) {
                if (n % i == 0) {
                    result = false;
                    break;
                }
            }
        }
        else {
            result = false;
        }

        return result;
    }

    Encription(text, key) {
        let arr = new Array();
        var enc = text.split('');
        for (var i = 0; i < enc.length; i++) {
            var t = enc[i].charCodeAt(0);
            var bigIn1 = Number(bigInt(t).pow(key.publicKey).mod(key.n));
            arr.push(bigIn1);
        }
        console.log("Array1: " + arr.join(','));
        return arr;
    }

    Dencription(arr) {
        console.log("Array2: " + arr.join(','));
        let textC = new Array(arr.length);
        for (var i = 0; i < textC.length; i++) {
            var bigIn1 = Number(bigInt(arr[i]).pow(this.#privateKey).mod( this.n));
            textC[i] = String.fromCharCode(bigIn1);
        }
        let result = textC.join('');
        return result;
    }

}