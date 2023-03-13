import requests

url = '127.0.0.1:30/api/v1/cars/'
myobj = {'somekey': 'somevalue'}

# x = requests.post(url, json = myobj)
x = requests.get(url)

print(x.text)
