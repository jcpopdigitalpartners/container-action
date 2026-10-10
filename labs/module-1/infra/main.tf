terraform {
  required_version = ">= 1.8.0"
}

variable "environment" {
  description = "Disposable lab environment name; use dev or staging"
  type        = string
  default     = "dev"
  validation {
    condition     = contains(["dev", "staging"], var.environment)
    error_message = "Set environment to dev or staging."
  }
}
variable "host_port" {
  description = "API HTTP port published on the host"
  type        = number
  default     = 3000
}
variable "image" {
  description = "Locally built OCI image"
  type        = string
  default     = "course-api:v1"
}

# This deliberately small course integration is a CLI-backed reproducibility
# exercise. terraform_data tracks the bootstrap action, NOT independent
# container resources. It does not detect drift in individual Podman objects.
resource "terraform_data" "lab_stack" {
  input = {
    environment = var.environment
    port        = var.host_port
    image       = var.image
  }
  triggers_replace = [var.environment, var.host_port, var.image]
  provisioner "local-exec" {
    command = "${path.module}/scripts/up.sh"
    environment = {
      LAB_ENV  = self.input.environment
      LAB_PORT = tostring(self.input.port)
      LAB_IMAGE = self.input.image
    }
  }
  provisioner "local-exec" {
    when    = destroy
    command = "${path.module}/scripts/down.sh"
    environment = {
      LAB_ENV = self.input.environment
    }
  }
}
output "api_url" {
  value = "http://localhost:${var.host_port}"
}
output "persistent_volume" {
  value = "course-${var.environment}-data"
}
