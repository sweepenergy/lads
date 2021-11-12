docker run -dp 80:80 docker/getting-started
docker ps --format '{"ID":"{{ .ID }}", "Image": "{{ .Image }}", "Names":"{{ .Names }}"}' > running_containers.txt
