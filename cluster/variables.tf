variable "region" {
  default = "us-east-1"
}

variable "vpc_id" {
  description = "The ID of the existing VPC"
  default     = "<VPC_ID>"
}

variable "private_subnet_ids" {
  description = "The IDs of the private subnets"
  type        = list(string)
  default     = ["<SUBNET_1>", "<SUBNET_2>"]
}
