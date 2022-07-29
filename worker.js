const city = document.getElementById("city");

function insertAt(array, index, ...elementsArray) {
    array.splice(index, 0, ...elementsArray);
}

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
                        dest: ["ruby", "dps"],
                        stop: 410,
                        queue: []
                    },
                    {
                        xTop: 0,
                        yTop: 410,
                        xBottom: 899,
                        yBottom: 434,
                        ident: "max_2",
                        direction: "left",
                        horizontal: true,
                        dest: ["garia", "dps"],
                        stop: 470,
                        carAtJn: null,
                        jnGrbC: 0,
                        queue: []
                    },
                    {
                        xTop: 444,
                        yTop: 138,
                        xBottom: 462,
                        yBottom: 376,
                        ident: "mini_1",
                        stop: 1,
                        dest: ["ruby", "dps"],
                        horizontal: false,
                        direction: "up",
                        queue: [],
                    },
                    {
                        xTop: 446,
                        yTop: 435,
                        xBottom: 464,
                        yBottom: 559,
                        ident: "mini_2",
                        dest: ["dps", "garia"],
                        stop: 5,
                        horizontal: false,
                        direction: "up",
                        queue: []
                    },

                ],
                streetLights: [
                    {
                        link: "max_1",
                        x: 461,
                        y: 390,
                        state: 0,
                    },
                    {
                        link: "max_2",
                        x: 426,
                        y: 402,
                        state: 0,
                    },
                    {
                        link: "mini_2",
                        x: 438,
                        y: 435,
                        state: 0,
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
        this.hasToStop = false;
        this.FindRoute(rd_ident)
        this.SpawnCar(null)
        // console.log(this.path)
    }

    SpawnCar(isGariaJn) {
        const roadInfo = json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident);
        this.currRd = this.rd_ident
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
        this.speed = (Math.random() * (10 - 4.5) + 4.5)
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

            json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.push({ ident: car.getAttribute("id"), direct: this.direction, speed: this.speed, pos: { x: null, y: 226.25 } })
        }

        if (!roadInfo.horizontal && roadInfo.direction == "up" && roadInfo.ident == "mini_2") {
            car.setAttribute("style", `position: absolute; top: ${125}px`)
            car.setAttribute("src", './car3.png')
            car.classList.add('carUp')
            this.direction = "up";
            json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.push({ ident: car.getAttribute("id"), direct: this.direction, speed: this.speed, pos: { x: null, y: 125 } })

        }

        if (roadInfo.horizontal && roadInfo.direction == "left") {
            car.setAttribute("style", `position: absolute; left: ${roadInfo.xBottom}px`)
            car.classList.add('carLeft')
            this.direction = "left";
            if (isGariaJn) {
                car.setAttribute("style", `position: absolute; left: ${444}px`)
                car.setAttribute("id", `${car.getAttribute('id')}-mini`)
                if (json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).carAtJn != null) {
                    insertAt(json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue, json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident.replace("-mini", "") === json.geo.map.Sector_XY01.roads.find(rd => rd.ident == "max_2").carAtJn)-1, { ident: car.getAttribute("id"), speed: this.speed, direct: this.direction, pos: { x: 444, y: null } })
                } else {
                    insertAt(json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue, json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.length, { ident: car.getAttribute("id"), direct: this.direction, speed: this.speed, pos: { x: 444, y: null } })
                }
            } else {
                json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.push({ ident: car.getAttribute("id"), direct: this.direction, peed: this.speed, pos: { x: roadInfo.xBottom, y: null }, waypoints: this.path })
            }
        }
        if (roadInfo.horizontal && roadInfo.direction == "right") {
            car.setAttribute("style", `position: absolute; left: ${0}px`)
            car.setAttribute("src", './car2.png')
            car.classList.add('carRight')
            this.direction = "right"
            json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.push({ ident: car.getAttribute("id"), direct: this.direction, speed: this.speed, pos: { x: 0, y: null } })

        }
        roadParent.appendChild(car)
        var carElement = this.car;
        this.car = {
            ident: carElement.getAttribute("id"),
            lifeTime: 0,
            direction: this.direction,
        }
        this.ident = carElement.getAttribute("id");
        this.lifeTime = 0;
        if (isGariaJn) {
            return this.MoveCar("max_2")
        }
        this.MoveCar(this.path[0])
    }

    MoveCar(curr_rd) {
        switch (curr_rd) {
            case "mini_1":
                this.currRd = curr_rd;
                var targetY = 1;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (this.CheckCollide("y")) return;

                    if (this.hasToStop) {
                        if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) >= json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).stop) {
                            return this.Stop();
                        }
                    } else {
                        this.Start();
                    }

                    if (Math.abs(parseInt(carElem.style.top.replace("px", ""))) <= targetY || parseInt(carElem.style.top.replace("px", "")) < 0) {
                        this.path.shift()
                        if (this.path.length > 0) {
                            this.DestroyCar(true)
                            this.rd_ident = this.path[this.path.length - 1];
                            clearInterval(this.lifeCycle)
                            return this.SpawnCar(null)
                        } else {
                            this.DestroyCar(false)
                            return clearInterval(this.lifeCycle)
                        }
                    }
                    car_.lifeTime += 1;
                    if (car_.direction == "up" && this.state.isMoving) {
                        carElem.style.top = (parseInt(carElem.style.top.replace("px", "")) - this.speed).toString() + "px";
                        json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.y -= this.speed;
                    }
                }, 100)
                break;
            case "mini_2":
                this.currRd = curr_rd;
                var targetY = 5;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (this.CheckCollide("y")) return;

                    if (this.hasToStop) {
                        if (Math.abs(parseInt(carElem.style.top.replace("px", ""))) <= json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).stop) {
                            return this.Stop();
                        }
                    } else {
                        this.Start();
                    }

                    if (Math.abs(parseInt(carElem.style.top.replace("px", ""))) <= targetY) {
                        this.path.shift()
                        if (this.path.length > 0) {
                            this.DestroyCar(true)
                            this.rd_ident = this.path[this.path.length - 1];
                            clearInterval(this.lifeCycle)
                            if (this.path[this.path.length - 1] == "max_2_jn") {
                                this.rd_ident = "max_2";
                                return this.SpawnCar("max_2_jn")
                            }
                            return this.SpawnCar(null)
                        } else {
                            this.DestroyCar(false)
                            return clearInterval(this.lifeCycle)
                        }
                    }
                    car_.lifeTime += 1;
                    if (car_.direction == "up" && this.state.isMoving) {

                        carElem.style.top = (parseInt(carElem.style.top.replace("px", "")) - this.speed).toString() + "px";
                        json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.y -= this.speed;
                    }
                }, 100)
                break;
            case "juncR":
                this.currRd = curr_rd;
                var targetX = 471;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (this.CheckCollide("x")) return;
                    if (this.hasToStop) {
                        if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) <= 470) {
                            return this.Stop();
                        }
                    } else {
                        this.Start();
                    }
                    if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) <= targetX && this.state.isMoving) {
                        this.path.shift()
                        if (this.path.length > 0) {
                            this.DestroyCar(true)
                            this.rd_ident = this.path[this.path.length - 1];
                            clearInterval(this.lifeCycle)
                            return this.SpawnCar(null)

                        } else {
                            this.DestroyCar(false)
                            return clearInterval(this.lifeCycle)
                        }
                    }
                    // if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) <= 473 && Math.abs(parseInt(carElem.style.left.replace("px", ""))) >= 475) {
                    //     json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).carAtJn = this.car.ident;
                    // } 
                    car_.lifeTime += 1;

                    if (car_.direction == "left" && this.state.isMoving) {
                        carElem.style.left = (parseInt(carElem.style.left.replace("px", "")) - this.speed).toString() + "px";
                        json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.x -= this.speed;

                    }
                }, 100)
                break;
            case "juncL":
                this.currRd = curr_rd;
                var targetX = 410;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (this.CheckCollide("x")) return;
                    if (this.hasToStop) {
                        if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) >= 410) {
                            return this.Stop();
                        }
                    } else {
                        this.Start();
                    }
                    if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) >= targetX && this.state.isMoving) {
                        this.path.shift()
                        if (this.path.length > 0) {
                            this.DestroyCar(true)
                            this.rd_ident = this.path[this.path.length - 1];
                            clearInterval(this.lifeCycle)
                            return this.SpawnCar(null)
                        } else {
                            this.DestroyCar(false)
                            clearInterval(this.lifeCycle)
                            return this.SpawnCar(null)
                        }
                    }
                    car_.lifeTime += 1;
                    if (car_.direction == "right" && this.state.isMoving) {

                        carElem.style.left = (parseInt(carElem.style.left.replace("px", "")) + this.speed).toString() + "px";
                        json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.x += this.speed;
                    }
                }, 100)
                break;
            case "max_1":
                this.currRd = curr_rd;
                var targetX = 900;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (this.CheckCollide("x")) return;
                    if (this.hasToStop) {
                        if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) >= json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).stop) {
                            return this.Stop();
                        }
                    } else {
                        this.Start();
                    }

                    if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) >= targetX && this.state.isMoving) {
                        // setTimeout()
                        this.DestroyCar(false)
                        this.path.shift()
                        return clearInterval(this.lifeCycle)
                    }
                    car_.lifeTime += 1;
                    if (car_.direction == "right" && this.state.isMoving) {

                        carElem.style.left = (parseInt(carElem.style.left.replace("px", "")) + this.speed).toString() + "px";
                        json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.x += this.speed;
                    }
                }, 100)
                break;
            case "max_2":
                this.currRd = curr_rd;
                var targetX = 1;
                this.lifeCycle = setInterval(() => {
                    var car_ = json.geo.map.Sector_XY01.rt.cars.find(o => o.ident == this.car.ident);
                    let carElem = document.getElementById(car_.ident);
                    if (this.CheckCollide("x")) return;

                    if (this.hasToStop) {
                        if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) <= json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).stop) {
                            this.Stop();
                        }
                    } else {
                        this.Start();
                    }
                    // console.log(Math.abs(parseInt(carElem.style.left.replace("px", ""))))
                    if ((Math.abs(parseInt(carElem.style.left.replace("px", ""))) <= targetX && this.state.isMoving || ((parseInt(carElem.style.left.replace("px", "")))) < 0)) {
                        this.DestroyCar(false)
                        this.path.shift()
                        return clearInterval(this.lifeCycle)
                    }
                    // if (Math.abs(parseInt(carElem.style.left.replace("px", ""))) <= 470 && Math.abs(parseInt(carElem.style.left.replace("px", ""))) >= 475) {
                    //     json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).carAtJn = this.car.ident;
                    // } 
                    car_.lifeTime += 1;
                    if (car_.direction == "left" && this.state.isMoving) {

                        carElem.style.left = (parseInt(carElem.style.left.replace("px", "")) - this.speed).toString() + "px";
                        json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.x -= this.speed;
                    }
                }, 100)
                break;
            default:
                break;
        }

    }

    DestroyCar(isLaneChanging) {
        try {
            document.getElementById(this.car.ident).remove()
            if (!isLaneChanging) {
                json.geo.map.Sector_XY01.rt.cars.splice(json.geo.map.Sector_XY01.rt.cars.findIndex(a => a.ident === this.car.ident), 1)
            }

            var indexToRemove = json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(car => car.ident === this.car.ident)
            if (indexToRemove > -1) {
                json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.splice(indexToRemove, 1)
            } else {
                console.error("Car couldnt remove from queue")
            }
            console.debug(`Removed car#${this.car.ident}`)
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

    Stop() {
        this.state.isMoving = false;
    }

    Start() {
        this.state.isMoving = true;
    }

    Traffic(signal) {
        if (signal == 0) {
            if (this.hasToStop) return;
            if ((json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.y != null
                && json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.y >= json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).stop)
                || (json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.x != null
                    && json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).direct == "right"
                    && json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.x <= json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).stop)
                || (json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.x != null
                    && json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).direct == "left"
                    && json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.find(a => a.ident === this.car.ident).pos.x >= json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).stop)) {
                this.hasToStop = true;

            }
        } else {
            this.hasToStop = false;
        }
    }

    getOnRoadName() {
        return this.currRd
    }

    CheckCollide(type) {
        var action = false;
        if (type == "x") {
            if (json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.length > 1 && json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident) > 0) {
                // console.log(`Comparing car ${json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident)]} with infront ${json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident)-1]}`)
                // console.log(Maths.abs((json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident)-1].pos.x - json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident)].pos.x)))
                if (Math.abs((json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident) - 1].pos.x - json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident)].pos.x)) <= 30) {
                    this.Stop();
                    action = true;
                } else {
                    
                    this.Start();
                    action = false
                }
            }
        } else if (type == "y") {
            if (json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.length > 1 && json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident) > 0) {
                // console.log(`Comparing car ${json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident)]} with infront ${json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident)-1]}`)
                // console.log(Maths.abs((json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident)-1].pos.y - json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident)].pos.y))
                if (Math.abs((json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident) - 1].pos.y - json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue[json.geo.map.Sector_XY01.roads.find(rd => rd.ident == this.rd_ident).queue.findIndex(a => a.ident === this.car.ident)].pos.y)) <= 15) {
                    this.Stop();
                    action = true;
                } else {
                    this.Start();
                    action = false
                }
            }
        }
        return action;
    }
}

