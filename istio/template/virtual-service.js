const make = (namespace, serviceName, headers) => {
  const virtualService = {
    apiVersion: 'networking.istio.io/v1alpha3',
    kind: 'VirtualService',
    metadata: {
      namespace: `${namespace}`,
      name: `vs-${serviceName}`,
    },
    spec: {
      hosts: [
        `${serviceName}.${namespace}.svc.cluster.local`,
      ],
      http: [
        {
          match: [
            {
              headers,
            },
          ],
          route: [
            {
              destination: {
                host: `${serviceName}-ab-testing.${namespace}.svc.cluster.local`,
              },
            },
          ],
        },
        {
          route: [
            {
              destination: {
                host: `${serviceName}.${namespace}.svc.cluster.local`,
              },
            },
          ],
        },
      ],
    },
  }

  return virtualService
}

module.exports = { make }
