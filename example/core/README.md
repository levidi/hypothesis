# For work in the local environment

- Use kube-proxy

```bash
kubectl proxy
```

- Take the token and put it in the path /src/config
```bash
kubectl get secrets -n hypothesis -o jsonpath="{.items[?(@.metadata.annotations['kubernetes\.io/service-account\.name']=='hypothesis-admin')].data.token}"|base64 --decode > token
```

- Take the ca.crt and put it in the path /src/config
```bash
kubectl get secrets -n hypothesis -o jsonpath="{.items[?(@.metadata.annotations['kubernetes\.io/service-account\.name']=='hypothesis-admin')].data.ca\.crt}"|base64 --decode > ca.crt
```
