import urllib.request
import time
import sys

def check_health():
    url = "http://localhost:8000/"
    retries = 5
    for i in range(retries):
        try:
            print(f"Attempt {i+1} to connect to {url}...")
            with urllib.request.urlopen(url) as response:
                if response.status == 200:
                    print("Success! Server is up and running.")
                    return True
        except Exception as e:
            print(f"Failed to connect: {e}")
            time.sleep(2)
    return False

if __name__ == "__main__":
    if check_health():
        sys.exit(0)
    else:
        sys.exit(1)
