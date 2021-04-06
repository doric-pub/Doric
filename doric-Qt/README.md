# Doric Qt SDK

# V8 Build Info
commit 00afef3c7f78e4643f29721dc84286689b575e98 (HEAD, origin/master, origin/HEAD, master)
Author: Leszek Swirski <leszeks@chromium.org>
Date:   Tue Mar 30 13:18:36 2021 +0200

[sparkplug/ia32] Fix argc clobbering

Fix the InstallBaselineCode path in the InterpreterEntryTrampoline to
restore the clobbered eax (i.e. argc) register.

Bug: v8:11420, chromium:1192459
Change-Id: I97ce5739cf22a08fbb46dbf372ab6276bb802440
Reviewed-on: https://chromium-review.googlesource.com/c/v8/v8/+/2791567
Commit-Queue: Leszek Swirski <leszeks@chromium.org>
Commit-Queue: Victor Gomes <victorgomes@chromium.org>
Auto-Submit: Leszek Swirski <leszeks@chromium.org>
Reviewed-by: Victor Gomes <victorgomes@chromium.org>
Cr-Commit-Position: refs/heads/master@{#73721}