kubectl apply -f ./istio/1-name-space.yaml \
&& kubectl apply -f ./istio/2-secret-kiali.yaml \
&& istioctl install \
--set profile=minimal \
