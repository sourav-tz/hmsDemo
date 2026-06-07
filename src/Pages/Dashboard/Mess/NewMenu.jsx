import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['breakfast', 'lunch', 'snacks', 'dinner'];
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', snacks: 'Snacks', dinner: 'Dinner' };

const todayName = () => new Date().toLocaleDateString('en-US', { weekday: 'long' });

const NewMenu = () => {
  const userData = useSelector(state => state.userStorage.data);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const hostelNo = userData?.hostelNo;
    if (!hostelNo) {
      setError('You are not assigned to a hostel yet.');
      setLoading(false);
      return;
    }

    axios.get(import.meta.env.VITE_BASE_URL + '/student/messMenu', {
      params: { hostelNo },
      withCredentials: true,
    })
      .then(res => setMenu(res.data.menu || []))
      .catch(() => setError('Could not load mess menu. Please try again later.'))
      .finally(() => setLoading(false));
  }, [userData]);

  const today = todayName();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Loading mess menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  const hasAnyData = menu.some(d => MEALS.some(m => d[m]));

  if (!hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
        <h1 className="text-3xl text-blue-700 font-semibold">Mess Menu</h1>
        <p className="text-gray-500">No mess menu has been set for your hostel yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen px-4 py-16">
      <h1 className="text-3xl font-semibold text-blue-700 mb-1">Weekly Mess Menu</h1>
      <p className="text-gray-500 mb-6 text-sm">Hostel {userData?.hostelNo}</p>

      {/* Desktop table */}
      <Card className="w-full max-w-5xl overflow-x-auto mb-8 hidden md:block">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="px-4 py-3 font-semibold">Day</th>
              {MEALS.map(m => (
                <th key={m} className="px-4 py-3 font-semibold">{MEAL_LABELS[m]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, i) => {
              const row = menu.find(d => d.day === day) || {};
              const isToday = day === today;
              return (
                <tr key={day} className={`border-b border-gray-100 ${isToday ? 'bg-blue-50 font-medium' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-semibold text-blue-800">
                    {day}
                    {isToday && <span className="ml-2 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">Today</span>}
                  </td>
                  {MEALS.map(m => (
                    <td key={m} className="px-4 py-3 text-gray-700 whitespace-pre-wrap">{row[m] || <span className="text-gray-300">—</span>}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Mobile cards */}
      <div className="flex flex-col gap-4 w-full max-w-lg md:hidden">
        {DAYS.map(day => {
          const row = menu.find(d => d.day === day) || {};
          const isToday = day === today;
          return (
            <Card key={day} className={`p-4 ${isToday ? 'border-2 border-blue-500' : ''}`}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold text-blue-800 text-base">{day}</h3>
                {isToday && <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">Today</span>}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {MEALS.map(m => (
                  <div key={m}>
                    <p className="text-gray-400 text-xs uppercase tracking-wide">{MEAL_LABELS[m]}</p>
                    <p className="text-gray-700">{row[m] || '—'}</p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default NewMenu;
