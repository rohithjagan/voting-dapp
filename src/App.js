import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./contract.js";
import VOTING_ABI from "./VotingABI.js";

// ─── Design Tokens ───────────────────────────────────────────
const theme = {
  colors: {
    bg: "#0b0e11",
    surface: "rgba(18, 22, 26, 0.85)",
    border: "rgba(55, 65, 81, 0.6)",
    textPrimary: "#e2e8f0",
    textSecondary: "#94a3b8",
    accent: "#2dd4bf",
    accentHover: "#14b8a6",
    success: "#34d399",
    error: "#f87171",
    btnPrimaryBg: "#1f2937",
    btnHoverBg: "#374151",
    inputBg: "#1a1e24",
  },
  spacing: (n) => `${n * 4}px`,
  radius: "10px",
  shadow: "0 4px 12px rgba(0,0,0,0.4)",
  transition: "all 0.2s ease",
  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

// ─── Shared Styles ───────────────────────────────────────────
const styles = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: theme.colors.bg,
    color: theme.colors.textPrimary,
    fontFamily: theme.font,
    minHeight: "100vh",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: theme.spacing(6),
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(8),
    flexWrap: "wrap",
    gap: theme.spacing(4),
  },
  logo: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: theme.colors.textPrimary,
  },
  connectBtn: {
    background: theme.colors.accent,
    color: "#0b0e11",
    border: "none",
    padding: `${theme.spacing(2.5)} ${theme.spacing(6)}`,
    borderRadius: theme.radius,
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: theme.transition,
    backdropFilter: "blur(8px)",
  },
  card: {
    background: theme.colors.surface,
    backdropFilter: "blur(10px)",
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius,
    padding: theme.spacing(6),
    marginBottom: theme.spacing(6),
    boxShadow: theme.shadow,
    transition: theme.transition,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    margin: `0 0 ${theme.spacing(4)} 0`,
    color: theme.colors.textPrimary,
  },
  button: {
    background: theme.colors.btnPrimaryBg,
    color: theme.colors.textPrimary,
    border: "none",
    padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
    borderRadius: theme.radius,
    fontWeight: 500,
    cursor: "pointer",
    transition: theme.transition,
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  input: {
    background: theme.colors.inputBg,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius,
    padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
    color: theme.colors.textPrimary,
    fontSize: 14,
    outline: "none",
    transition: theme.transition,
    width: "100%",
    boxSizing: "border-box",
  },
  candidateItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
    background: "rgba(255,255,255,0.02)",
    borderRadius: theme.radius,
    marginBottom: theme.spacing(2),
    transition: theme.transition,
  },
  voteCount: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginRight: theme.spacing(4),
  },
  message: (isError) => ({
    padding: theme.spacing(3),
    borderRadius: theme.radius,
    marginTop: theme.spacing(4),
    background: isError ? "rgba(248,113,113,0.1)" : "rgba(45,212,191,0.1)",
    color: isError ? theme.colors.error : theme.colors.success,
    fontSize: 14,
    fontWeight: 500,
  }),
  skeleton: {
    height: 48,
    background: "linear-gradient(90deg, #1a1e24 25%, #232830 50%, #1a1e24 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: theme.radius,
    marginBottom: theme.spacing(2),
  },
};

