import { useEffect, useState, useCallback } from "react";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Bars({ data = [] }) {
  const max = Math.max(
      1,
      ...data.map((d) => Number(d.count))
  );

  return (
      <div className="bars-container">
        {data.length === 0 && (
            <p className="no-data">No data yet</p>
        )}

        {data.map((d) => (
            <div className="bar-row" key={d.name}>
          <span className="bar-label" title={d.name}>
            {d.name}
          </span>

              <div className="bar-track">
                <div
                    className="bar-fill"
                    style={{
                      width: `${(Number(d.count) / max) * 100}%`,
                    }}
                />
              </div>

              <span className="bar-count">
            {d.count}
          </span>
            </div>
        ))}
      </div>
  );
}

export default function App() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [code, setCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(null);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------
  // LOAD ANALYTICS
  // ----------------------------------------

  const loadStats = useCallback(async () => {
    if (!code) {
      return;
    }

    try {
      const res = await fetch(
          `${API}/api/urls/${code}/analytics`
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        throw new Error(
            body.message || "Link not found"
        );
      }

      const data = await res.json();

      setStats(data);
      setUpdated(
          new Date().toLocaleTimeString()
      );
      setError("");
    } catch (e) {
      setError(e.message);
      setStats(null);
    }
  }, [code]);

  // ----------------------------------------
  // AUTO REFRESH
  // ----------------------------------------

  useEffect(() => {
    if (!code) {
      return;
    }

    loadStats();

    const id = setInterval(
        loadStats,
        30000
    );

    return () => clearInterval(id);
  }, [loadStats, code]);

  // ----------------------------------------
  // CREATE SHORT URL
  // ----------------------------------------

  const create = async () => {
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
          `${API}/api/urls`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: url.trim(),
              alias: alias.trim() || null,
              expiresAt : expiresAt
              ? `${expiresAt}:00` : null
            }),
          }
      );

      if (!res.ok) {
        const body =
            await res.json().catch(() => ({}));

        throw new Error(
            body.message ||
            "Failed to create short URL"
        );
      }

      const data = await res.json();

      setCode(data.code);
      setAlias("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // DEACTIVATE
  // ----------------------------------------

  const deactivate = async () => {
    if (!code) {
      return;
    }

    try {
      const res = await fetch(
          `${API}/api/urls/${code}/deactivate`,
          {
            method: "PATCH",
          }
      );

      if (!res.ok) {
        const body =
            await res.json().catch(() => ({}));

        throw new Error(
            body.message ||
            "Failed to deactivate"
        );
      }

      alert("Link deactivated.");

      await loadStats();
    } catch (e) {
      setError(e.message);
    }
  };

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
      <div className="app">

        {/* HEADER */}

        <header className="header">
          <div className="header-content">

            <div className="logo">
              <div className="logo-icon">↗</div>

              <div>
                <h1>Shortly</h1>
                <span>URL Shortener</span>
              </div>
            </div>

            <div className="header-badge">
              Live Analytics
              <span className="status-dot"></span>
            </div>

          </div>
        </header>

        {/* MAIN */}

        <main className="container">

          {/* HERO */}

          <section className="hero">

          <span className="hero-badge">
            SIMPLE • FAST • ANALYTICS
          </span>

            <h2>
              Shorten your URLs.
              <br />
              <span>Track every click.</span>
            </h2>

            <p>
              Create short, shareable links and
              monitor your traffic in real time.
            </p>

          </section>

          {/* CREATE CARD */}

          <section className="card create-card">

            <div className="section-title">
              <div className="title-icon">🔗</div>

              <div>
                <h3>Create Short URL</h3>
                <p>
                  Enter a long URL and create a
                  short link.
                </p>
              </div>
            </div>

            <div className="form">

              <div className="input-group url-input">
                <label>Long URL</label>

                <input
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    value={url}
                    onChange={(e) =>
                        setUrl(e.target.value)
                    }
                />
              </div>

              <div className="input-group alias-input">
                <label>Custom Alias</label>

                <input
                    type="text"
                    placeholder="my-link"
                    value={alias}
                    onChange={(e) =>
                        setAlias(e.target.value)
                    }
                />
              </div>

              <div className="input-group">
                <label>Expire Date &Time</label>
                <input
                type="datetime-local"
                value={expiresAt}
                min={new  Date().toISOString().slice(0,16)}
                onChange={(e)=> setExpiresAt(e.target.value)}
                />
              </div>

              <button
                  className="primary-btn"
                  onClick={create}
                  disabled={loading}
              >
                {loading
                    ? "Creating..."
                    : "Shorten URL"}
              </button>

            </div>

            <div className="existing-link">

              <span>Already have a short code?</span>

              <input
                  type="text"
                  placeholder="Enter code"
                  value={code}
                  onChange={(e) =>
                      setCode(
                          e.target.value.trim()
                      )
                  }
              />

              <button
                  className="secondary-btn"
                  onClick={loadStats}
              >
                View Analytics
              </button>

            </div>

          </section>

          {/* ERROR */}

          {error && (
              <div className="error-box">
                <span>⚠</span>
                {error}
              </div>
          )}

          {/* ANALYTICS */}

          {stats && (

              <section className="analytics-section">

                <div className="analytics-header">

                  <div>
                <span className="section-label">
                  ANALYTICS
                </span>

                    <h2>
                      Link Performance
                    </h2>

                    <a
                        href={`${API}/${stats.code}`}
                        target="_blank"
                        rel="noreferrer"
                        className="short-link"
                    >
                      {API}/{stats.code}
                      <span>↗</span>
                    </a>
                  </div>

                  <button
                      className="danger-btn"
                      onClick={deactivate}
                  >
                    Deactivate
                  </button>

                </div>

                {/* STAT CARDS */}

                <div className="stats-grid">

                  <div className="stat-card">

                    <div className="stat-icon purple">
                      ↗
                    </div>

                    <div>
                      <span>Total Clicks</span>

                      <strong>
                        {stats.totalClicks}
                      </strong>
                    </div>

                  </div>

                  <div className="stat-card">

                    <div className="stat-icon blue">
                      👤
                    </div>

                    <div>
                      <span>Unique Visitors</span>

                      <strong>
                        {stats.uniqueVisitors}
                      </strong>
                    </div>

                  </div>

                  <div className="stat-card">

                    <div className="stat-icon green">
                      🌍
                    </div>

                    <div>
                      <span>Countries</span>

                      <strong>
                        {stats.topCountries?.length || 0}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* QR + LAST UPDATED */}

                <div className="qr-card">

                  <div>

                <span className="section-label">
                  QUICK SHARE
                </span>

                    <h3>
                      Scan to open
                    </h3>

                    <p>
                      Share this QR code with
                      anyone you want.
                    </p>

                    <span className="updated">
                  ● Updated {updated}
                </span>

                  </div>

                  <div className="qr-wrapper">

                    <img
                        src={`${API}/api/urls/${stats.code}/qr?size=180`}
                        alt="QR Code"
                    />

                  </div>

                </div>

                {/* CHARTS */}

                <div className="charts-grid">

                  <div className="chart-card">

                    <div className="chart-header">
                      <div>
                        <h3>Top Countries</h3>
                        <p>
                          Where your visitors are
                          coming from
                        </p>
                      </div>

                      <span>🌍</span>
                    </div>

                    <Bars
                        data={stats.topCountries}
                    />

                  </div>

                  <div className="chart-card">

                    <div className="chart-header">
                      <div>
                        <h3>Top Referrers</h3>
                        <p>
                          Where visitors came from
                        </p>
                      </div>

                      <span>🔗</span>
                    </div>

                    <Bars
                        data={stats.topReferrers}
                    />

                  </div>

                </div>

                {/* LAST 7 DAYS */}

                <div className="chart-card full-chart">

                  <div className="chart-header">

                    <div>
                      <h3>Clicks — Last 7 Days</h3>

                      <p>
                        Daily click activity
                      </p>
                    </div>

                    <span>📊</span>

                  </div>

                  <Bars
                      data={Object.entries(
                          stats.clicksLast7Days || {}
                      ).map(
                          ([name, count]) => ({
                            name,
                            count,
                          })
                      )}
                  />

                </div>

              </section>

          )}

        </main>

        {/* FOOTER */}

        <footer>
          <p>
            Built with React + Spring Boot
          </p>
        </footer>

      </div>
  );
}