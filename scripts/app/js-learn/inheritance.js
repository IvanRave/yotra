// http://javascript.ru/tutorial/object/inheritance

// plane
function Plane() {
    this.isWork = true;
}

Plane.prototype.fly = function () {
    return "Flying";
};

var mainPlane = new Plane();

console.log(mainPlane);


// boeing
function Boeing(country) {
    this.country = country;
}

Boeing.prototype = mainPlane;

Boeing.prototype.name = "Boeing";

Boeing.prototype.flyWithHighSpeed = function () {
    return "Flying with high speed";
};

// create new boeings
var usaBoeing = new Boeing('US');
var rusBoeing = new Boeing('RU');

// print
console.log(usaBoeing.fly());
console.log(rusBoeing);

// is prototype of
console.log(mainPlane.isPrototypeOf(usaBoeing));


console.log(mainPlane.flyWithHighSpeed());