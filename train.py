"""
train.py — A neural network from scratch in pure NumPy.
1) build data  2) forward pass  3) backprop (checked against finite differences)
4) gradient descent  5) PCA of the trajectory  6) evaluate the loss landscape
Outputs: data.js (for the web page) and landscape.png (Matplotlib).
"""
import json
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(7)

# ---------- 1. DATA: two interleaved moons (not linearly separable) ----------
def make_moons(n=400, noise=0.18):
    t = rng.uniform(0, np.pi, n // 2)
    a = np.c_[np.cos(t), np.sin(t)]
    b = np.c_[1 - np.cos(t), 0.5 - np.sin(t)]
    X = np.r_[a, b] + rng.normal(0, noise, (n, 2))
    y = np.r_[np.zeros(n // 2), np.ones(n // 2)][:, None]
    return X, y

X, y = make_moons()

# ---------- 2. NETWORK: 2 -> 16 -> 16 -> 1, all parameters in ONE vector ----------
# A flat vector θ lets us treat the network as a point in R^337,
# which is exactly what we need to slice the loss landscape later.
SHAPES = [(2, 16), (16,), (16, 16), (16,), (16, 1), (1,)]
SIZES = [int(np.prod(s)) for s in SHAPES]

def unpack(th):
    out, i = [], 0
    for s, k in zip(SHAPES, SIZES):
        out.append(th[i:i + k].reshape(s))
        i += k
    return out

def init():
    parts = []
    for s in SHAPES:
        if len(s) == 2:   # Xavier init: keeps tanh activations out of saturation
            parts.append(rng.normal(0, np.sqrt(1 / s[0]), s).ravel())
        else:
            parts.append(np.zeros(s))
    return np.concatenate(parts)

def loss_grad(th, X, y, need_grad=True):
    W1, b1, W2, b2, W3, b3 = unpack(th)
    n = len(X)
    # forward
    h1 = np.tanh(X @ W1 + b1)
    h2 = np.tanh(h1 @ W2 + b2)
    z = h2 @ W3 + b3
    p = 1 / (1 + np.exp(-z))
    eps = 1e-12
    L = -np.mean(y * np.log(p + eps) + (1 - y) * np.log(1 - p + eps))  # binary cross-entropy
    if not need_grad:
        return L, p
    # ---------- 3. BACKPROP: chain rule, from the loss back to each weight ----------
    dz = (p - y) / n                       # sigmoid + BCE simplify to (p - y)
    dW3 = h2.T @ dz;  db3 = dz.sum(0)
    dh2 = (dz @ W3.T) * (1 - h2 ** 2)      # tanh'(x) = 1 - tanh(x)^2
    dW2 = h1.T @ dh2; db2 = dh2.sum(0)
    dh1 = (dh2 @ W2.T) * (1 - h1 ** 2)
    dW1 = X.T @ dh1;  db1 = dh1.sum(0)
    return L, np.concatenate([g.ravel() for g in (dW1, db1, dW2, db2, dW3, db3)])

def grad_check(th, k=12, h=1e-5):
    """Compare analytic gradient with central finite differences."""
    _, g = loss_grad(th, X, y)
    worst = 0
    for i in rng.choice(th.size, k, replace=False):
        e = np.zeros_like(th); e[i] = h
        num = (loss_grad(th + e, X, y, False)[0] - loss_grad(th - e, X, y, False)[0]) / (2 * h)
        worst = max(worst, abs(num - g[i]) / max(1e-8, abs(num) + abs(g[i])))
    return worst

# ---------- 4. GRADIENT DESCENT: θ ← θ − η ∇L(θ) ----------
th = init()
print(f"parameters: {th.size} | grad-check relative error: {grad_check(th):.2e}")  # ~1e-9 expected

lr, epochs = 0.8, 1500
traj, hist = [th.copy()], []
for t in range(epochs):
    L, g = loss_grad(th, X, y)
    hist.append(L)
    th -= lr * g
    if t % 10 == 0:
        traj.append(th.copy())
traj.append(th.copy())
traj = np.array(traj)
acc = float(np.mean((loss_grad(th, X, y, False)[1] > 0.5) == y))
print(f"final loss {hist[-1]:.4f} | accuracy {acc:.1%}")

# ---------- 5. PCA OF THE TRAJECTORY ----------
# We can't plot 337 dimensions. The two principal directions of
# (θ_t − θ*) are the plane in which the optimizer moved the most.
D = traj - th
_, S, Vt = np.linalg.svd(D, full_matrices=False)
d1, d2 = Vt[0], Vt[1]
evr = (S[:2] ** 2 / np.sum(S ** 2)).tolist()
P = D @ np.stack([d1, d2]).T            # path coordinates (α, β)

def span(v, pad=0.35, n=41):
    lo, hi = v.min(), v.max()
    r = hi - lo
    return np.linspace(lo - pad * r, hi + pad * r, n)

a, b = span(P[:, 0]), span(P[:, 1])

# ---------- 6. LANDSCAPE: L(θ* + α d1 + β d2) on a grid ----------
Z = np.array([[loss_grad(th + ai * d1 + bj * d2, X, y, False)[0] for ai in a] for bj in b])
pathL = np.array([loss_grad(th + pa * d1 + pb * d2, X, y, False)[0] for pa, pb in P])

# ---------- EXPORT FOR THE WEB PAGE ----------
r = lambda v, k=4: np.round(np.asarray(v), k).tolist()
payload = dict(a=r(a), b=r(b), Z=r(Z), path=r(np.c_[P, pathL]),
               hist=r(hist[::5]), acc=round(acc, 4), evr=r(evr), n_params=int(th.size))
with open("data.js", "w") as f:
    f.write("window.LANDSCAPE=" + json.dumps(payload) + ";")

# ---------- MATPLOTLIB ----------
A, B = np.meshgrid(a, b)
fig = plt.figure(figsize=(14, 6), facecolor="black")
ax = fig.add_subplot(1, 2, 1, projection="3d", facecolor="black")
ax.plot_surface(A, B, Z, cmap="viridis", alpha=0.9, linewidth=0, antialiased=True)
ax.plot(P[:, 0], P[:, 1], pathL + 0.01, color="#ff2d75", lw=3, zorder=10)
ax.scatter(P[-1, 0], P[-1, 1], pathL[-1], color="gold", marker="*", s=250, zorder=11)
ax.set_xlabel(f"PC1 direction α ({evr[0]:.0%})", color="w")
ax.set_ylabel(f"PC2 direction β ({evr[1]:.0%})", color="w")
ax.set_zlabel("Train loss L(θ* + αδ₁ + βδ₂)", color="w")
ax.tick_params(colors="w")

ax2 = fig.add_subplot(1, 2, 2, facecolor="black")
cs = ax2.contourf(A, B, Z, levels=30, cmap="viridis")
ax2.contour(A, B, Z, levels=30, colors="k", linewidths=0.3)
ax2.plot(P[:, 0], P[:, 1], color="#ff2d75", lw=2.5)
ax2.scatter(*P[0], color="white", s=60, zorder=5, label="start")
ax2.scatter(*P[-1], color="gold", marker="*", s=250, zorder=5, label="θ*")
ax2.set_xlabel("α (PC1)", color="w"); ax2.set_ylabel("β (PC2)", color="w")
ax2.tick_params(colors="w"); ax2.legend()
fig.colorbar(cs, ax=ax2).ax.tick_params(colors="w")
plt.tight_layout()
plt.savefig("landscape.png", dpi=150, facecolor="black")
plt.show()
