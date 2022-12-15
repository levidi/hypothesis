const editDeploymentPropertys = (deployment, containerName, imageName) => {
  const patch = [
    { op: 'remove', path: '/metadata/uid' },
    { op: 'remove', path: '/metadata/resourceVersion' },
    { op: 'remove', path: '/metadata/generation' },
    { op: 'remove', path: '/metadata/creationTimestamp' },
    { op: 'remove', path: '/metadata/managedFields' },

    { op: 'remove', path: '/spec/revisionHistoryLimit' },
    { op: 'remove', path: '/spec/progressDeadlineSeconds' },
    { op: 'remove', path: '/status' },

    { op: 'replace', path: '/metadata/name', value: `${deployment.metadata.name += tagAB}` },
    {
      op: 'replace',
      path: '/spec/selector/matchLabels',
      value: renameObjectPropertys(deployment.spec.selector.matchLabels),
    },
    {
      op: 'replace',
      path: '/spec/template/metadata/labels',
      value: renameObjectPropertys(deployment.spec.template.metadata.labels),
    },
  ]
  deployment.spec.template.spec.containers
    .forEach((container) => {
      if (container.name === containerName) {
        container.image = imageName
      }
    })
  return jsonpatch.apply_patch(deployment, patch)
}

const editServicePropertys = (service, ports) => {
  renameObjectPropertys(service.spec.selector)
  service.metadata.name += tagAB
  service.spec.ports = ports
  const patch = [
    { op: 'remove', path: '/metadata/uid' },
    { op: 'remove', path: '/metadata/resourceVersion' },
    { op: 'remove', path: '/metadata/creationTimestamp' },
    { op: 'remove', path: '/metadata/managedFields' },

    { op: 'remove', path: '/spec/clusterIP' },
    { op: 'remove', path: '/spec/clusterIPs' },
    { op: 'remove', path: '/status' },
  ]
  return jsonpatch.apply_patch(service, patch)
}

module.exports = { editDeploymentPropertys, editServicePropertys }