class StreetLight {
    constructor(link, x, y, state) {
        this.link = link;
        this.state = state;
        let light = document.createElement("img");
        light.setAttribute("style", `position: absolute; width: 18px; height: 18px; 
                            left: ${x}px; top: ${y}px;`);
        light.setAttribute('src', './red.png')
        light.setAttribute("id", link.toString() + "_light")
        city.appendChild(light)
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
var maxSpawns = 0
let roads = ["max_2", "mini_2", "max_1"]
let car = new Car("max_2")
json.geo.map.Sector_XY01.rt.cars.push(car)
setInterval(() => {
    let roadChosen = roads[Math.floor(Math.random() * roads.length)];
    if(roadChosen == "mini_2" && json.geo.map.Sector_XY01.roads.find(rd => rd.ident == "mini_2").queue.length >= 10)
        return;
    let car = new Car(roadChosen)
    json.geo.map.Sector_XY01.rt.cars.push(car)
    maxSpawns++;
}, Math.floor((Math.random() * 1500) + 1000));


setInterval(() => {
    text = "";
    json.geo.map.Sector_XY01.roads.find(rd => rd.ident == "max_2").queue.forEach((car) => {
        text += `${car.ident}<br />`
    })
    document.getElementById("queue").innerHTML = text
}, 0)

json.geo.map.Sector_XY01.streetLights.forEach((light) => {
    new StreetLight(light.link, light.x, light.y, 0)
})

setInterval(() => {
    json.geo.map.Sector_XY01.roads.forEach((rd) => {
        if (rd.ident == "mini_1") return;
        if (json.geo.map.Sector_XY01.streetLights.find(o => o.link == rd.ident).state == 0) {
            json.geo.map.Sector_XY01.rt.cars.forEach((car) => {
                car.getOnRoadName();
                if (car.getOnRoadName() == "juncR" && rd.ident == "max_2") {
                    car.Traffic(0)
                } else if (car.getOnRoadName() == "juncL" && rd.ident == "max_1") {
                    car.Traffic(0)
                }
                if (car.getOnRoadName() == rd.ident) {
                    car.Traffic(0)
                }
            })
        } else if (json.geo.map.Sector_XY01.streetLights.find(o => o.link == rd.ident).state == 1) {
            json.geo.map.Sector_XY01.rt.cars.forEach((car) => {
                car.getOnRoadName();
                if (car.getOnRoadName() == "juncR" && rd.ident == "max_2") {
                    car.Traffic(1)
                } else if (car.getOnRoadName() == "juncL" && rd.ident == "max_1") {
                    car.Traffic(1)
                }
                if (car.getOnRoadName() == rd.ident) {
                    car.Traffic(1)
                }
            })
        }
    })
})

setInterval(() => {
    let minCarPos = 99999999;
    if((json.geo.map.Sector_XY01.roads.find(rd => rd.ident == "max_2").queue).find(car => car.ident == json.geo.map.Sector_XY01.roads.find(rd => rd.ident == "max_2").carAtJn) != undefined && (json.geo.map.Sector_XY01.roads.find(rd => rd.ident == "max_2").queue).find(car => car.ident == json.geo.map.Sector_XY01.roads.find(rd => rd.ident == "max_2").carAtJn).pos.x <= 465){
        json.geo.map.Sector_XY01.roads.find(rd => rd.ident == "max_2").carAtJn = null;
    }
    json.geo.map.Sector_XY01.roads.find(rd => rd.ident == "max_2").queue.forEach(car => {
        if (car.pos.x <= minCarPos && car.pos.x >= 465) {
            minCarPos = car.pos.x;
            json.geo.map.Sector_XY01.roads.find(rd => rd.ident == "max_2").carAtJn = car.ident;
        }
    });
    console.log(json.geo.map.Sector_XY01.roads.find(rd => rd.ident == "max_2").carAtJn )
}, 10)

const ChangeStreetLight = (ident, to) => {
    try {
        if (to == 1) {
            document.getElementById(ident + "_light").setAttribute('src', './green.png')
        } else if (to == 0) {
            document.getElementById(ident + "_light").setAttribute('src', './red.png')
        }
        json.geo.map.Sector_XY01.streetLights.find(o => o.link == ident).state = to;
    } catch {

    }
}


// TRAFFIC AI
let controllable_lanes = [
    {
        ident: "max_1",
        number: 0,
        inRegion: 0,
        capacity: 50,
        regionX_min: 256,
        regionX_max: 415,
        capRegion: 10,
    },
    {
        ident: "max_2",
        number: 0,
        inRegion: 0,
        capacity: 50,
        regionX_min: 465,
        regionX_max: 650,
        capRegion: 10,
    },
    {
        ident: "mini_2",
        number: 0,
        inRegion: 0,
        capacity: 7,
        regionY_min: -5,
        regionY_max: 85,
        capRegion: 4,
    }
]
const ManageTraffic = () => {

    // set max 1 to green and max 2 to red
    ChangeStreetLight("max_1", 1)
    ChangeStreetLight("max_2", 1)
    ChangeStreetLight("mini_2", 1)

    setInterval(() => {
        controllable_lanes.forEach((lane) => {
            let roadInfo = json.geo.map.Sector_XY01.roads.find(rd => rd.ident == lane.ident)
            lane.number = roadInfo.queue.length;
            let counter = 0;
            roadInfo.queue.forEach((car) => {
                if (car.pos.x != null) {
                    // max 1 or max 2
                    if (car.direct == "left") {
                        if (car.pos.x >= lane.regionX_min && car.pos.x <= lane.regionX_max) {
                            counter++;
                        }
                    } else if (car.direct == "right") {
                        if (car.pos.x >= lane.regionX_min && car.pos.x <= lane.regionX_max) {
                            counter++;
                        }
                    }
                } else if (car.pos.y != null) {
                    if (car.pos.y <= lane.regionY_max && car.pos.y <= lane.regionY_max) {
                        counter++;
                    }
                }
            })
            lane.inRegion = counter;
        })
        // finding maximum blockage
        var laneBlockage = 0;
        var index = 0;
        var laneBlockagePercent = controllable_lanes[0].inRegion / controllable_lanes[0].capRegion;
        controllable_lanes.forEach((lane) => {
            if (lane.inRegion / lane.capRegion > laneBlockagePercent) {
                laneBlockagePercent = lane.inRegion / lane.capRegion;
                laneBlockage = index;
            }
            index++;
        })

        if (controllable_lanes[laneBlockage].ident == "max_1") {
            ChangeStreetLight("mini_2", 0)
            ChangeStreetLight("max_2", 0)
            ChangeStreetLight("max_1", 1)

        } else if (controllable_lanes[laneBlockage].ident == "max_2") {
            ChangeStreetLight("mini_2", 0)
            ChangeStreetLight("max_1", 0)
            ChangeStreetLight("max_2", 1)
        } else if (controllable_lanes[laneBlockage].ident == "mini_2") {
            ChangeStreetLight("max_1", 0)
            ChangeStreetLight("max_2", 0)
            setTimeout(() => {
                ChangeStreetLight("mini_2", 1)
            }, 500)
        }

        controllable_lanes.forEach((lane) => {

        })
    }, 4000)
}

ManageTraffic()