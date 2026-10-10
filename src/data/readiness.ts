/** Pre-install capacity checks. Planning targets are course guidance, not official product minimums. */
export const readinessChecks = [
  {
    id:'ubuntu', label:'Ubuntu / WSL',
    description:'Use the Linux shell. For WSL, these commands show the resources available inside Ubuntu, not the total Windows host.',
    code:'printf "Logical CPUs: "; nproc\nfree -h\ndf -h "$HOME"\nstat -fc %T /sys/fs/cgroup',
    note:'For rootless kind, the cgroup filesystem should report cgroup2fs. On WSL, compare these results with host specifications and WSL memory limits.'
  },
  {
    id:'rhel-fedora', label:'RHEL / Fedora',
    description:'Check the Linux host before installing Podman and the other OCI tools.',
    code:'printf "Logical CPUs: "; nproc\nfree -h\ndf -h "$HOME"\nstat -fc %T /sys/fs/cgroup',
    note:'For rootless kind, confirm cgroup v2 and suitable systemd delegation. Enterprise policy may also restrict rootless networking or package installation.'
  },
  {
    id:'macos', label:'macOS',
    description:'Check the Mac first. Later, compare these results with the CPU, memory, and disk allocated to the Lima Linux guest.',
    code:'sysctl -n hw.logicalcpu\nsysctl -n hw.memsize\ndf -h "$HOME"',
    note:'hw.memsize prints bytes. The course uses a Lima Linux guest; host resources and guest resources are not the same.'
  },
  {
    id:'windows', label:'Windows',
    description:'Run in PowerShell. Once Ubuntu WSL 2 is installed, check its allocated resources using the Ubuntu / WSL commands.',
    code:'(Get-CimInstance Win32_Processor | Measure-Object NumberOfLogicalProcessors -Sum).Sum\n[math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 1)\nGet-PSDrive C\nwsl --status\nwsl -l -v',
    note:'Windows must support WSL 2 and hardware virtualization. WSL may have a memory cap below total host RAM; inspect it separately.'
  }
];
