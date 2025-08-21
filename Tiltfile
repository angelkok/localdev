# -*- mode: Python -*-
import os

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
# read credentials from environment variables, with defaults
postgres_user = os.environ.get('POSTGRES_USER', 'services')
postgres_password = os.environ.get('POSTGRES_PASSWORD', 'services_password')
postgres_db = os.environ.get('POSTGRES_DB', 'services_development')

rails_db_user = os.environ.get('RAILS_DB_USER', 'rails_user')
rails_db_password = os.environ.get('RAILS_DB_PASSWORD', 'rails_password')
rails_db_name = os.environ.get('RAILS_DB_NAME', 'rails_service_db')

go_db_user = os.environ.get('GO_DB_USER', 'go_user')
go_db_password = os.environ.get('GO_DB_PASSWORD', 'go_password')
go_db_name = os.environ.get('GO_DB_NAME', 'go_service_db')

python_db_user = os.environ.get('PYTHON_DB_USER', 'python_user')
python_db_password = os.environ.get('PYTHON_DB_PASSWORD', 'python_password')
python_db_name = os.environ.get('PYTHON_DB_NAME', 'python_service_db')

node_db_user = os.environ.get('NODE_DB_USER', 'node_user')
node_db_password = os.environ.get('NODE_DB_PASSWORD', 'node_password')
node_db_name = os.environ.get('NODE_DB_NAME', 'node_service_db')

# dynamically generate configmaps
db_config_map = {
    'apiVersion': 'v1',
    'kind': 'ConfigMap',
    'metadata': { 'name': 'database-config-services' },
    'data': {
        'POSTGRES_USER': postgres_user,
        'POSTGRES_PASSWORD': postgres_password,
        'POSTGRES_DB': postgres_db,
        'RAILS_DATABASE_URL': 'postgres://{}:{}@postgres-services:5432/{}'.format(rails_db_user, rails_db_password, rails_db_name),
        'GO_DATABASE_URL': 'postgres://{}:{}@postgres-services:5432/{}?sslmode=disable'.format(go_db_user, go_db_password, go_db_name),
        'PYTHON_DATABASE_URL': 'postgres://{}:{}@postgres-services:5432/{}'.format(python_db_user, python_db_password, python_db_name),
        'NODE_DATABASE_URL': 'postgres://{}:{}@postgres-services:5432/{}'.format(node_db_user, node_db_password, node_db_name),
    }
}

init_db_script = """#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER {} WITH PASSWORD '{}';
    CREATE DATABASE {};
    GRANT ALL PRIVILEGES ON DATABASE {} TO {};

    CREATE USER {} WITH PASSWORD '{}';
    CREATE DATABASE {};
    GRANT ALL PRIVILEGES ON DATABASE {} TO {};

    CREATE USER {} WITH PASSWORD '{}';
    CREATE DATABASE {};
    GRANT ALL PRIVILEGES ON DATABASE {} TO {};

    CREATE USER {} WITH PASSWORD '{}';
    CREATE DATABASE {};
    GRANT ALL PRIVILEGES ON DATABASE {} TO {};
EOSQL
""".format(rails_db_user, rails_db_password, rails_db_name, rails_db_name, rails_db_user,
           go_db_user, go_db_password, go_db_name, go_db_name, go_db_user,
           python_db_user, python_db_password, python_db_name, python_db_name, python_db_user,
           node_db_user, node_db_password, node_db_name, node_db_name, node_db_user)

init_db_config_map = {
    'apiVersion': 'v1',
    'kind': 'ConfigMap',
    'metadata': { 'name': 'postgres-init-db-services' },
    'data': { 'init-db.sh': init_db_script }
}

k8s_yaml(encode_yaml([db_config_map, init_db_config_map]))
k8s_yaml('database/volume-services.yaml')
k8s_yaml('database/postgres-services-deploy.yaml')
k8s_resource('postgress-services', port_forwards=['5433:5432'])
