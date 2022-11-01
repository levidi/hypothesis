
kubectl apply -f ./namespace.yaml \
&& kubectl apply -f ./secret-kiali.yaml \
&& istioctl install -s profile=minimal -y
