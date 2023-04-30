import requests
import os
import json
from concurrent import futures
from array import array

def upload(path, restore = False) -> int:
  with open(f"results/{path}.json", mode="r") as f:
    request = json.loads(f.read())
    print(f"Uploading {path}.json")
    headers = {"Content-Type": "application/json"}
    response = requests.post("http://localhost:8080/v3/results", data=json.dumps(request), headers=headers)
    if not restore:
      with open(f"status.log", mode="a") as w:
        w.write(f"{response.status_code},{path}\n")
    return response.status_code

def future():
  future_list = []
  files: set[int] = set(map(lambda x: int(x), sorted(list(map(lambda x: int(x.split(".")[0]), os.listdir("results"))))))
  with open("status.log", mode="r") as f:
    lines: set[int] = set(map(lambda x: int(x), filter(lambda x: x!= "", map(lambda x: x.split(",")[-1], f.read().split("\n")))))
    subtract = sorted(list(files - lines))
    with futures.ThreadPoolExecutor(max_workers=3) as executor:
      for file in subtract:
        executor.submit(upload, file)
        future_list.append(future)

def restore():
  with open("status.log", mode="r+") as f:
    for line in f.readlines():
      substr: list[str] = line.split(",") 
      if int(substr[0]) == 400:
        status_code = upload(substr[1].strip(), True)
        line = f"{status_code},{substr[1]}\n"

def download():
  limit: int = 5000
  for offset in range(0, 2060000, limit):
    requestURL = f"http://localhost:8080/v1/results?offset={offset}&limit={limit}"
    response = requests.get(requestURL)
    with open(f"results/{offset}.json", mode="w") as f:
      print(f"Downloading {offset} -> {offset + 5000}")
      f.write(response.text)

if __name__=="__main__":
  # download()
  future()
  # restore()
