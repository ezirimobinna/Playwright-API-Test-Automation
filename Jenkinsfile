pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install chromium'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {

            echo 'Playwright test execution completed.'

            allure([
                results: [[path: 'allure-results']],
                includeProperties: false,
                reportBuildPolicy: 'ALWAYS'
            ])
        }
    }
}