// ─── App Component ──────────────────────────────────────────
function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isAdmin, setIsAdmin] = useState(false);
  const [newCandidateName, setNewCandidateName] = useState("");
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const initializedRef = useRef(false);

  // Connect MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      setMessage({ text: "Please install MetaMask!", isError: true });
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  // Initialize contract once when account is available
  useEffect(() => {
    if (!account || initializedRef.current) return;

    const setup = async () => {
      setCandidatesLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const votingContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        VOTING_ABI,
        signer
      );
      setContract(votingContract);

      // Check admin
      const adminAddr = await votingContract.admin();
      setIsAdmin(adminAddr.toLowerCase() === account.toLowerCase());

      // Fetch candidates
      const list = await votingContract.getCandidates();
      setCandidates(list);
      setCandidatesLoading(false);

      // Listen for Vote events
      votingContract.on("Voted", (voter, candidateId) => {
        loadCandidates(votingContract);
      });

      // Listen for CandidateAdded events
      votingContract.on("CandidateAdded", (candidateId, name) => {
        loadCandidates(votingContract);
      });

      initializedRef.current = true;
    };

    setup();

    return () => {
      if (contract) contract.removeAllListeners();
    };
  }, [account]);

  const loadCandidates = async (votingContract = contract) => {
    if (!votingContract) return;
    try {
      const list = await votingContract.getCandidates();
      setCandidates(list);
    } catch (err) {
      console.error("Failed to load candidates:", err);
    }
  };

  // Vote for a candidate
  const vote = async (candidateId) => {
    if (!contract) return;
    setLoading(true);
    setMessage({ text: "", isError: false });
    try {
      const tx = await contract.vote(candidateId, {
        gasPrice: ethers.parseUnits("30", "gwei"),
      });
      await tx.wait();
      setMessage({ text: "Vote cast successfully!", isError: false });
      loadCandidates();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Error: " + (err.reason || err.message), isError: true });
    }
    setLoading(false);
  };

  // Admin: add candidate
  const addCandidate = async () => {
    if (!contract || !newCandidateName.trim()) return;
    setLoading(true);
    setMessage({ text: "", isError: false });
    try {
      const tx = await contract.addCandidate(newCandidateName.trim(), {
        gasPrice: ethers.parseUnits("30", "gwei"),
      });
      await tx.wait();
      setMessage({ text: `Candidate "${newCandidateName.trim()}" added!`, isError: false });
      setNewCandidateName("");
      loadCandidates();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Error: " + (err.reason || err.message), isError: true });
    }
    setLoading(false);
  };

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handler = (accounts) => {
      setAccount(accounts[0] || null);
      initializedRef.current = false;
    };
    window.ethereum.on("accountsChanged", handler);
    return () => window.ethereum.removeListener("accountsChanged", handler);
  }, []);

  // ─── Render ──────────────────────────────────────────────
  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>Voting dApp</div>
          {account && (
            <div style={{ display: "flex", gap: theme.spacing(4), alignItems: "center", flexWrap: "wrap" }}>
              <div
                style={{
                  padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
                  background: theme.colors.surface,
                  borderRadius: theme.radius,
                  border: `1px solid ${theme.colors.border}`,
                  fontSize: 14,
                  color: theme.colors.textSecondary,
                  backdropFilter: "blur(8px)",
                }}
              >
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
              <button
                style={styles.button}
                onClick={() => loadCandidates()}
                disabled={loading}
                onMouseEnter={(e) => (e.target.style.background = theme.colors.btnHoverBg)}
                onMouseLeave={(e) => (e.target.style.background = theme.colors.btnPrimaryBg)}
              >
                Refresh
              </button>
            </div>
          )}
        </header>

        {!account ? (
          <div style={{ textAlign: "center", marginTop: 120 }}>
            <button
              style={styles.connectBtn}
              onClick={connectWallet}
              onMouseEnter={(e) => (e.target.style.background = theme.colors.accentHover)}
              onMouseLeave={(e) => (e.target.style.background = theme.colors.accent)}
            >
              Connect Wallet
            </button>
            <p style={{ color: theme.colors.textSecondary, marginTop: theme.spacing(4), fontSize: 14 }}>
              Connect your MetaMask to start voting
            </p>
          </div>
        ) : (
          <main>
            {/* Admin Panel */}
            {isAdmin && (
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>Admin Panel</h2>
                <div style={{ display: "flex", gap: theme.spacing(4), flexWrap: "wrap" }}>
                  <input
                    type="text"
                    placeholder="Candidate name"
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    disabled={loading}
                    style={{ ...styles.input, flex: 1, minWidth: 200 }}
                    onFocus={(e) => (e.target.style.borderColor = theme.colors.accent)}
                    onBlur={(e) => (e.target.style.borderColor = theme.colors.border)}
                  />
                  <button
                    style={{
                      ...styles.button,
                      background: theme.colors.accent,
                      color: "#0b0e11",
                      fontWeight: 600,
                    }}
                    onClick={addCandidate}
                    disabled={loading || !newCandidateName.trim()}
                    onMouseEnter={(e) => (e.target.style.background = theme.colors.accentHover)}
                    onMouseLeave={(e) => (e.target.style.background = theme.colors.accent)}
                  >
                    Add Candidate
                  </button>
                </div>
              </div>
            )}

            {/* Candidates Section */}
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Candidates</h2>
              {candidatesLoading ? (
                // Skeleton Loader
                <>
                  {[1, 2, 3].map((n) => (
                    <div key={n} style={styles.skeleton} />
                  ))}
                </>
              ) : candidates.length === 0 ? (
                // Empty State
                <div style={{ textAlign: "center", padding: theme.spacing(8), color: theme.colors.textSecondary }}>
                  <p style={{ fontSize: 18, marginBottom: theme.spacing(2) }}>No candidates yet</p>
                  <p style={{ fontSize: 14 }}>
                    {isAdmin ? "Add a candidate using the admin panel above." : "Check back later."}
                  </p>
                </div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {candidates.map((c) => (
                    <li key={c.id.toString()} style={styles.candidateItem}>
                      <div>
                        <span style={{ fontWeight: 500 }}>{c.name}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: theme.spacing(4) }}>
                        <span style={styles.voteCount}>{c.voteCount.toString()} votes</span>
                        <button
                          style={{
                            ...styles.button,
                            background: theme.colors.accent + "1a",
                            color: theme.colors.accent,
                            border: `1px solid ${theme.colors.accent}40`,
                          }}
                          onClick={() => vote(c.id)}
                          disabled={loading}
                          onMouseEnter={(e) => {
                            e.target.style.background = theme.colors.accent + "30";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = theme.colors.accent + "1a";
                          }}
                        >
                          Vote
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Transaction Message */}
            {message.text && (
              <div style={styles.message(message.isError)}>
                {message.text}
              </div>
            )}
          </main>
        )}
      </div>

      {/* Shimmer animation for skeletons */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

export default App;