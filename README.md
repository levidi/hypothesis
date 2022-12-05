docker build . -t leviditomazzo/hypothesis:0.0.1
docker build . -t leviditomazzo/hypothesis:0.0.1-debug

docker run -d -p 3000:3000 -e URL_K8S=http://host.docker.internal:8001 --name hypothesis leviditomazzo/hypothesis:0.0.1


docker run -d --network host --name hypothesis leviditomazzo/hypothesis:0.0.1
host.docker.internal
https://konghq.com/blog/istio-gateway

kubectl create namespace kong-istio

kubectl label namespace kong-istio istio-injection=enabled

helm repo add kong https://charts.konghq.com && helm repo update

helm install -n kong-istio kong-istio kong/kong