# node-rds-psql

docker build -t node-rds-psql .


docker run -d -p 3000:3000   -e AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)   -e AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)   -e AWS_REGION=eu-north-1   --name node-rds-psql 471208936138.dkr.ecr.eu-north-1.amazonaws.com/node-rds-psql
