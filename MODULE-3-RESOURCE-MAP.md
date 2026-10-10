# Module 3 — Contextual Resource Map

These external videos supplement the narrated course; none constitutes a required tool or complete lab solution.

The Module 3 narration is drafted but not recorded. The module page provides a resource-led preview.

## 3.0 — When a working system fails
**Learning question:** If an API Pod disappears, which parts of the system can actually recover?
**Watch:** [Automating Chaos with LitmusChaos](https://www.youtube.com/watch?v=618rXhCp03Y) — Optional perspective: observe how engineers define failure experiments before asserting resilience.
**Read:** [Pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/) — Understand why Pod replacement and process restart are different events.
**Read:** [Principles of chaos engineering](https://principlesofchaos.org/) — Frame experiments around hypotheses and measured behavior.
**Pause & explore:** Sketch three failure consequences: an interrupted request, a replacement Pod, and an unavailable datastore.
**If stuck:** Compare requests and database behavior from the client perspective. Ready is one signal, not a complete recovery test.

## 3.1 — What survives a replacement?
**Learning question:** What state disappears with a Pod—and what should survive?
**Watch:** [Kubernetes Pods — Restart Policy, Lifecycle and kubectl Inspection](https://www.youtube.com/watch?v=x51DTa8_sY4) — Watch for: lifecycle transitions, inspectable events, and why restart behavior does not prove data durability.
**Read:** [Pod lifecycle and restart policy](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/) — Reference for Pod states and container restarts.
**Read:** [Kubernetes volumes overview](https://kubernetes.io/docs/concepts/storage/volumes/) — Distinguish ephemeral volumes from durable storage.
**Pause & explore:** Before removing anything, identify which values come from the image, environment, process memory, and persistent storage.
**If stuck:** Separate memory, writable layers, ephemeral volumes, and PersistentVolumeClaims. Compare where the record was stored.

## 3.2 — Give data a lifecycle of its own
**Learning question:** If the database Pod moves, where is its data actually stored?
**Watch:** [Kubernetes Volumes: PV, PVC and StorageClass](https://www.youtube.com/watch?v=0swOh5C3OVM&t=543s) — Start at 09:03 for the claim abstraction; return to 17:12 for dynamic provisioning.
**Read:** [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) — PV/PVC behavior, access modes, and reclaim policies.
**Read:** [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) — Understand stable identity and storage associations.
**Pause & explore:** Trace the relationship: database container → mounted volume → claim → volume → underlying storage.
**If stuck:** Inspect the StorageClass, provisioner, access mode, reclaim policy, and physical backing. Bound is not the same as redundant.

## 3.3 — Persistence is not a backup
**Learning question:** What evidence shows that the backup can restore useful data?
**Watch:** [PostgreSQL Backup: pg_dump and pg_restore](https://www.youtube.com/watch?v=BZ73M-vU4g4&t=697s) — Watch the destructive change and restoration demonstration from around 11:37; do not copy commands blindly.
**Read:** [PostgreSQL SQL dump backup](https://www.postgresql.org/docs/current/backup-dump.html) — Official logical backup mechanisms and limitations.
**Read:** [PostgreSQL backup approaches](https://www.postgresql.org/docs/current/backup.html) — Compare SQL dumps, filesystem backups, and WAL archiving.
**Pause & explore:** Design a disposable target database and a known record-count check. Predict what a backup cannot undo about a subsequent bad write.
**If stuck:** Treat a file as unverified until it is restored to a separate environment and inspected. Check dump format and tool compatibility.

## 3.4 — Healthy, ready and alive
**Learning question:** When should Kubernetes remove a Pod from traffic instead of restarting it?
**Watch:** [Kubernetes Probes Explained: Liveness, Readiness, Startup](https://www.youtube.com/watch?v=8quZUZWm4oM) — Focus on which signal controls traffic eligibility and which one can restart a container.
**Read:** [Configure health probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) — Canonical definitions and probe configuration behavior.
**Read:** [Debug running Pods](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/) — Events and Pod conditions for diagnosing probe failures.
**Pause & explore:** Predict behavior for three conditions: slow startup, temporary database failure, and unrecoverable deadlock.
**If stuck:** Readiness does not, by itself, restart the container. Examine probe type, events, and configured thresholds.

## 3.5 — Give requests time to finish
**Learning question:** What happens to a request that is in flight when its Pod begins terminating?
**Watch:** [Stop Losing Requests! Graceful Shutdown Techniques](https://www.youtube.com/watch?v=eQPYsGrZW_E&t=673s) — Begin at 11:13 for Kubernetes-specific termination behavior; implementation examples are optional.
**Read:** [Pod termination lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#termination-of-pods) — Termination grace period and preStop semantics.
**Read:** [EndpointSlice terminating endpoints](https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/#conditions) — Understand ready, serving, and terminating conditions.
**Pause & explore:** Compare a short request, a long-running request, and an abrupt kill. Predict which ones can finish in the grace period.
**If stuck:** Consider open connections and delayed convergence; inspect endpoint conditions and app signal handling.

## 3.6 — Deploy without creating an incident
**Learning question:** How can a new release fail without taking the whole Service down?
**Watch:** [Kubernetes Rolling Updates & Rollbacks](https://www.youtube.com/watch?v=wWA9JgAvuqw&t=57s) — Watch 00:57 rolling update, 03:36 rollback, then 07:11 revision history.
**Read:** [Kubernetes Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) — RollingUpdate behavior, progress deadlines, and revision history.
**Read:** [Perform a rolling update](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/) — Short conceptual refresher before the investigation.
**Pause & explore:** Predict the rollout when new Pods stay unready. Observe the relationship between desired replicas, available replicas, and revision history.
**If stuck:** Rollbacks change the Deployment Pod template; they do not automatically reverse schema migrations or restore deleted data.

## 3.7 — Break it deliberately
**Learning question:** What failure would best reveal a weakness in the system?
**Watch:** [Kubernetes Chaos Engineering: Pod Delete Experiment](https://www.youtube.com/watch?v=6oOz2-Hh9GQ&t=570s) — Jump to 09:30 for the Pod Delete experiment; tool-specific installation is optional and not required for the lab.
**Read:** [Debug Pods](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/) — Practical events and container diagnostics.
**Read:** [Principles of chaos engineering](https://principlesofchaos.org/) — Define a hypothesis and control the blast radius.
**Pause & explore:** Choose a fault and a prediction, then list evidence from the client, controller, and datastore points of view.
**If stuck:** A single-node cluster can show controller-level recovery, but cannot prove node or storage high availability.

## 3.8 — Checkpoint 3: Prove recovery
**Learning question:** Could another engineer reproduce your failure and verify the recovery?
**Watch:** [Kubernetes Chaos Engineering — Validation and Recap](https://www.youtube.com/watch?v=6oOz2-Hh9GQ&t=1020s) — At 17:00 the author validates the fault experiment. Compare the video’s observations with your own evidence.
**Read:** [Debug running Pods](https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/) — A practical checklist for evidence collection.
**Read:** [PostgreSQL backup and restore](https://www.postgresql.org/docs/current/backup.html) — Revisit the distinction between surviving storage and recoverable data.
**Pause & explore:** Assemble five artifacts: failure hypothesis, baseline, observation, recovery action, and independent functional verification.
**If stuck:** Add a client-side functional test, the restored record validation, and precise limits of the local cluster.
