import requests
import os
import json
from concurrent import futures

def upload(path):
  with open(f"results/{path}.json", mode="r") as f:
    request = json.loads(f.read())
    print(f"Uploading {path}.json")
    headers = {"Content-Type": "application/json"}
    response = requests.post("http://localhost:8080/v3/results", data=json.dumps(request), headers=headers)
    if response.status_code != 201:
      with open(f"status.log", mode="a") as w:
        w.write(f"{path}\n")
        print(response.text)


def future():
  future_list = []
  files = sorted(list(map(lambda x: int(x.split(".")[0]), os.listdir("results"))))
  with futures.ThreadPoolExecutor(max_workers=3) as executor:
    for file in files:
      executor.submit(upload, file)
      future_list.append(future)

def restore():
  with open("status.log", mode="r") as f:
    for line in f.readlines():
      upload(line.strip())

def download():
  limit: int = 5000
  for offset in range(0, 2060000, limit):
    requestURL = f"https://localhost:8080/v1/results?offset={offset}&limit={limit}"
    response = requests.get(requestURL)
    with open(f"results/{offset}.json", mode="w") as f:
      print(f"Downloading {offset} -> {offset + 5000}")
      f.write(response.text)

if __name__=="__main__":
  # download()
  # future()
  restore()
