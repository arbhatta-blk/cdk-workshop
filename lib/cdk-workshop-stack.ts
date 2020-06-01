import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigw from '@aws-cdk/aws-apigateway'
import { HitCounter } from './hitcounter'
import { TableViewer } from 'cdk-dynamo-table-viewer'

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Defines AWS Lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime : lambda.Runtime.NODEJS_10_X,
      code : lambda.Code.fromAsset('lambda'),
      handler : 'hello.handler'
    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream : hello
    })

    // Defines API Gateway resource linked with above lambda
    new apigw.LambdaRestApi(this, 'HelloEndpoint', {
      handler : helloWithCounter.handler
    })

    new TableViewer(this, 'HitsTableViewer', {
      title : 'Hello hits',
      table : helloWithCounter.table,
      sortBy : '-hits'
    })
  }
}
