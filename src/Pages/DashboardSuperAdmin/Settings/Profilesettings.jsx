import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

import { Button } from '../../../components/ui/button.jsx';
import { Input } from '../../../components/ui/input';
import { setUserData } from '../../../Store/Reducers/userSlice';

const Profilesettings = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userStorage.data);
  const [mobile, setMobile] = useState(userData?.mobile || '');
  const [saving, setSaving] = useState(false);

  const saveMobile = async (event) => {
    event.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);

    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      toast.error('Enter a valid 10 digit mobile number');
      return;
    }

    setSaving(true);
    try {
      const res = await axios.patch(
        import.meta.env.VITE_BASE_URL + '/SA/updateMobile',
        { mobile: cleanMobile },
        { withCredentials: true }
      );

      dispatch(setUserData({ ...userData, mobile: res.data.mobile }));
      toast.success('Mobile number updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update mobile number');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Super Admin Profile</h1>
        <p className="mt-1 text-sm text-gray-500">This mobile number is used for Telegram HMS verification.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input value={userData?.email || ''} readOnly className="mt-1 bg-gray-50" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <Input value={userData?.role || 'SuperAdmin'} readOnly className="mt-1 bg-gray-50" />
          </div>
        </div>

        <form onSubmit={saveMobile} className="mt-6">
          <label className="text-sm font-medium text-gray-700">Mobile number</label>
          <Input
            value={mobile}
            onChange={(event) => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10 digit mobile number"
            required
            className="mt-1 max-w-sm"
          />
          <Button type="submit" disabled={saving} className="mt-4 bg-blue-600 hover:bg-blue-700">
            {saving ? 'Saving...' : 'Save Mobile'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profilesettings;
