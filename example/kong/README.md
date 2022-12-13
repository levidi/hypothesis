# For install Kong Ingress


- Create namespace
```bash
kubectl create namespace kong-istio
```

- Inject istio sidecar 
```bash
kubectl label namespace kong-istio istio-injection=enabled
```

- Use helm to install
```bash
helm repo add kong https://charts.konghq.com && helm repo update
```

- Install Kong Ingress
```bash
helm install -n kong-istio kong-istio kong/kong
```
