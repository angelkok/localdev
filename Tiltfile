# -*- mode: Python -*-


# Python service
k8s_yaml('k8s/python-service-deploy.yaml')
docker_build('python-service', 'python-service' )
# setup port forwarding: matches resource yaml meta name
k8s_resource('python-service-deploy', port_forwards='8000:8000')


# Node TS service
k8s_yaml('k8s/node-ts-service-deploy.yaml')
docker_build('node-ts-service', 'node-ts-service',
             live_update=[sync('node-ts-service','/app')], # sync the app dir files synced
             entrypoint="npm run dev",               # dev script runs nodemon which restarts
                                                     # the service when files are changed
             build_args={'node_env': 'development'}) # get access to dev tools in package.json
k8s_resource('node-ts-service-deploy', port_forwards=['8002:8001',  # app port
                                                   '9229:9229']) # debugger port


# Go service
k8s_yaml('k8s/go-service-deploy.yaml')
docker_build('go-service', 'go-service')
k8s_resource('go-service-deploy', port_forwards='8003:8000')


# load kubernetes manifest
#k8s_yaml(['k8s/node-service-deploy.yaml', ])
# works with helm k8s_yaml(helm('chart_dir'))

# build the images
# args: name, context or folder name

#docker_build('node-service', 'node-service',
#             live_update=[sync('node-service','/app')], # sync the app dir files synced
#             entrypoint="npm run dev",               # dev script runs nodemon which restarts
#                                                     # the service when files are changed
#             build_args={'node_env': 'development'}) # get access to dev tools in package.json





#k8s_resource('node-service-deploy', port_forwards=['8001:8001',  # app port
#                                                   '9229:9229']) # debugger port



# redis
# Load the 'deployment' extension
load('ext://deployment', 'deployment_create')
# Create a redis deployment and service with a readiness probe
deployment_create(
  'redis',
  ports='6379',
  readiness_probe={'exec':{'command':['redis-cli','ping']}}
)

# database
v1alpha1.extension_repo('basedir', url='file://{}'.format(config.main_dir))
v1alpha1.extension('database', repo_name='basedir', repo_path='database', args=['--database', 'postgres'])

# rails
# load('./rails/Tiltfile', 'rails_app')
# rails_app('rails-app', '--database=postgresql')

# services database
k8s_yaml('database/volume-services.yaml')
k8s_yaml('database/postgres-services.yaml')
k8s_resource('postgress-services', port_forwards=['5433:5432'])
