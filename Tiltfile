
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
# redis
docker_compose('docker-compose-redis.yaml')
dc_resource('redis', labels=["redis"])

# database
v1alpha1.extension_repo('basedir', url='file://{}'.format(config.main_dir))
v1alpha1.extension('database', repo_name='basedir', repo_path='database', args=['--database', 'postgres'])

# rails
load('./rails/Tiltfile', 'rails_app')
rails_app('rails-app', '--database=postgresql')