import boto3
import os
import logging
import json
from elasticsearch import Elasticsearch, RequestsHttpConnection
from aws_requests_auth.aws_auth import AWSRequestsAuth

logger = logging.getLogger()
es_host = os.getenv('ELASTICSEARCH_URL')
es_index = 'images'
access_key = os.getenv('AWS_ACCESS_KEY_ID')
secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
session_token = os.getenv('AWS_SESSION_TOKEN')
region = os.getenv('AWS_REGION')

# Create clients for AWS services
rek_client = boto3.client('rekognition')
s3 = boto3.resource('s3')


# Establish connection to ElasticSearch
auth = AWSRequestsAuth(aws_access_key=access_key,
                       aws_secret_access_key=secret_access_key,
                       aws_token=session_token,
                       aws_host=es_host,
                       aws_region=region,
                       aws_service='es')

es = Elasticsearch(host=es_host,
                   port=443,
                   use_ssl=True,
                   connection_class=RequestsHttpConnection,
                   http_auth=auth)

logger.info("{}".format(es.info()))


def lambda_handler(event, context):
    """Lambda Function entrypoint handler

    :event: S3 Put event
    :context: Lambda context
    :returns: Number of records processed

    """
    processed = 0
    for record in event['Records']:
        s3_record = record['s3']

        # Get the image metadata
        key = s3_record['object']['key']

        bucket = s3_record['bucket']['name']
        s3 = boto3.client('s3')

        obj = s3.get_object(Bucket=bucket, Key=key)
        j = obj['Body'].read()


        res = es.index(index=es_index, doc_type='event',
                       id=key, body={'metadata': j})

        logger.debug(res)
        processed = processed + 1

    logger.info('Successfully processed {} records'.format(processed))
    return processed