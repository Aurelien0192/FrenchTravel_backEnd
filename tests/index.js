require("../utils/database")

describe("PlaceService", () => {
   require('./services/PlaceService.test')
})

describe("PlaceControllers", () => {
   require('./controllers/PlaceController.test')
})

describe("ApiLocationService", () => [
   require('./services/ApiLocationService.test')
])

describe("ApiLocationControllers",() => {
   require('./controllers/ApiLocationController.test')
})