import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Chart from "react-apexcharts";
import {
  FaCoffee,
  FaAppleAlt,
  FaHamburger,
  FaCookieBite,
  FaFire,
  FaDumbbell,
  FaCarrot,
  FaChartPie,
  FaRunning,
  FaBalanceScale
} from "react-icons/fa";

const mealIcons = {
  breakfast: <FaCoffee className="text-amber-500" size={18} />,
  lunch: <FaHamburger className="text-orange-500" size={18} />,
  dinner: <FaAppleAlt className="text-emerald-500" size={18} />,
  snack: <FaCookieBite className="text-rose-500" size={18} />,
};

const Home = () => {
  const [workouts, setWorkouts] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resWorkout, resNutrition] = await Promise.all([
          axios.get(API_PATHS.WORKOUT.GET_ALL_WORKOUT),
          axios.get(API_PATHS.NUTRITION.GET_ALL_NUTRITION)
        ]);
        setWorkouts(resWorkout.data);
        setNutrition(resNutrition.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const calorieData = () => {
    const result = {};
    nutrition.forEach((item) => {
      result[item.mealType] = (result[item.mealType] || 0) + (item.totalCalories || 0);
    });
    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  const workoutTypeData = () => {
    const result = {};
    workouts.forEach((item) => {
      result[item.category] = (result[item.category] || 0) + 1;
    });
    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  const macroData = () => {
    const totals = { protein: 0, carbs: 0, fats: 0 };
    nutrition.forEach((entry) => {
      if (entry.foodItems && Array.isArray(entry.foodItems)) {
        entry.foodItems.forEach((item) => {
          totals.protein += Number(item.protein) || 0;
          totals.carbs += Number(item.carbs) || 0;
          totals.fats += Number(item.fats) || 0;
        });
      }
    });
    return Object.entries(totals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  };

  const topWorkoutData = () => {
    return workouts.slice(0, 5).map((w) => ({
      name: w.exercise,
      sets: w.sets,
      reps: w.reps
    }));
  };

  // Calculate summary stats
  const totalCalories = Math.round(calorieData().reduce((sum, item) => sum + item.value, 0));
  const totalWorkouts = workouts.length;
  const avgSets = workouts.reduce((sum, w) => sum + w.sets, 0) / totalWorkouts || 0;
  const avgReps = workouts.reduce((sum, w) => sum + w.reps, 0) / totalWorkouts || 0;

  // Chart options
  const chartOptions = {
    chart: {
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
      fontFamily: 'Inter, sans-serif',
      foreColor: '#64748B'
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 10
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      marker: {
        show: true,
      }
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontWeight: 500,
      itemMargin: {
        horizontal: 12,
        vertical: 8
      },
      markers: {
        radius: 4,
        width: 12,
        height: 12
      }
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          fontSize: '11px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '11px',
          fontWeight: 500
        }
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Fitness Tracking Dashboard</h1>
          <div className="text-sm text-slate-500 mt-2 md:mt-0">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Calories</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{totalCalories.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-rose-50 text-rose-500">
                <FaFire size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Workouts</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{totalWorkouts}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-500">
                <FaDumbbell size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Avg. Sets</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{avgSets.toFixed(1)}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 text-amber-500">
                <FaChartPie size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Avg. Reps</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{avgReps.toFixed(1)}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-500">
                <FaCarrot size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nutrition */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Recent Nutrition</h2>
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                  {nutrition.length} entries
                </span>
              </div>
              <div className="space-y-3">
                {nutrition.slice(0, 4).map((n) => (
                  <div key={n._id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100">
                        {mealIcons[n.mealType]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 capitalize">{n.mealType}</p>
                        <p className="text-xs text-slate-500">{n.foodItem}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-800">{n.totalCalories} cal</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Workouts */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Recent Workouts</h2>
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                  {workouts.length} workouts
                </span>
              </div>
              <div className="space-y-3">
                {workouts.slice(0, 4).map((w) => (
                  <div key={w._id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-800 capitalize">{w.exercise}</p>
                      <p className="text-xs text-slate-500 capitalize">{w.category}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-800">
                      {w.sets} × {w.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Macronutrients */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Macronutrients</h2>
            <Chart
              type="radialBar"
              height={300}
              options={{
                ...chartOptions,
                plotOptions: {
                  radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    hollow: {
                      size: '60%',
                    },
                    track: {
                      background: '#E2E8F0',
                      strokeWidth: '90%',
                    },
                    dataLabels: {
                      name: {
                        fontSize: '12px',
                        color: '#64748B',
                        offsetY: -5
                      },
                      value: {
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#0F172A',
                        offsetY: 0,
                        formatter: (val) => `${val}g`
                      },
                      total: {
                        show: true,
                        label: 'Total',
                        color: '#64748B',
                        fontSize: '12px',
                        formatter: () => {
                          const total = macroData().reduce((sum, m) => sum + m.value, 0);
                          return `${total.toFixed(2)}g`;
                        }
                      }
                    }
                  }
                },
                colors: ['#3B82F6', '#10B981', '#F59E0B'],
                labels: macroData().map(d => d.name),
                stroke: {
                  lineCap: 'round'
                }
              }}
              series={macroData().map(d => d.value)}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Calories by Meal */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Calories by Meal</h2>
            <Chart
              type="donut"
              height={300}
              options={{
                ...chartOptions,
                colors: ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'],
                labels: calorieData().map(d => d.name),
                plotOptions: {
                  pie: {
                    donut: {
                      size: '60%',
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: 'Total Calories',
                          color: '#64748B',
                          fontSize: '12px',
                          formatter: () => `${totalCalories} cal`
                        },
                        value: {
                          fontSize: '20px',
                          fontWeight: 700,
                          color: '#0F172A'
                        }
                      }
                    }
                  }
                },
                dataLabels: {
                  enabled: false
                },
                legend: {
                  position: 'right',
                  horizontalAlign: 'center'
                }
              }}
              series={calorieData().map(d => d.value)}
            />
          </div>

          {/* Workout Type Split */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Workout Type Split</h2>
            <Chart
              type="pie"
              height={300}
              options={{
                ...chartOptions,
                colors: ['#3B82F6', '#F59E0B', '#EF4444', '#10B981'],
                labels: workoutTypeData().map(d => d.name),
                plotOptions: {
                  pie: {
                    expandOnClick: true,
                    donut: {
                      size: '60%'
                    },
                    dataLabels: {
                      offset: 10,
                      minAngleToShowLabel: 10
                    }
                  }
                },
                dataLabels: {
                  enabled: true,
                  style: {
                    fontSize: '12px',
                    fontWeight: 500
                  },
                  formatter: (val, { seriesIndex, w }) => {
                    return `${w.config.labels[seriesIndex]}\n${val.toFixed(1)}%`;
                  }
                  
                },
                legend: {
                  position: 'right',
                  horizontalAlign: 'center'
                }
              }}
              series={workoutTypeData().map(d => d.value)}
            />
          </div>
        </div>

        {/* Bottom Charts - Added the two missing charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Protein / Carbs / Fats */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Macronutrient Distribution</h2>
            <Chart
              type="radar"
              height={350}
              options={{
                ...chartOptions,
                colors: ['#3B82F6', '#10B981', '#F59E0B'],
                markers: {
                  size: 5,
                  hover: {
                    size: 7
                  }
                },
                xaxis: {
                  categories: macroData().map(d => d.name),
                },
                yaxis: {
                  show: false,
                  min: 0
                },
                plotOptions: {
                  radar: {
                    size: 140,
                    polygons: {
                      strokeColors: '#E2E8F0',
                      fill: {
                        colors: ['#F8FAFC', '#fff']
                      }
                    }
                  }
                },
                dataLabels: {
                  enabled: true,
                  background: {
                    enabled: true,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: '#E2E8F0',
                    opacity: 0.9
                  },
                  style: {
                    fontSize: '12px',
                    fontWeight: 500
                  }
                },
                tooltip: {
                  y: {
                    formatter: (val) => `${val}g`
                  }
                }
              }}
              series={[{
                name: "Macros (g)",
                data: macroData().map(d => d.value)
              }]}
            />
          </div>

          {/* Workout Comparison */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Workout Comparison</h2>
            <Chart
              type="bar"
              height={350}
              options={{
                ...chartOptions,
                colors: ['#6366F1', '#8B5CF6'],
                plotOptions: {
                  bar: {
                    horizontal: false,
                    borderRadius: 6,
                    columnWidth: '70%',
                    dataLabels: {
                      position: 'top'
                    }
                  }
                },
                xaxis: {
                  categories: topWorkoutData().map(d => d.name),
                },
                dataLabels: {
                  enabled: true,
                  formatter: (val) => val,
                  offsetY: -20,
                  style: {
                    fontSize: '12px',
                    colors: ['#64748B']
                  }
                },
                legend: {
                  position: 'top'
                },
                tooltip: {
                  shared: true,
                  intersect: false,
                  y: {
                    formatter: (val) => `${val} sets`
                  }
                }
              }}
              series={[
                {
                  name: "Sets",
                  data: topWorkoutData().map(d => d.sets),
                },
                {
                  name: "Reps",
                  data: topWorkoutData().map(d => d.reps),
                }
              ]}
            />
          </div>
        </div>

        {/* Top Workouts */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Top Workouts by Sets</h2>
          <Chart
            type="bar"
            height={300}
            options={{
              ...chartOptions,
              colors: ['#6366F1'],
              plotOptions: {
                bar: {
                  borderRadius: 6,
                  columnWidth: '45%',
                  distributed: false,
                  dataLabels: {
                    position: 'top'
                  }
                }
              },
              xaxis: {
                categories: topWorkoutData().map(d => d.name),
              },
              dataLabels: {
                enabled: true,
                formatter: (val) => val,
                offsetY: -20,
                style: {
                  fontSize: '12px',
                  colors: ['#64748B']
                }
              },
              tooltip: {
                y: {
                  formatter: (val) => `${val} sets`
                }
              }
            }}
            series={[{
              name: "Sets",
              data: topWorkoutData().map(d => d.sets),
            }]}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;