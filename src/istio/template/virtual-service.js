const make = (namespace, hosts, serviceName, headers, virtualServiceName) => {
  const virtualService = {
    apiVersion: 'networking.istio.io/v1alpha3',
    kind: 'VirtualService',
    metadata: {
      namespace,
      name: virtualServiceName,
    },
    spec: {
      hosts: [
        `${serviceName}.${namespace}.svc.cluster.local`,
        ...hosts,
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
