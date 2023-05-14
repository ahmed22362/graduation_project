const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const action = async () => {
  for (let i = 1; i < 2; i++) {
    console.log(`Round ${i}`)
    console.log("Waiting for 500ms")
    fetch("https://db23-154-178-248-227.eu.ngrok.io/api/v1/users/signup", {
      Method: "POST",
      Headers: {
        Accept: "application.json",
        "Content-Type": "application/json",
      },
      Body: JSON.stringify({
        name: "username",
        phone: "email",
        password: "password",
        passwordConfirm: "password",
      }),
      Cache: "default",
    })
      .then((response) => {
        //handle response
        console.log(response)
      })
      .then((data) => {
        //handle data
        console.log(data)
      })
      .catch((error) => {
        //handle error
      })
  }
}
action()
$.ajax({
  url: "https://db23-154-178-248-227.eu.ngrok.io/api/v1/users/signup",
  type: "POST",
  // headers: {
  //     'Authorization': 'Bearer ', // Replace 'token' with your actual token value
  //     'Content-Type': 'application/json'
  // },
  data: JSON.stringify({
    name: "username",
    phone: "email",
    password: password,
    passwordConfirm: confirmPassword,
  }),
  success: function (response) {
    console.log(response)
    alert("Signup successful.")
  },
  error: function (xhr) {
    console.log(xhr.responseText)
    alert("Signup failed.")
    console.log(username + email + password + confirmPassword)
  },
})
// ;  $.ajax({
//   url: 'https://db23-154-178-248-227.eu.ngrok.io/api/v1/users/signup',
//   type: 'POST',
//   // headers: {
//   //     'Authorization': 'Bearer ', // Replace 'token' with your actual token value
//   //     'Content-Type': 'application/json'
//   // },
//   data: JSON.stringify({
//       "name": 'username',
//       "phone": 'email',
//       "password": password,
//       "passwordConfirm": confirmPassword
//   }),
//   success: function(response) {
//       console.log(response);
//       alert('Signup successful.');
//   },
//   error: function(xhr) {
//       console.log(xhr.responseText);
//       alert('Signup failed.');
//       console.log(username + email + password + confirmPassword)
//   }
// });

// });

console.log("Hello!")
