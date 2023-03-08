const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const action = async () => {
  for (let i = 1; i < 100; i++) {
    console.log(`Round ${i}`)
    console.log("Waiting for 500ms")
    fetch("https://qltmart.com/?mibextid=l066kq")
      .then((response) => console.log(response.status))
      .catch((error) => console.log(error))

    await sleep(5000)
  }
}
action()
