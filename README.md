https://konghq.com/blog/istio-gateway

kubectl create namespace kong-istio

kubectl label namespace kong-istio istio-injection=enabled

helm repo add kong https://charts.konghq.com && helm repo update

helm install -n kong-istio kong-istio kong/kong