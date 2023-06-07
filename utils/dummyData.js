const catchAsync = require("./catchAsync")
const db = require("./../models/index")
const Employee = db.employee
const Issue = db.issue
const Cinema = db.cinema
const Movie = db.movie
const Shop = db.shop
const Car = db.car
const Offer = db.offer
const User = db.user

const makeUser = () => {
  User.create({
    name: "test",
    phone: 103,
    email: "test2@gmail.com",
    password: "test123",
    passwordConfirm: "test123",
  }).then((result) =>
    console.log("user created successfully! ", result.dataValues)
  )
}

const makeAll = (
  employeeFlag,
  cinemaFlag,
  shopFlag,
  movieFlag,
  carFlag,
  offerFlag
) => {
  if (employeeFlag) {
    Employee.bulkCreate([
      {
        name: "employee1",
        email: "employee1@gmail.com",
        password: "password",
      },
      {
        name: "employee2",
        email: "employee2@gmail.com",
        password: "password",
      },
      {
        name: "employee3",
        email: "employee3@gmail.com",
        password: "password",
      },
    ]).then(() => console.log("employees data have been saved"))
  }
  if (cinemaFlag) {
    Cinema.bulkCreate([
      {
        name: "Cinema 1",
        location: "first floor",
        openAt: 4,
        closeAt: 9,
        phone: 932,
        imageUrl:
          "https://res.cloudinary.com/diaitoxmj/image/upload/v1684141915/photos/cinema/xwkayd6fhntudp8nqphv.jpg",
      },
      {
        name: "Cinema 2",
        location: "seconde floor",
        openAt: 4,
        closeAt: 9,
        phone: 932,
        imageUrl:
          "https://res.cloudinary.com/diaitoxmj/image/upload/v1684141891/photos/cinema/xl7pe8mhllwmwkeoperi.jpg",
      },
      {
        name: "Cinema 3",
        location: "seconde floor",
        openAt: 4,
        closeAt: 9,
        phone: 932,
        imageUrl:
          "https://res.cloudinary.com/diaitoxmj/image/upload/v1684141915/photos/cinema/xwkayd6fhntudp8nqphv.jpg",
      },
    ]).then(() => console.log("cinemas data have been saved"))
  }
  if (movieFlag) {
    Movie.bulkCreate([
      {
        name: "movie 1",
        duration: 3,
        release: "2022-10-21",
        description: "very good movie",
        genre: "action",
        time: "13:00",
        ticketPrice: 56.4,
        imageUrl:
          "https://res.cloudinary.com/diaitoxmj/image/upload/v1684141444/photos/vikl8jp5pjopwot6ocj1.jpg",
      },
      {
        name: "movie 2",
        duration: 3,
        release: "2022-10-21",
        description: "very good movie",
        genre: "action",
        time: "13:00",
        ticketPrice: 56.4,
        imageUrl:
          "https://res.cloudinary.com/diaitoxmj/image/upload/v1684141393/photos/zw1w1b8kpd721lxtn7ak.jpg",
      },
      {
        name: "movie 3",
        duration: 3,
        release: "2022-10-21",
        description: "very good movie",
        genre: "action",
        time: "13:00",
        ticketPrice: 56.4,
        imageUrl:
          "https://res.cloudinary.com/diaitoxmj/image/upload/v1684141469/photos/bktf2slwqk2aawmdtbtm.jpg",
      },
    ]).then(() => console.log("movies data have been saved"))
  }
  if (shopFlag) {
    Shop.bulkCreate([
      {
        name: "Entreatment 1",
        location: "Third floor",
        openAt: 4,
        closeAt: 9,
        phone: 932,
        shopType: "entreatment",
        imageUrl:
          "https://res.cloudinary.com/diaitoxmj/image/upload/v1683909745/gFolder/sn17umq3v71ill0c7wi0.jpg",
      },
      {
        name: "Shop 1",
        location: "Third floor",
        openAt: 4,
        closeAt: 9,
        phone: 932,
        shopType: "shop",
        imageUrl:
          "https://res.cloudinary.com/diaitoxmj/image/upload/v1683909589/gFolder/diqgmytknhc0ia4yhji2.jpg",
      },
    ]).then(() => console.log("shops data have been saved"))
  }
  if (carFlag) {
    Car.bulkCreate([
      {
        plateNum: "ABC123",
      },
      {
        plateNum: "EFG456",
      },
      {
        plateNum: "ESD121",
      },
    ]).then(() => console.log("Cars data have been saved"))
  }
  if (offerFlag) {
    Offer.bulkCreate([
      {
        discount: 30,
        startAt: "2023-5-1",
        endAt: "2023-6-1",
      },
      {
        discount: 40,
        startAt: "2023-5-1",
        endAt: "2023-6-25",
      },
      {
        discount: 60,
        startAt: "2023-5-1",
        endAt: "2023-7-1",
      },
    ]).then(() => console.log("offers data have been saved"))
  }
}

const makeUserRelation = (userId, shopId, movieId) => {
  User.findByPk(userId).then((user) => {
    user.addShop(shopId)
    user.addMovie(movieId, {
      through: {
        ticketPrice: 203,
        ticketNum: 1,
        cost: 1 * 203,
      },
    })
    console.log("shop and movie added to user with id: ", user.id)
  })
}
const makeShopOffer = (shopId, offerId) => {
  Shop.findByPk(shopId).then((shop) => {
    shop.addOffer(offerId)
    console.log("offer add to shop with id: ", shopId)
  })
}
const makeCinemaMovies = (cinemaId, movieId) => {
  Cinema.findByPk(cinemaId).then((cinema) => {
    cinema.addMovie(movieId)
    console.log("cinema add to movie with id: ", movieId)
  })
}
// makeAll(false, false, false, false, false, false)
// makeUser()
// makeUserRelation("6f5c2643-5d33-4505-ad27-ff5ec8676bea", [1, 2, 3])
// makeShopOffer(1, [1, 3])
// makeCinemaMovies(1, [1, 3])
module.exports = db
