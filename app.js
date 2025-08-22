const { useState, useEffect } = React;
const { CheckCircle, Circle, Play, Pause, RotateCcw, Calendar, TrendingUp, Target } = lucideReact;

const WalkingApp = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentDay, setCurrentDay] = useState(1);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [dailyData, setDailyData] = useState({});
  const [weeklyStats, setWeeklyStats] = useState({});

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    } else if (!isTimerRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const weekData = {
    1: {
      title: "Foundation Building",
      target: "30-35 minutes",
      pace: "Comfortable/conversational",
      description: "Build the habit with consistent, comfortable walks",
      goals: ["Walk 6 days, rest 1 day", "Focus on consistency over speed", "Aim for 3,000-4,000 steps per session"]
    },
    2: {
      title: "Building Endurance", 
      target: "40-45 minutes",
      pace: "Mix comfortable + brisk intervals",
      description: "Add interval training to boost calorie burn",
      goals: ["Walk 6 days, rest 1 day", "Increase daily steps by 500-1,000", "Try 2-3 different routes"]
    },
    3: {
      title: "Intensity Boost",
      target: "45-55 minutes", 
      pace: "Include hills or incline",
      description: "Challenge yourself with varied terrain and inclines",
      goals: ["Walk 6 days, rest 1 day", "Include 2-3 hill/incline sessions", "Aim for 5,000-6,000 steps per session"]
    },
    4: {
      title: "Peak Performance",
      target: "50-60 minutes",
      pace: "Varied with challenges", 
      description: "Power walking with maximum variety and intensity",
      goals: ["Walk 6 days, rest 1 day", "Peak intensity sessions 3x per week", "Aim for 6,000-7,000 steps per session"]
    }
  };

  const getDayKey = (week, day) => `week${week}_day${day}`;

  const markDayComplete = (week, day) => {
    const key = getDayKey(week, day);
    const today = new Date().toLocaleDateString();
    
    setDailyData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        completed: true,
        date: today,
        walkTime: timeElapsed
      }
    }));

    // Update weekly stats
    setWeeklyStats(prev => ({
      ...prev,
      [`week${week}`]: {
        ...prev[`week${week}`],
        totalTime: (prev[`week${week}`]?.totalTime || 0) + timeElapsed,
        completedDays: (prev[`week${week}`]?.completedDays || 0) + 1
      }
    }));

    setTimeElapsed(0);
    setIsTimerRunning(false);
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeElapsed(0);
    setIsTimerRunning(false);
  };

  const isDayCompleted = (week, day) => {
    const key = getDayKey(week, day);
    return dailyData[key]?.completed || false;
  };

  const getWeekProgress = (week) => {
    const weekKey = `week${week}`;
    return weeklyStats[weekKey]?.completedDays || 0;
  };

  const getCurrentWeekData = () => weekData[currentWeek];

  return React.createElement('div', {
    className: "max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen"
  }, [
    React.createElement('div', {
      key: 'header',
      className: "bg-white rounded-lg shadow-lg p-6 mb-6"
    }, [
      React.createElement('h1', {
        key: 'title',
        className: "text-3xl font-bold text-center text-gray-800 mb-2"
      }, "Walking Weight Loss Tracker"),
      React.createElement('p', {
        key: 'subtitle',
        className: "text-center text-gray-600"
      }, "Your 4-week progressive walking routine")
    ]),

    React.createElement('div', {
      key: 'week-nav',
      className: "bg-white rounded-lg shadow-lg p-6 mb-6"
    }, [
      React.createElement('div', {
        key: 'week-buttons',
        className: "flex justify-center space-x-2 mb-4"
      }, [1, 2, 3, 4].map(week =>
        React.createElement('button', {
          key: week,
          onClick: () => setCurrentWeek(week),
          className: `px-4 py-2 rounded-lg font-semibold transition-colors ${
            currentWeek === week 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`
        }, `Week ${week}`)
      )),
      
      React.createElement('div', {
        key: 'week-info',
        className: "text-center"
      }, [
        React.createElement('h2', {
          key: 'week-title',
          className: "text-2xl font-bold text-gray-800 mb-2"
        }, `Week ${currentWeek}: ${getCurrentWeekData().title}`),
        React.createElement('p', {
          key: 'week-desc',
          className: "text-gray-600 mb-2"
        }, getCurrentWeekData().description),
        React.createElement('div', {
          key: 'week-details',
          className: "flex justify-center space-x-6 text-sm"
        }, [
          React.createElement('div', {
            key: 'target',
            className: "flex items-center"
          }, [
            React.createElement(Target, {
              key: 'target-icon',
              className: "w-4 h-4 mr-1 text-blue-500"
            }),
            React.createElement('span', {
              key: 'target-text'
            }, [React.createElement('strong', { key: 'target-label' }, 'Target:'), ` ${getCurrentWeekData().target}`])
          ]),
          React.createElement('div', {
            key: 'pace',
            className: "flex items-center"
          }, [
            React.createElement(TrendingUp, {
              key: 'pace-icon',
              className: "w-4 h-4 mr-1 text-green-500"
            }),
            React.createElement('span', {
              key: 'pace-text'
            }, [React.createElement('strong', { key: 'pace-label' }, 'Pace:'), ` ${getCurrentWeekData().pace}`])
          ])
        ])
      ])
    ]),

    React.createElement('div', {
      key: 'timer',
      className: "bg-white rounded-lg shadow-lg p-6 mb-6"
    }, [
      React.createElement('h3', {
        key: 'timer-title',
        className: "text-xl font-bold text-gray-800 mb-4 text-center"
      }, "Walk Timer"),
      React.createElement('div', {
        key: 'timer-content',
        className: "text-center"
      }, [
        React.createElement('div', {
          key: 'time-display',
          className: "text-6xl font-bold text-blue-500 mb-4"
        }, formatTime(timeElapsed)),
        React.createElement('div', {
          key: 'timer-buttons',
          className: "flex justify-center space-x-4"
        }, [
          !isTimerRunning ? 
            React.createElement('button', {
              key: 'start',
              onClick: startTimer,
              className: "flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            }, [
              React.createElement(Play, {
                key: 'play-icon',
                className: "w-5 h-5 mr-2"
              }),
              "Start Walk"
            ]) :
            React.createElement('button', {
              key: 'pause',
              onClick: pauseTimer,
              className: "flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            }, [
              React.createElement(Pause, {
                key: 'pause-icon',
                className: "w-5 h-5 mr-2"
              }),
              "Pause"
            ]),
          React.createElement('button', {
            key: 'reset',
            onClick: resetTimer,
            className: "flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          }, [
            React.createElement(RotateCcw, {
              key: 'reset-icon',
              className: "w-5 h-5 mr-2"
            }),
            "Reset"
          ])
        ]),
        timeElapsed > 0 && React.createElement('button', {
          key: 'complete',
          onClick: () => markDayComplete(currentWeek, currentDay),
          className: "mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        }, "Complete Today's Walk")
      ])
    ]),

    React.createElement('div', {
      key: 'progress',
      className: "bg-white rounded-lg shadow-lg p-6 mb-6"
    }, [
      React.createElement('h3', {
        key: 'progress-title',
        className: "text-xl font-bold text-gray-800 mb-4"
      }, `Week ${currentWeek} Progress`),
      React.createElement('div', {
        key: 'days-grid',
        className: "grid grid-cols-7 gap-2 mb-4"
      }, [1, 2, 3, 4, 5, 6, 7].map(day => {
        const isCompleted = isDayCompleted(currentWeek, day);
        const isRestDay = day === 7;
        return React.createElement('div', {
          key: day,
          className: `p-3 rounded-lg text-center cursor-pointer transition-colors ${
            isRestDay 
              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
              : isCompleted 
                ? 'bg-green-100 text-green-700 border border-green-200'
                : currentDay === day 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`,
          onClick: () => !isRestDay && setCurrentDay(day)
        }, React.createElement('div', {
          className: "flex flex-col items-center"
        }, isRestDay ? [
          React.createElement('span', {
            key: 'rest-label',
            className: "text-xs font-medium"
          }, "REST"),
          React.createElement('span', {
            key: 'rest-day',
            className: "text-xs"
          }, "Day")
        ] : isCompleted ? [
          React.createElement(CheckCircle, {
            key: 'check-icon',
            className: "w-6 h-6 mb-1"
          }),
          React.createElement('span', {
            key: 'day-label',
            className: "text-xs"
          }, `Day ${day}`)
        ] : [
          React.createElement(Circle, {
            key: 'circle-icon',
            className: "w-6 h-6 mb-1"
          }),
          React.createElement('span', {
            key: 'day-label',
            className: "text-xs"
          }, `Day ${day}`)
        ]));
      })),
      React.createElement('div', {
        key: 'progress-text',
        className: "text-center text-sm text-gray-600"
      }, `Progress: ${getWeekProgress(currentWeek)}/6 walking days completed`)
    ]),

    React.createElement('div', {
      key: 'goals',
      className: "bg-white rounded-lg shadow-lg p-6"
    }, [
      React.createElement('h3', {
        key: 'goals-title',
        className: "text-xl font-bold text-gray-800 mb-4"
      }, `Week ${currentWeek} Goals`),
      React.createElement('ul', {
        key: 'goals-list',
        className: "space-y-2"
      }, getCurrentWeekData().goals.map((goal, index) =>
        React.createElement('li', {
          key: index,
          className: "flex items-start"
        }, [
          React.createElement(Circle, {
            key: 'goal-icon',
            className: "w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
          }),
          React.createElement('span', {
            key: 'goal-text',
            className: "text-gray-700"
          }, goal)
        ])
      ))
    ]),

    Object.keys(weeklyStats).length > 0 && React.createElement('div', {
      key: 'stats',
      className: "bg-white rounded-lg shadow-lg p-6 mt-6"
    }, [
      React.createElement('h3', {
        key: 'stats-title',
        className: "text-xl font-bold text-gray-800 mb-4"
      }, "Overall Progress"),
      React.createElement('div', {
        key: 'stats-grid',
        className: "grid grid-cols-1 md:grid-cols-4 gap-4"
      }, [1, 2, 3, 4].map(week => {
        const stats = weeklyStats[`week${week}`];
        return React.createElement('div', {
          key: week,
          className: "text-center p-4 bg-gray-50 rounded-lg"
        }, [
          React.createElement('h4', {
            key: 'stat-week',
            className: "font-semibold text-gray-800"
          }, `Week ${week}`),
          React.createElement('p', {
            key: 'stat-days',
            className: "text-2xl font-bold text-blue-500"
          }, `${stats?.completedDays || 0}/6`),
          React.createElement('p', {
            key: 'stat-label',
            className: "text-xs text-gray-600"
          }, "days completed"),
          stats?.totalTime && React.createElement('p', {
            key: 'stat-time',
            className: "text-sm text-gray-600 mt-1"
          }, `${Math.round(stats.totalTime / 60)} min total`)
        ]);
      }))
    ])
  ]);
};

ReactDOM.render(React.createElement(WalkingApp), document.getElementById('root'));
