import os

import boto3
from fastapi import UploadFile


class S3:
    def __init__(self):
        session = boto3.session.Session()
        self.s3 = session.client(
            service_name="s3",
            endpoint_url=os.getenv("ENDPOINT_URL"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            region_name=os.getenv("REGION")
        )

    def upload_file(self, file: UploadFile) -> str:
        bucket = os.getenv("BUCKET")
        self.s3.upload_fileobj(file.file, bucket, file.filename, ExtraArgs={"ACL": "public-read"})
        file_url = f"{os.getenv("ENDPOINT_URL")}/{bucket}/{file.filename}"
        return file_url

    def get_file(self, file_url: str) -> bytes:
        get_object_response = self.s3.get_object(Bucket=os.getenv("BUCKET"), Key=os.path.basename(file_url))
        return get_object_response["Body"].read()
