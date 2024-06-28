pipeline {
    agent any

    stages {
        stage('Clonar repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/leticiazip/teste-api-ebac-exercicio.git'
                sh 'npm install'
            }
        }
        stage('Instalar dependencia') {
            steps {
                sh 'npm install'
                sh 'npm serverest'
            }
        }
        stage('Rodar servidor') {
            steps {
                sh 'npx serverest --porta 3500'
            }
        }
        stage('Executar teste') {
            steps {
                sh 'NO_COLOR=1 npm run cy:run'
            }
        }
    }
}