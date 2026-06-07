import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast, ToastContainer } from 'react-toastify';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['breakfast', 'lunch', 'snacks', 'dinner'];
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', snacks: 'Snacks', dinner: 'Dinner' };

const emptyWeek = () =>
  DAYS.map(day => ({ day, breakfast: '', lunch: '', snacks: '', dinner: '' }));

const MessMenu = () => {
  const userData = useSelector(state => state.userStorage.data);
  const [menu, setMenu] = useState(emptyWeek());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(import.meta.env.VITE_BASE_URL + '/HA/messMenu', { withCredentials: true })
      .then(res => {
        if (res.data.menu?.length) {
          const filled = emptyWeek().map(blank => {
            const found = res.data.menu.find(r => r.day === blank.day);
            return found ? { ...blank, ...found } : blank;
          });
          setMenu(filled);
        }
      })
      .catch(() => toast.error('Failed to load existing menu.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (dayIndex, meal, value) => {
    setMenu(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], [meal]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(
        import.meta.env.VITE_BASE_URL + '/HA/messMenu',
        { menu },
        { withCredentials: true }
      );
      toast.success('Mess menu saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save mess menu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading mess menu...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen px-4 py-16">
      <ToastContainer />
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-blue-700">Manage Mess Menu</h1>
            <p className="text-sm text-gray-500 mt-1">Hostel {userData?.hostelNo} — set meals for each day of the week</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-700 hover:bg-blue-600 text-white"
          >
            {saving ? 'Saving...' : 'Save Menu'}
          </Button>
        </div>

        <Card className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="px-4 py-3 text-left font-semibold w-28">Day</th>
                {MEALS.map(m => (
                  <th key={m} className="px-4 py-3 text-left font-semibold">{MEAL_LABELS[m]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {menu.map((row, i) => (
                <tr key={row.day} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-2 font-semibold text-blue-800 align-top pt-3">{row.day}</td>
                  {MEALS.map(m => (
                    <td key={m} className="px-2 py-2">
                      <textarea
                        rows={2}
                        value={row[m]}
                        onChange={e => handleChange(i, m, e.target.value)}
                        placeholder={`e.g. Idli, Sambar`}
                        className="w-full min-w-[120px] rounded border border-gray-200 px-2 py-1 text-sm text-gray-700 focus:outline-none focus:border-blue-400 resize-none"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-700 hover:bg-blue-600 text-white"
          >
            {saving ? 'Saving...' : 'Save Menu'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessMenu;
