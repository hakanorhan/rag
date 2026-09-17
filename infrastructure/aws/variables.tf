variable "floci_endpoint" {
  description = "Floci API endpoint."
  type        = string
  default     = "http://127.0.0.1:4566"
}

variable "aws_region" {
  description = "Simulated AWS region."
  type        = string
  default     = "eu-central-1"
}

variable "bucket_name" {
  description = "S3 bucket name."
  type        = string
  default     = "rag-storage-dev"
}