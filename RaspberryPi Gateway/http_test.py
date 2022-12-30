import requests
baseUrl = "https://iot-term-project-server.onrender.com/messages"

r = requests.post(baseUrl, json={
    "messageType":0,
    "water":56,
    "electricity": -1,
    "senderId":"d",
    "battery":50,
    "path":["d", "b", "c"]
})

print(r.status_code)
print(r.text)