import requests
import os
import json

def upload():
  files = sorted(list(map(lambda x: int(x.split(".")[0]), os.listdir("results"))))
  for file in files:
    with open(f"results/{file}.json", mode="r") as f:
      request = json.loads(f.read())
      print(f"Uploading {file}.json")
      headers = {"Content-Type": "application/json"}
      response = requests.post("http://localhost:8080/v2/results", data=json.dumps(request), headers=headers)
      if response.status_code != 201:
        with open(f"status.log", mode="a") as w:
          w.write(f"{response.status_code}: {file}")
          print(response.text)

def download():
  for offset in range(757000, 780000, 1000):
    requestURL = f"http://localhost:8080/v1/results?offset={offset}&limit=1000&sort=salmonId&order=asc"
    response = requests.get(requestURL)
    with open(f"results/{offset}.json", mode="w") as f:
      print(f"Downloading {offset} -> {offset + 1000}")
      f.write(response.text)

if __name__=="__main__":
  upload()
