import requests
import os
import json
from concurrent import futures
from array import array

def upload(path) -> int:
  with open(f"results/{path}.json", mode="r") as f:
    request = json.loads(f.read())
    print(f"Uploading {path}.json")
    headers = {"Content-Type": "application/json"}
    response = requests.post("http://localhost:3000/v3/results/restore", data=json.dumps(request), headers=headers)
    status_code: int = response.status_code
    if status_code == 201:
      with open(f"status.log", mode="a") as w:
        w.write(f"{response.text},{path}\n")
    return status_code

def future():
  future_list = []
  files: set[int] = set(map(lambda x: int(x), list(map(lambda x: x.split(".")[0], os.listdir("results")))))
  with open("status.log", mode="r") as f:
    lines: set[int] = set(map(lambda x: int(x), filter(lambda x: x!= "", map(lambda x: x.split(",")[-1], f.read().split("\n")))))
    subtract = sorted(list(files - lines))
    with futures.ThreadPoolExecutor(max_workers=5) as executor:
      for file in subtract:
        try:
          executor.submit(upload, file)
          future_list.append(future)
        except Exception as e:
          print(e)
          break
def restore():
  with open("status.log", mode="r+") as f:
    for line in f.readlines():
      substr: list[str] = line.split(",") 
      if int(substr[0]) == 400:
        status_code = upload(substr[1].strip(), True)
        line = f"{status_code},{substr[1]}\n"

def download():
  limit: int = 1000
  for offset in range(2679000, 2700000, limit):
    requestURL = f"http://localhost:3000/v3/results?offset={offset}&limit={limit}"
    print(f"Downloading... {offset} -> {offset + 1000}")
    response = requests.get(requestURL)
    print(f"Done {offset} -> {offset + 1000}")
    with open(f"results/{offset}.json", mode="w") as f:
      f.write(response.text)

if __name__=="__main__":
  # download()
  future()
  # restore()
