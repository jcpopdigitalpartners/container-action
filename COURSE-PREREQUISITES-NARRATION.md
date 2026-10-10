# Narration recording

Audio: `public/audio/course-prerequisites.mp3` (03:31). The script below is editorial reference; cue alignment has not been word-verified.

# Course Prerequisites

Before we begin, there's one practical question worth answering.

**Can your computer support the work we're about to do?**

In this course, we'll begin with a small containerized application. Then we'll introduce more demanding environments: a local Kubernetes cluster, multiple API replicas, a Postgres-QL database, Valkey for shared state, and tools for observing performance and recovery.

That progression requires more computing resources than running a single container.

And we don't want to confuse an under-resourced machine with a poorly performing application.

So, before installing anything, let's establish what your computer can reasonably handle.

For Modules 0 and 1, our starting targets are four logical CPU cores, eight gigabytes of RAM, and twenty gigabytes of available storage.

That should provide a useful foundation for building images, running containers, and practicing reproducibility.

For the complete course, particularly the Kubernetes and performance labs, I recommend eight logical CPU cores, at least sixteen gigabytes of RAM, and forty gigabytes of free storage.

Thirty-two gigabytes of RAM and additional disk space will give you more room to experiment.

These are **course planning targets, not official minimum requirements for any particular tool**.

[PAUSE 0.6 seconds]

You'll also need to consider your operating system.

We support four environments: Ubuntu or WSL, RHEL or Fedora, macOS, and Windows.

The important distinction is where your Linux containers actually run.

On a native Linux installation, the available resources generally come from the host operating system.

On Windows, we'll use WSL where appropriate. On macOS, a Linux virtual machine provides the container environment.

In either case, the resources available to that Linux environment may be smaller than those reported by your computer.

A laptop with sixteen gigabytes of memory doesn't necessarily provide sixteen gigabytes to its container workloads.

For the Kubernetes labs, we'll also need appropriate virtualization support and a compatible rootless container environment.

[PAUSE 0.6 seconds]

You'll find a short system check on this page.

Select your operating system and inspect the available CPU, memory, and storage. The commands only report information; they don't change your configuration.

Also confirm that you can obtain open-source packages and container images, and that you have the permissions needed to prepare your environment.

If your machine falls below the recommended targets, that doesn't automatically prevent you from beginning.

Modules 0 and 1 are less demanding. You can complete those first, then reconsider your environment before the more resource-intensive labs.

The important thing is to know your constraints before they influence your results.

[PAUSE 0.8 seconds]

When you've finished, you should be able to answer three questions.

What resources does your computer have?

How much of that capacity will actually be available to your container environment?

And what, if anything, might need to change before you reach the Kubernetes labs?

Once you have those answers, you're ready for Module 00.0.

We'll begin by establishing a known-good environment—one we can verify, reproduce, and return to when an experiment doesn't behave as expected.

**That's our starting point.**
