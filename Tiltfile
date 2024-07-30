
# load kubernetes manifest
k8s_yaml(['k8s/python-service-deploy.yaml',
          'k8s/node-service-deploy.yaml'])
# works with helm k8s_yaml(helm('chart_dir'))

# build the images
# args: name, context or folder name
docker_build('python-service', 'python-service' )

docker_build('node-service', 'node-service',
             live_update=[sync('node-service','/app')], # sync the app dir files synced
             entrypoint="npm run dev",               # dev script runs nodemon which restarts
                                                     # the service when files are changed
             build_args={'node_env': 'development'}) # get access to dev tools in package.json

# setu port forwarding: matches resource yaml meta name
k8s_resource('python-service-deploy', port_forwards='8000:8000')
k8s_resource('node-service-deploy', port_forwards=['8001:8001',  # app port
                                                   '9229:9229']) # debugger port

