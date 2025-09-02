# node-rds-psql

docker build -t node-rds-psql .


docker run -d -p 3000:3000   -e AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)   -e AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)   -e AWS_REGION=eu-north-1   --name node-rds-psql 471208936138.dkr.ecr.eu-north-1.amazonaws.com/node-rds-psql


1. Authenticate Docker with ECR

Replace <region> with your AWS region (eu-north-1 in your case):

aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com

🔹 2. Create a Repository (if not already created)
aws ecr create-repository --repository-name node-rds-psql --region eu-north-1

🔹 3. Tag Your Local Image

Tag your image with the ECR repo URI:

docker tag node-rds-psql:latest <aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com/node-rds-psql:latest

🔹 4. Push Image to ECR
docker push <aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com/node-rds-psql:latest
