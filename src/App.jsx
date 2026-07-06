import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);
  const summaryRef = useRef(null);

  const fetchGithubData = async () => {
    if (!username) return;
    setLoading(true);
    setError('');
    setData(null);
    setSlideIndex(0);

    try {
      const res = await fetch(`http://localhost:3001/api/github/${username}`);
      if (!res.ok) throw new Error('User not found');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSlides = () => {
    if (!data) return [];

    const topLanguage = Object.entries(data.languageCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return [
      {
        key: 'intro',
        theme: 'theme-purple',
        content: (
          <>
            <motion.img
              src={data.avatar}
              alt={data.username}
              className="avatar"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            />
            <motion.p
              className="intro-name"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {data.name || data.username}
            </motion.p>
            <motion.h1
              className="highlight intro-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              GitHub Wrapped
            </motion.h1>
          </>
        ),
      },
      {
        key: 'repos',
        theme: 'theme-green',
        emoji: '🚀',
        content: (
          <>
            <motion.div
              className="emoji-badge"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 250 }}
            >
              🚀
            </motion.div>
            <p className="label">You've built</p>
            <motion.h1
              className="big-number"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {data.publicRepos}
            </motion.h1>
            <p className="label">public repositories</p>
          </>
        ),
      },
      {
        key: 'language',
        theme: 'theme-orange',
        content: (
          <>
            <motion.div
              className="emoji-badge"
              initial={{ scale: 0, rotate: 20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 250 }}
            >
              💻
            </motion.div>
            <p className="label">Your most-used language was</p>
            <motion.h1
              className="highlight"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {topLanguage ? topLanguage[0] : 'N/A'}
            </motion.h1>
            <p className="label">
              across {topLanguage ? topLanguage[1] : 0} repos
            </p>
          </>
        ),
      },
      {
        key: 'languageChart',
        theme: 'theme-orange',
        content: (() => {
          const chartData = Object.entries(data.languageCounts).map(([name, value]) => ({
            name,
            value,
          }));
          const COLORS = ['#f97316', '#fb923c', '#fbbf24', '#f59e0b', '#ea580c', '#c2410c'];

          return (
            <>
              <p className="label">Your language breakdown</p>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                {chartData.map((entry, index) => (
                  <div key={entry.name} className="legend-item">
                    <span
                      className="legend-dot"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    {entry.name} ({entry.value})
                  </div>
                ))}
              </div>
            </>
          );
        })(),
      },
      {
        key: 'toprepo',
        theme: 'theme-pink',
        content: (
          <>
            <motion.div
              className="emoji-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 250 }}
            >
              ⭐
            </motion.div>
            <p className="label">Your top repo</p>
            <motion.h1
              className="highlight"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {data.topRepo?.name}
            </motion.h1>
            <p className="label">{data.topRepo?.stars} stars</p>
          </>
        ),
      },
      {
        key: 'summary',
        theme: 'theme-blue',
        content: (
          <>
            <motion.img
              src={data.avatar}
              alt={data.username}
              className="avatar-small"
              crossOrigin="anonymous"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
            <h2>{data.name || data.username}</h2>
            <p className="label">
              {data.publicRepos} repos · {data.followers} followers
            </p>
            <p className="label">Thanks for using GitHub Wrapped! 🎉</p>
          </>
        ),
      },
    ];
  };

  const slides = getSlides();

  const nextSlide = () => {
    if (slideIndex < slides.length - 1) setSlideIndex(slideIndex + 1);
  };

  const prevSlide = () => {
    if (slideIndex > 0) setSlideIndex(slideIndex - 1);
  };

  const downloadSummary = async () => {
    if (!summaryRef.current) return;
    try {
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: false,
      });
      const link = document.createElement('a');
      link.download = `${data.username}-github-wrapped.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    }
  };

  return (
    <div className="app">
      {!data && (
        <div className="input-screen">
          <div className="bg-shape shape-1"></div>
          <div className="bg-shape shape-2"></div>
          <div className="bg-shape shape-3"></div>

          <div className="input-content">
            <span className="badge">✨ your year in code</span>
            <h1 className="landing-title">
              GitHub <span className="highlight">Wrapped</span>
            </h1>
            <p className="landing-subtitle">
              See your coding year, wrapped up like a story
            </p>

            <div className="input-row">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username"
                onKeyDown={(e) => e.key === 'Enter' && fetchGithubData()}
              />
              <button onClick={fetchGithubData}>Generate →</button>
            </div>

            {loading && <p className="loading-text">Pulling your stats...</p>}
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}

      {data && (
        <div className="slide-container" onClick={nextSlide}>
          <div className="progress-bar">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`progress-segment ${i <= slideIndex ? 'filled' : ''}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={slides[slideIndex].key}
              ref={slideIndex === slides.length - 1 ? summaryRef : null}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`slide ${slides[slideIndex].theme}`}
            >
              <div className="slide-shape shape-a"></div>
              <div className="slide-shape shape-b"></div>
              <div className="slide-shape shape-c"></div>
              <div className="slide-content">{slides[slideIndex].content}</div>
            </motion.div>
          </AnimatePresence>

          <div className="nav-buttons">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              disabled={slideIndex === 0}
            >
              ← Back
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setData(null);
                setUsername('');
              }}
            >
              Start Over
            </button>
            {slideIndex === slides.length - 1 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadSummary();
                }}
                className="download-btn"
              >
                ⬇ Download
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
