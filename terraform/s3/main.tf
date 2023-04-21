resource "aws_s3_bucket" "main_bucket" {
  bucket = "dev-shark-auto-frontend-bucket2"
}

resource "aws_s3_bucket_policy" "main_bucket_public_access_policy_attachment" {
  bucket = aws_s3_bucket.main_bucket.id
  policy = data.aws_iam_policy_document.main_bucket_public_access_policy.json
}

data "aws_iam_policy_document" "main_bucket_public_access_policy" {
  statement {
    actions = [
      "s3:GetObject",
    ]
    sid    = "AllowPublicRead"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    resources = [
      "${aws_s3_bucket.main_bucket.arn}/*",
    ]
  }
}

resource "aws_cloudfront_distribution" "main_cf_distribution" {
  default_root_object = "index.html"
  enabled             = true

  origin {
    domain_name = aws_s3_bucket.main_bucket.bucket_regional_domain_name
    origin_id   = "main_s3_origin"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "main_s3_origin"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
