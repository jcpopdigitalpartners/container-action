# Machine readiness in Module 00.0

- Adds host and guest hardware readiness before toolchain installation, preserving 00.1 install and 00.2 verification.
- Module 0–1 course planning target: 4 logical CPU cores, 8 GB RAM, 20 GB available storage.
- Full course recommended: 8 logical CPU cores, 16–32 GB RAM, 40–80 GB free.
- These are planning targets, not official minimum requirements of kind, Podman, etc.
- OS read-only checks for Ubuntu/WSL, RHEL/Fedora, macOS and Windows.
- Notes cgroup v2 prerequisite for rootless kind, guest allocations and virtual machine overhead.
- Changes the opening Resources learning cue to focus on hardware sufficiency.
- No narration edits, chapter changes or lab answers.

Sources: https://kind.sigs.k8s.io/docs/user/rootless/ ; https://learn.microsoft.com/en-us/windows/wsl/wsl-config ; https://lima-vm.io/docs/
