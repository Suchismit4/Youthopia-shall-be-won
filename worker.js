const city = document.getElementById("city");

const json = {
    name: "Kolkata",
    temperature: 27,
    geo: {
        map: {
            Sector_XY01: {
                X_size: 900,
                Y_size: 560,
                junctions: [
                    {
                        xTop: 444,
                        yTop: 402,
                        xBottom: 462,
                        yBottom: 409,
                        ident: "junc1",
                        connecting: ["max_1", "max_2"]
                    }
                ],
                roads: [
                    {
                        xTop: 0,
                        yTop: 377,
                        xBottom: 899,
                        yBottom: 401,
                        ident: "max_1",
                        horizontal: true,
                        direction: "right",
                        dest: ["ruby", "dps"]

                    },
                    {
                        xTop: 0,
                        yTop: 410,
                        xBottom: 899,
                        yBottom: 434,
                        ident: "max_2",
                        direction: "left",
                        horizontal: true,
                        dest: ["garia", "dps"]
                    },
                    {
                        xTop: 444,
                        yTop: 138,
                        xBottom: 462,
                        yBottom: 376,
                        ident: "mini_1",
                        dest: ["ruby", "dps"],
                        horizontal: false,
                        direction: "up"
                    },
                    {
                        xTop: 446,
                        yTop: 435,
                        xBottom: 464,
                        yBottom: 559,
                        ident: "mini_2",
                        dest: ["dps", "garia"],
                        horizontal: false,
                        direction: "up"
                    },

                ],

                rt: {
                    carsLen: 0,
                    cars: []
                }
            }
        }
    }
}

class Car {

    constructor(rd_ident) {
        this.rd_ident = rd_ident;
        this.intentions = ["dps", "garia", "ruby"]
        while (true) {
            this.intention = this.intentions[Math.floor(Math.random() * this.intentions.length)];
            if (json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).dest.includes(this.intention)) {
                break;
            }
        }
        this.state = {
            isMoving: false,
        }
        this.FindRoute(rd_ident)
        this.SpawnCar(null)
        console.log(this.path)
    }

    SpawnCar(isGariaJn) {
        const roadInfo = json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident);
        this.state.isMoving = true;
        let car = document.createElement("img");
        this.car = car;
        car.setAttribute("id", `${json.geo.map.Sector_XY01.rt.carsLen}`)
        json.geo.map.Sector_XY01.rt.carsLen++;
        car.setAttribute("src", './car.png')
        let roadParent = document.getElementById(this.rd_ident);
        if (this.rd_ident.toString().includes("max")) {
            car.setAttribute("width", "25px")
            car.setAttribute("height", "25px")
        }
        if (this.rd_ident.toString().includes("min")) {
            car.setAttribute("width", "19px")
            car.setAttribute("height", "19px")
        }
        this.direction = null;

        if (!roadInfo.horizontal && roadInfo.direction == "up" && roadInfo.ident == "mini_1") {
            car.setAttribute("style", `position: absolute; top: ${226.25}px`)
            car.setAttribute("src", './car3.png')
            car.classList.add('carUp')
            this.direction = "up";
        }

        if (!roadInfo.horizontal && roadInfo.direction == "up" && roadInfo.ident == "mini_2") {
            car.setAttribute("style", `position: absolute; top: ${125}px`)
            car.setAttribute("src", './car3.png')
            car.classList.add('carUp')
            this.direction = "up";
        }

        if (roadInfo.horizontal && roadInfo.direction == "left") {
            car.setAttribute("style", `position: absolute; left: ${roadInfo.xBottom}px`)
            car.classList.add('carLeft')
            this.direction = "left";
            if(isGariaJn){
                car.setAttribute("style", `position: absolute; left: ${444}px`)
            }
        }
        if (roadInfo.horizontal && roadInfo.direction == "right") {
            car.setAttribute("style", `position: absolute; left: ${0}px`)
            car.setAttribute("src", './car2.png')
            car.classList.add('carRight')
            this.direction = "right"
        }

        roadParent.appendChild(car)

        this.car = {
            ident: json.geo.map.Sector_XY01.rt.carsLen - 1,
            lifeTime: 0,
            direction: this.direction,
        }
        this.ident = json.geo.map.Sector_XY01.rt.carsLen - 1;
        this.lifeTime = 0;

        if(isGariaJn){
            return this.MoveCar("max_2")
        }
        this.MoveCar(this.path[0])
    }

    MoveCar(curr_rd) {
        switch (curr_rd) {
            case "mini_1":
                var targetY = 1;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (Math.abs(parseInt(carElem.style.top.replace("px", ""))) <= targetY) {
                        this.DestroyCar()
                        this.path.shift()
                        if (this.path.length > 0) {
                            this.rd_ident = this.path[this.path.length - 1];
                            clearInterval(this.lifeCycle)
                            return this.SpawnCar(null)
                        } else {
                            clearInterval(this.lifeCycle)
                        }
                    }
                    car_.lifeTime += 1;
                    if (car_.direction == "up" && this.state.isMoving) {
                        carElem.style.top = (parseInt(carElem.style.top.replace("px", "")) - 5).toString() + "px";
                    }
                }, 100)
                break;
            case "mini_2":
                var targetY = 5;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (Math.abs(parseInt(carElem.style.top.replace("px", ""))) <= targetY) {
                        this.DestroyCar()
                        this.path.shift()
                        if (this.path.length > 0) {
                            this.rd_ident = this.path[this.path.length - 1];
                            clearInterval(this.lifeCycle)
                            if(this.path[this.path.length - 1] == "max_2_jn"){
                                this.rd_ident = "max_2";
                                return this.SpawnCar("max_2_jn")
                            }
                            return this.SpawnCar(null)
                        } else {
                            clearInterval(this.lifeCycle)
                        }
                    }
                    car_.lifeTime += 1;
                    if (car_.direction == "up" && this.state.isMoving) {
                        carElem.style.top = (parseInt(carElem.style.top.replace("px", "")) - 5).toString() + "px";
                    }
                }, 100)
                break;
            case "juncR":
                var targetX = 471;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) <= targetX) {
                        this.DestroyCar()
                        this.path.shift()
                        if (this.path.length > 0) {
                            this.rd_ident = this.path[this.path.length - 1];
                            clearInterval(this.lifeCycle)
                            return this.SpawnCar(null)
                        } else {
                            clearInterval(this.lifeCycle)
                        }
                    }
                    car_.lifeTime += 1;
                    if (car_.direction == "left" && this.state.isMoving) {
                        carElem.style.left = (parseInt(carElem.style.left.replace("px", "")) - 5).toString() + "px";
                    }
                }, 100)
                break;
            case "juncL":
                var targetX = 410;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) >= targetX) {
                        this.DestroyCar()
                        this.path.shift()
                        if (this.path.length > 0) {
                            this.rd_ident = this.path[this.path.length - 1];
                            clearInterval(this.lifeCycle)
                            return this.SpawnCar(null)
                        } else {
                            clearInterval(this.lifeCycle)
                            return this.SpawnCar(null)
                        }
                    }
                    car_.lifeTime += 1;
                    if (car_.direction == "right" && this.state.isMoving) {
                        carElem.style.left = (parseInt(carElem.style.left.replace("px", "")) + 5).toString() + "px";
                    }
                }, 100)
                break;
            case "max_1":
                var targetX = 900;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) >= targetX) {
                        // setTimeout()
                        this.DestroyCar()
                        this.path.shift()
                        return clearInterval(this.lifeCycle)
                    }
                    car_.lifeTime += 1;
                    if (car_.direction == "left" && this.state.isMoving) {
                        carElem.style.left = (parseInt(carElem.style.left.replace("px", "")) - 5).toString() + "px";
                    }
                    if (car_.direction == "right" && this.state.isMoving) {
                        carElem.style.left = (parseInt(carElem.style.left.replace("px", "")) + 5).toString() + "px";
                    }
                }, 100)
                break;
            case "max_2":
                var targetX = -25;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) <= targetX) {
                        this.DestroyCar()
                        this.path.shift()
                        return clearInterval(this.lifeCycle)
                    }
                    car_.lifeTime += 1;
                    if (car_.direction == "left" && this.state.isMoving) {
                        carElem.style.left = (parseInt(carElem.style.left.replace("px", "")) - 5).toString() + "px";
                    }
                    if (car_.direction == "right" && this.state.isMoving) {
                        carElem.style.left = (parseInt(carElem.style.left.replace("px", "")) + 5).toString() + "px";
                    }
                }, 100)
                break;
            default:
                break;
        }

    }

    DestroyCar() {
        try {
            document.getElementById(this.car.ident).remove()
            console.log(`Removed car#${this.car.ident}`)
        } catch {

        }
    }

    getIntention() {
        return this.intention
    }

    FindRoute(rd) {
        if (this.intention == "dps") {
            if (rd == "max_1") {
                return this.path = ["juncL", "mini_1"]
            } else if (rd == "mini_2") {
                return this.path = ["mini_2", "mini_1"]
            }
            this.path = ["juncR", "mini_1"]
        } else if (this.intention == "garia") {
            if (rd == "mini_2") {
                return this.path = ["mini_2", "max_2_jn"]
            }
            this.path = ["max_2"]
        } else if (this.intention == "ruby") {
            this.path = ["max_1"]
        }
    }
}

