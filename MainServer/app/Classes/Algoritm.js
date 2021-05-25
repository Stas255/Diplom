String.prototype.count = function (s1) {
	return (this.length - this.replace(new RegExp(s1, "g"), '').length) / s1.length;
}


exports.Encrypt = function(password, hash) {
	var i = 0;
	var finish = "";
	var t = 1;
	var pass2 = "";

	var password1 = password.split('');
	for (let j = 0; j < password1.length; j++) {
		t += password1[j].charCodeAt(0);
	}
	for (let j = 0; j < password1.length; j++) {
		pass2 += password1[j].charCodeAt(0) * t;
	}
	password1 = pass2.split('');
	console.log(hash);
	var hash1 = hash.split('');
	for (let j = 0; j < password.length; j++) {
		finish += hash1[i].charCodeAt(0) * password1[j];
		i++;
		if (hash1.length <= i) {
			i = 0;
		}
	}
	console.log(finish + "---2");
	var check = "";
	var max = 3;
	var res = Split(finish, max);
	console.log(res.length );
	while (res.length < 12 || res.length > 15) {
		check = res.join('');
		if (res.length < 12) {
			check = Revers(res);
		} else {
			max += 2;
		}
		console.log(" +1");
		res = Split(check, max);
	}
	console.log(res);
	res = res.join('');
	res = Split(res, max);
	console.log(res);
	var end = CreatePassword(res);
	return end;
}

function Revers(parameter) {
	var res = parameter.slice();
	for (var i = 0; i < parameter.length; i++) {
		res.push((Number.parseInt(parameter[i])+1).toString().split('').reverse().join(''));
	}
	return res.join('');
}

function Split(finish, max) {
	var d = 1;
	var result = "";
	for (let number = 0; number + d < finish.split('').length;) {
		result += finish.substring(number, number + d) + ' ';
		number += d;
		if (d >= max) {
			d = 1;
		}
		else {
			d += 2;
		}
	}
	var j = result.split(' ');
	j.pop();
	return j;
}

function CreatePassword(array) {
	var result = "";
	var check = {
		hightLeter: [],
		unicLeter: 0
	};
	var unic = ['@', '&', '%', '^', '$', '#', '@', ')', '/'];

	var find = 0;
	for (var i = 4; check.hightLeter == 0 || check.hightLeter.length < 2; i++) {
		if (array[i].toString().count(find.toString()) >=1) {
			if (check.unicLeter == 0) {
				check.unicLeter = i;
			} else {
				if (i != check.unicLeter && !check.hightLeter.includes(i))
				check.hightLeter.push(i);
			}
		}
		if (i == array.length - 3) {
			find++;
			i = 1;
		}
	}
	for (var k = 0; k < array.length; k++) {
		if (check.hightLeter.includes(k)) {
			result += Start(array[k], true);
		}
		if (k == check.unicLeter) {
			result += Start(array[k], unic);
		}
		result += Start(array[k], false);
	}
	return result;
}

function Start(text, find) {
	var result = "";
	if (typeof find === "boolean") {
		var number = text.split('').map(Number).reduce(function (a, b) { return a + b; }, 0)%26;
		result = String.fromCharCode(number + (find ? 65 : 97));
	} else {
		var number = text.split('').map(Number).reduce(function (a, b) { return a + b; }, 0) % 9;
		result = find[number];
	}
	return result;

}