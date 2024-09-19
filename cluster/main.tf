locals {
  cluster_name = "arc-test-praj"
  tags = {
    Environment = "dev"
    Project     = "arc-test-praj"
  }
}

module "eks" {
  source                         = "terraform-aws-modules/eks/aws"
  cluster_name                   = local.cluster_name
  cluster_version                = "1.30"
  cluster_endpoint_public_access = true
  cluster_addons = {
    coredns                = {}
    eks-pod-identity-agent = {}
    kube-proxy             = {}
    vpc-cni                = {}
  }
  subnet_ids = var.private_subnet_ids
  vpc_id     = var.vpc_id

  eks_managed_node_groups = {
    default-ng = {
      desired_capacity = 2
      max_capacity     = 5
      min_capacity     = 1
      instance_types   = ["t3.xlarge"]
      subnet_ids       = var.private_subnet_ids

      taints = {
        addons = {
          key    = "CriticalAddonsOnly"
          value  = "true"
          effect = "NO_SCHEDULE"
        },
      }
    }
  }

  node_security_group_tags = merge(local.tags, {
    # NOTE - if creating multiple security groups with this module, only tag the
    # security group that Karpenter should utilize with the following tag
    # (i.e. - at most, only one security group should have this tag in your account)
    "karpenter.sh/discovery" = local.cluster_name
  })

  enable_cluster_creator_admin_permissions = true

  tags = local.tags
}
