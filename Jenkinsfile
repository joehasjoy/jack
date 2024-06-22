pipeline {
  agent any
  stages {
    stage('git clone') {
      steps {
        git(url: 'ssh://git@gitlab.infra.ahotels.tech:12422/ops/ops-tools-frontend.git', branch: 'master')
      }
    }
    stage('build') {
      steps {
        sh '''source /data/nvm/nvm.sh
nvm use v10.15.3
npm config set cache /data/tmp/npm
npm install
npm run build'''
      }
    }
  }
  environment {
    ENV = 'dev'
  }
}