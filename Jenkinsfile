pipeline {
    agent {
        label "${AGENT}"
    }

    stages {
        
        stage("Continuous Integration") {
            steps {
                git branch: "main", url: "https://github.com/YanisBra/Talkingo_frontend"
                sh "npm install"
                sh "npm run test"
            }
        }
        
        stage("Continuous Delivery / Livraison Continue") {
            steps {
                sh "docker build . -t ${DOCKERHUB_USERNAME}/talkingo_frontend"
                sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKERHUB_PASSWORD}" 
                sh "docker push ${DOCKERHUB_USERNAME}/talkingo_frontend"
            }
        }
        
        stage('Countinuous Deployment') {
            steps {
                sh ''' 
                sshpass -p ${SERVER_PASSWORD} ssh -o StrictHostKeyChecking=no ${SERVER_USERNAME}@${SERVER_IP} \
                "docker rm -f talkingo_frontend_container &&\
                docker run --name talkingo_frontend_container -p 5173:5173 -d yanisbra/talkingo_frontend"
                '''
            }
        }
    
    }
}
