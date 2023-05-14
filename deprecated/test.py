import requests

# defining the api-endpoint
API_ENDPOINT = "http://127.0.0.1:30/api/v1/employees/login"


# data to be sent to api
data = {'email': "model@project.com",
        'password': '12345678'}

# sending post request and saving response as response object
r = requests.post(url=API_ENDPOINT, json=data)

# extracting response text

print("The pastebin URL is:%s" % r.json())