console.log(json.geo.map.Sector_XY01.roads)

json.geo.map.Sector_XY01.roads.forEach((rd) => {
    let roadBlock = document.createElement("div");
    roadBlock.setAttribute("style", `position: absolute; width: ${rd.horizontal == false ? Math.abs(rd.xTop - rd.xBottom) : Math.abs(rd.xTop - rd.xBottom)}px; 
                            height: ${rd.horizontal == false ? Math.abs(rd.yTop - rd.yBottom) : Math.abs(rd.yTop - rd.yBottom)}px; left: ${rd.xTop}px; top: ${rd.yTop}px;`);
    roadBlock.setAttribute("class", "road")
    roadBlock.setAttribute("id", `${rd.ident}`)
    city.appendChild(roadBlock)
    console.log("New road")
})

json.geo.map.Sector_XY01.junctions.forEach((jn) => {
    let junctionBlock = document.createElement("div");
    junctionBlock.setAttribute("style", `position: absolute; width: ${Math.abs(jn.xTop - jn.xBottom)}px; height: ${Math.abs(jn.yTop - jn.yBottom)}px; left: ${jn.xTop}px; top: ${jn.yTop}px;`);
    junctionBlock.setAttribute("class", "junction")
    junctionBlock.setAttribute("id", `${jn.ident}`)
    city.appendChild(junctionBlock)
    console.log("New Junction")

})

setInterval(() => {
    let roads = ["max_1", "max_2", "mini_2"]
    let car = new Car(roads[Math.floor(Math.random() * roads.length)])
    json.geo.map.Sector_XY01.rt.cars.push(car)

}, Math.floor((Math.random() * 3000) + 1500));
