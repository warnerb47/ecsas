# Firewall troubleshooting for P2P transfer (port 34567)

The P2P transfer feature runs a short-lived local HTTP server on the desktop
machine bound to `0.0.0.0:34567`. For the phone to reach it, inbound TCP
traffic on that port must be allowed. This guide covers the most common cause
of "the QR code shows but the phone cannot load the page".

## Symptoms

- The QR code displays fine in the desktop app.
- Scanning it with the phone opens the browser but the page never loads:
  "This site can't be reached", "Connection refused", or a long timeout.
- The upload page loads but clicking **Envoyer** shows
  "Échec de connexion. Vérifiez le réseau."

These symptoms almost always mean the phone cannot reach the desktop machine.
Causes: Windows Firewall, network type (Public vs Private), AP/client
isolation on the router, wrong IP, or the server not actually running.

## 1. Rule out non-firewall causes first

Check these before touching the firewall:

| Check | How |
| ----- | --- |
| Both devices on the **same network** | Phone connected to the same Wi-Fi, not mobile data (4G/5G) |
| IP is a real LAN IP (192.168.x.x / 10.x.x.x) | VPNs (Tailscale/OpenVPN), VirtualBox, Hyper-V, WSL adapters can be picked by `local-ip-address`. If the QR URL shows a 172.x/169.x or VPN IP, prefer the Wi-Fi/LAN IP |
| Server is actually listening | On the desktop: `netstat -an | findstr 34567` → should show `0.0.0.0:34567 ... LISTENING` |
| Server still running | The server auto-stops after **5 minutes of inactivity**. Restart the transfer (button in the app) |
| Same Wi-Fi network not isolated | Some routers/APs enable "AP isolation" / "client isolation" which blocks device-to-device traffic by design (see §4) |

If all of the above are fine, the likely culprit is the firewall.

## 2. Does the firewall prompt appear?

When the transfer server starts for the first time, Windows usually shows a
"Windows Security Alert":

> Windows Defender Firewall has blocked some features of this app…
> ☑ Private networks   ☐ Public networks

- **Accept** it (tick **Public networks** too if your Wi-Fi is treated as
  Public) or the port stays blocked.
- If you dismissed it, the port remains blocked; add the rule manually (§3).

## 3. Allow port 34567 in Windows Firewall

### Option A — GUI (Control Panel / wf.msc)

1. `Win+R` → `wf.msc` → **Enter**.
2. Left panel: **Inbound Rules** → right panel: **New Rule…**.
3. **Port** → **Next** → protocol **TCP**, specific local port `34567` → **Next**.
4. **Allow the connection** → **Next**.
5. **Profile**: tick **Domain**, **Private**, **AND Public** → **Next**.
6. Name it `ECSAS transfer (34567)` → **Finish**.

### Option B — Admin PowerShell (one line)

Run PowerShell **as Administrator** and add a rule for both private and public:

```powershell
netsh advfirewall firewall add rule name="ECSAS transfer (34567)" dir=in action=allow protocol=TCP localport=34567 profile=any
```

Remove the rule later if needed:

```powershell
netsh advfirewall firewall delete rule name="ECSAS transfer (34567)"
```

## 4. Still blocked? — Network profile & AP isolation

- **Network profile is Public**: Windows treats Public networks as hostile and
  often blocks inbound traffic. Either tick **Public** in the rule (Option A
  step 5 / Option B uses `profile=any`) or switch the network profile to
  Private (Settings → Network & Internet → Wi-Fi → network properties →
  Network profile → Private).
- **AP/client isolation** (router side): if the phone and desktop are on the
  same Wi-Fi but still can't talk, log into the router (admin page) and
  disable "AP isolation", "Client isolation", or "Guest network — allow access
  to local network". This is not a Windows firewall issue.

## 5. Verify the fix

From **another machine on the same network** (or the phone), test connectivity:

```powershell
Test-NetConnection <desktop-lan-ip> -Port 34567
```

Expected: `TcpTestSucceeded : True`. Then open `http://<desktop-lan-ip>:34567/?token=…` in the browser — the upload page should appear.

From the phone, simply rescan the QR code (the token/link in the app is regenerated each start).

## 6. If a third-party antivirus firewall is installed

Norton/McAfee/Bitdefender/Kaspersky ship their own filters that ignore Windows
Firewall rules:

- Add an inbound **TCP 34567** allow rule in **their** firewall settings, or
- Temporarily disable their firewall to confirm it is the blocker.

## 7. Automating the rule (optional, dev)

The current implementation only documents the firewall requirement (see
`transfer.rs`, `TRANSFER_PORT`). It does **not** create a rule automatically.

If you want the app to add the rule itself, options:

- **Tauri shell plugin**: from the command, run
  `netsh advfirewall firewall add rule ...` with **elevated** privileges
  (requires UAC) via `@tauri-apps/plugin-shell`.
- **Rust std**: `std::process::Command::new("netsh")` launched with
  `runas`/admin elevation.
  > Note: self-elevation from a Tauri command is fragile and prompts UAC every
  > run; documenting the step (as done now) is the recommended approach.