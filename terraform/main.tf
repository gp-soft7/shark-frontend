terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws",
      version = "4.6"
    }
  }
}

module "s3" {
  source = "./s3"
}
